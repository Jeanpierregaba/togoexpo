<?php
/**
 * Plugin Name: TogoExpo — brouillon anglais automatique
 * Description: À la première publication d'un article en français, prépare sa version anglaise en brouillon (traduction LibreTranslate, hébergée sur le serveur), liée à l'original dans Polylang. Il reste à la relire puis à la publier.
 */
if (!defined('ABSPATH')) exit;

/**
 * Déroulé :
 *   1. un article français passe à « Publié » sans traduction anglaise ;
 *   2. la traduction est programmée juste après (tâche WP-Cron), pour que le clic
 *      sur « Publier » n'attende pas le service de traduction ;
 *   3. le brouillon anglais reprend le slug français suivi de `-en` (le front y
 *      mène depuis le sélecteur de langue), la date, l'image à la une et les
 *      catégories anglaises correspondantes.
 *
 * À la main, sur le serveur :
 *   docker compose run --rm wpcli togoexpo translate <id> [--dry-run]
 */

const TOGOEXPO_TRANSLATE_HOOK = 'togoexpo_translate_post';

add_action('transition_post_status', function ($new, $old, $post) {
    if ($new !== 'publish' || $old === 'publish' || $post->post_type !== 'post') return;
    if (!function_exists('pll_get_post_language')) return;
    if (wp_is_post_revision($post) || wp_is_post_autosave($post)) return;
    // Polylang enregistre la langue après le changement de statut : la vérification
    // finale a lieu dans la tâche. Ici on écarte seulement les articles anglais.
    if (pll_get_post_language($post->ID) === 'en') return;
    if (!wp_next_scheduled(TOGOEXPO_TRANSLATE_HOOK, [$post->ID])) {
        wp_schedule_single_event(time() + 5, TOGOEXPO_TRANSLATE_HOOK, [$post->ID]);
    }
}, 20, 3);

add_action(TOGOEXPO_TRANSLATE_HOOK, function ($post_id) {
    $r = togoexpo_translate_post((int) $post_id);
    if (is_wp_error($r)) error_log('[togoexpo-translate] ' . $post_id . ' : ' . $r->get_error_message());
});

/**
 * Crée le brouillon anglais d'un article français. Renvoie l'identifiant du
 * brouillon, ou, avec $dry_run, la traduction sans rien enregistrer.
 *
 * @return int|array|WP_Error
 */
function togoexpo_translate_post($post_id, $dry_run = false) {
    $post = get_post($post_id);
    if (!$post || $post->post_type !== 'post') return new WP_Error('togo_post', 'article introuvable');
    if (!function_exists('pll_get_post_language')) return new WP_Error('togo_pll', 'Polylang absent');
    if (pll_get_post_language($post_id) !== 'fr') return new WP_Error('togo_lang', 'article non français');
    $tr = pll_get_post_translations($post_id);
    if (!empty($tr['en'])) return new WP_Error('togo_done', 'traduction anglaise déjà présente (' . $tr['en'] . ')');

    $title = togoexpo_translate_texts([$post->post_title], 'text');
    if (is_wp_error($title)) return $title;
    $content = togoexpo_translate_html($post->post_content);
    if (is_wp_error($content)) return $content;

    if ($dry_run) return ['title' => $title[0], 'content' => $content];

    $cats = [];
    foreach (wp_get_post_categories($post_id) as $cat) {
        $en = pll_get_term($cat, 'en');
        if ($en) $cats[] = (int) $en;
    }
    $id = wp_insert_post([
        'post_type'     => 'post',
        'post_status'   => 'draft',
        'post_name'     => $post->post_name . '-en',
        'post_title'    => wp_slash($title[0]),
        'post_content'  => wp_slash($content),
        'post_date'     => $post->post_date,
        'post_date_gmt' => $post->post_date_gmt,
        'post_author'   => (int) $post->post_author,
        'post_category' => $cats,
    ], true);
    if (is_wp_error($id)) return $id;
    pll_set_post_language($id, 'en');
    pll_save_post_translations(array_merge($tr, ['en' => $id]));
    $thumb = get_post_thumbnail_id($post_id);
    if ($thumb) set_post_thumbnail($id, $thumb);
    update_post_meta($id, '_togoexpo_machine_translation', gmdate('c'));
    return $id;
}

