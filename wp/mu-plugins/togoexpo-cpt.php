<?php
/**
 * Plugin Name: TogoExpo CPT (must-use)
 * Description: CPT Editions / Evenements / Partenaires + exposition WPGraphQL. Aucun ACF requis pour T1 : les champs vivent en post_meta et sont exposes via editionFields.
 * Version: 0.1.0
 */

defined('ABSPATH') || exit;

add_action('init', function (): void {
    register_post_type('edition', [
        'labels' => ['name' => 'Éditions', 'singular_name' => 'Édition'],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'has_archive' => 'editions',
        'rewrite' => ['slug' => 'editions'],
        'supports' => ['title', 'editor', 'thumbnail', 'excerpt'],
        'menu_icon' => 'dashicons-flag',
        'show_in_graphql' => true,
        'graphql_single_name' => 'Edition',
        'graphql_plural_name' => 'Editions',
    ]);

    register_post_type('evenement', [
        'labels' => ['name' => 'Événements', 'singular_name' => 'Événement'],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'has_archive' => 'evenements',
        'rewrite' => ['slug' => 'evenements'],
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-calendar-alt',
        'show_in_graphql' => true,
        'graphql_single_name' => 'Evenement',
        'graphql_plural_name' => 'Evenements',
    ]);

    register_post_type('partenaire', [
        'labels' => ['name' => 'Partenaires', 'singular_name' => 'Partenaire'],
        'public' => true,
        'show_ui' => true,
        'show_in_rest' => true,
        'has_archive' => false,
        'rewrite' => ['slug' => 'partenaires'],
        'supports' => ['title', 'thumbnail'],
        'menu_icon' => 'dashicons-groups',
        'show_in_graphql' => true,
        'graphql_single_name' => 'Partenaire',
        'graphql_plural_name' => 'Partenaires',
    ]);
});

add_action('graphql_register_types', function (): void {
    if (!function_exists('register_graphql_object_type') || !function_exists('register_graphql_field')) {
        return;
    }

    register_graphql_object_type('EditionFields', [
        'description' => 'Champs metier d une edition (uble post_meta, migrable vers ACF).',
        'fields' => [
            'annee' => ['type' => 'Integer'],
            'ville' => ['type' => 'String'],
            'pays' => ['type' => 'String'],
            'theme' => ['type' => 'String'],
            'dateDebut' => ['type' => 'String'],
            'dateFin' => ['type' => 'String'],
            'videoUrl' => ['type' => 'String'],
            'estEvenementFutur' => ['type' => 'Boolean'],
        ],
    ]);

    register_graphql_field('Edition', 'editionFields', [
        'type' => 'EditionFields',
        'description' => 'Champs metier de l edition.',
        'resolve' => function ($post): array {
            $id = $post->ID ?? 0;
            $futur = get_post_meta($id, 'estEvenementFutur', true);
            return [
                'annee' => (int) get_post_meta($id, 'annee', true),
                'ville' => (string) get_post_meta($id, 'ville', true),
                'pays' => (string) get_post_meta($id, 'pays', true),
                'theme' => (string) get_post_meta($id, 'theme', true),
                'dateDebut' => (string) get_post_meta($id, 'dateDebut', true),
                'dateFin' => (string) get_post_meta($id, 'dateFin', true),
                'videoUrl' => (string) get_post_meta($id, 'videoUrl', true),
                'estEvenementFutur' => $futur === '1' || $futur === 1 || $futur === true,
            ];
        },
    ]);
});
