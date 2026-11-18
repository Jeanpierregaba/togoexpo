# 42 — Préparation de la mise en ligne (étape 4 du plan de déploiement)

## Contexte
L'ancien site WordPress (togoexpo.tg) publie 33 articles (2020–2025) à la racine (`/<slug>/`). Ils seront importés tels quels dans le CMS headless (`cms.togoexpo.tg`) et servis par le front sous `/fr/actualites/<slug>`.

## Front (fait)
- `frontend/legacy-posts.js` : les 33 slugs relevés via l'API REST publique de l'ancien site (21/10/2026). À compléter si l'ancien site publie encore avant la bascule.
- `next.config.js` › `redirects()` (308, destinations préfixées `/fr`) :
  - 33 articles : `/<slug>` (et sous-chemins) → `/fr/actualites/<slug>` ;
  - anciennes pages : comité → `/fr/a-propos#comite`, missions → `/fr/a-propos#missions`, présentation → `/fr/togo`, participation → `/fr/editions`, galerie et vidéos → `/fr/mediatheque`, blog → `/fr/actualites`, devenir-sponsor → `/fr/contact?motif=partenariat`, evenement → `/fr/editions`, home → `/fr` ;
  - archives WordPress : `/category/*`, `/tag/*`, `/author/*`, `/AAAA/*`, `/feed/*` → `/fr/actualites`.
  - Les URL avec barre finale font 2 sauts (normalisation Next puis règle) — sans incidence SEO.
- Actualités : `GET_POSTS` passé de 20 à 100 sur la liste, de 50 à 100 pour la génération des pages article.
- `/api/revalidate` : secret accepté aussi en en-tête `x-revalidate-secret` (hors journaux d'accès) ; corps JSON optionnel `{ "slug": "..." }` → purge en plus `/{fr,en,ja}/actualites/<slug>`.

## Vérif
- `npm run audit` OK. Redirections testées en local (chaîne complète) ; l'article répond 404 en local tant que les 33 articles ne sont pas importés dans le CMS (étape 3). `/api/revalidate` refuse un mauvais secret (401).

## WordPress — à installer par l'agent CMS (`wp/mu-plugins/`, hors périmètre front)
Fichier `wp/mu-plugins/togoexpo-revalidate.php`. (21/10/2026 : corrigé — la première version envoyait l'appel en « non bloquant », que WordPress abandonne avant de l'envoyer ; vérifié sur un WordPress Docker.) Constantes à ajouter dans `wp-config.php` :
`define('TOGOEXPO_FRONT_URL', 'https://www.togoexpo.tg');` et `define('TOGOEXPO_REVALIDATE_SECRET', '<même valeur que REVALIDATE_SECRET sur Vercel>');`

```php
<?php
/**
 * Plugin Name: TogoExpo — revalidation du front
 * Description: Prévient le front Next.js (Vercel) à chaque publication, mise à jour ou mise à la corbeille d'un article ou d'une édition, pour que le site public se mette à jour immédiatement.
 */
if (!defined('ABSPATH')) exit;

/**
 * Les contenus touchés pendant la requête sont mis en file, puis le front est
 * prévenu une fois en fin de requête PHP. L'appel attend la réponse (délai
 * court) : un appel « non bloquant » de WordPress abandonne au bout d'une
 * milliseconde, avant même d'ouvrir la connexion, et n'arrive jamais au front.
 */
function togoexpo_revalidate_queue($slug = null) {
    static $queue = [];
    if ($slug !== null) $queue[$slug] = true;
    return array_keys($queue);
}

add_action('transition_post_status', function ($new, $old, $post) {
    if (!in_array($post->post_type, ['post', 'edition'], true)) return;
    if (wp_is_post_revision($post) || wp_is_post_autosave($post)) return;
    // Publication, mise à jour d'un contenu publié, ou dépublication.
    if ($new === 'publish' || $old === 'publish') {
        togoexpo_revalidate_queue($post->post_type === 'post' ? $post->post_name : '');
    }
}, 10, 3);

add_action('shutdown', function () {
    $slugs = togoexpo_revalidate_queue();
    if (!$slugs || !defined('TOGOEXPO_FRONT_URL') || !defined('TOGOEXPO_REVALIDATE_SECRET')) return;
    // Sous PHP-FPM, la réponse part d'abord vers le navigateur : l'admin n'attend pas le front.
    if (function_exists('fastcgi_finish_request')) fastcgi_finish_request();
    foreach ($slugs as $slug) {
        $r = wp_remote_post(rtrim(TOGOEXPO_FRONT_URL, '/') . '/api/revalidate', [
            'headers' => ['Content-Type' => 'application/json', 'x-revalidate-secret' => TOGOEXPO_REVALIDATE_SECRET],
            'body'    => wp_json_encode(['slug' => $slug]),
            'timeout' => 5,
        ]);
        if (is_wp_error($r) || wp_remote_retrieve_response_code($r) !== 200) {
            error_log('[togoexpo] revalidation failed: ' . (is_wp_error($r) ? $r->get_error_message() : wp_remote_retrieve_response_code($r)));
        }
    }
});
```
