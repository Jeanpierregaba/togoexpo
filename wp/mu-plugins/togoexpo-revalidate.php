<?php
/**
 * Plugin Name: TogoExpo — revalidation du front
 * Description: Prévient le front Next.js à chaque publication, mise à jour ou mise à la corbeille d'un article ou d'une édition, pour que le site public se mette à jour immédiatement.
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
