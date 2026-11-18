<?php
// Setup Polylang FR/EN/JA + rattache les contenus existants au français.
// Usage : wpcli eval-file /tmp/pll-setup.php
$m = PLL()->model;
foreach ( array( 'fr_FR', 'en_US', 'ja' ) as $locale ) {
	$r = $m->languages->add( array( 'locale' => $locale ) );
	echo is_wp_error( $r ) ? 'ERR ' . $r->get_error_message() . "\n" : 'OK ' . $r->slug . "\n";
}
$m->languages->update_default( 'fr' );
$ids = get_posts(
	array(
		'post_type'   => array( 'edition', 'post' ),
		'numberposts' => -1,
		'post_status' => 'any',
		'fields'      => 'ids',
	)
);
foreach ( $ids as $id ) {
	pll_set_post_language( $id, 'fr' );
}
echo 'count_fr=' . count( $ids ) . "\n";
echo 'langs=' . implode( ',', pll_languages_list() ) . "\n";
echo 'default=' . pll_default_language() . "\n";