/**
 * Traduit un contenu HTML sans toucher aux commentaires de blocs Gutenberg
 * (`<!-- wp:paragraph -->`) : seuls les morceaux qui portent du texte partent au
 * service, en un seul appel.
 */
function togoexpo_translate_html($html) {
    $parts = preg_split('/(<!--.*?-->)/s', $html, -1, PREG_SPLIT_DELIM_CAPTURE);
    $todo = [];
    foreach ($parts as $i => $part) {
        if (strpos($part, '<!--') === 0) continue;
        $text = trim(html_entity_decode(wp_strip_all_tags($part), ENT_QUOTES, 'UTF-8'), " \t\n\r\0\x0B\xC2\xA0");
        if ($text !== '') $todo[$i] = $part;
    }
    if (!$todo) return $html;
    $done = togoexpo_translate_texts(array_values($todo), 'html');
    if (is_wp_error($done)) return $done;
    // Le service rogne les espaces et retours à la ligne autour de chaque morceau :
    // on les remet, pour garder la mise en page du contenu d'origine.
    foreach (array_keys($todo) as $n => $i) {
        preg_match('/^\s*/', $parts[$i], $lead);
        preg_match('/\s*$/', $parts[$i], $trail);
        $parts[$i] = $lead[0] . trim($done[$n]) . $trail[0];
    }
    return implode('', $parts);
}

/** Appel à LibreTranslate (français vers anglais). */
function togoexpo_translate_texts(array $texts, $format) {
    if (!defined('TOGOEXPO_TRANSLATE_URL')) return new WP_Error('togo_cfg', 'TOGOEXPO_TRANSLATE_URL non défini');
    $r = wp_remote_post(rtrim(TOGOEXPO_TRANSLATE_URL, '/') . '/translate', [
        'headers' => ['Content-Type' => 'application/json'],
        'body'    => wp_json_encode(['q' => $texts, 'source' => 'fr', 'target' => 'en', 'format' => $format]),
        'timeout' => 180,
    ]);
    if (is_wp_error($r)) return $r;
    $code = wp_remote_retrieve_response_code($r);
    $body = json_decode(wp_remote_retrieve_body($r), true);
    if ($code !== 200 || !isset($body['translatedText'])) {
        return new WP_Error('togo_api', 'LibreTranslate a répondu ' . $code . ' : ' . wp_remote_retrieve_body($r));
    }
    $out = (array) $body['translatedText'];
    return count($out) === count($texts) ? $out : new WP_Error('togo_api', 'réponse incomplète');
}

/** Rappel dans l'éditeur : un brouillon traduit automatiquement est à relire. */
add_action('admin_notices', function () {
    $screen = function_exists('get_current_screen') ? get_current_screen() : null;
    if (!$screen || $screen->base !== 'post') return;
    $post = get_post();
    if (!$post || $post->post_status === 'publish' || !get_post_meta($post->ID, '_togoexpo_machine_translation', true)) return;
    echo '<div class="notice notice-warning"><p><strong>Traduction automatique.</strong> Ce brouillon anglais a été traduit par machine depuis l’article français : relisez-le (titre, noms propres, tournures) avant de le publier.</p></div>';
});

if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('togoexpo translate', function ($args, $assoc) {
        $r = togoexpo_translate_post((int) $args[0], !empty($assoc['dry-run']));
        if (is_wp_error($r)) WP_CLI::error($r->get_error_message());
        if (is_array($r)) {
            WP_CLI::line('TITRE : ' . $r['title']);
            WP_CLI::line($r['content']);
            return;
        }
        WP_CLI::success("brouillon anglais créé : $r");
    }, ['shortdesc' => 'Prépare le brouillon anglais d’un article français (--dry-run : affiche la traduction seulement).']);
}
