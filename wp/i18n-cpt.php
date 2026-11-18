<?php
// Inspection + activation du CPT edition pour Polylang.
echo 'translated_post_types=';
var_export( PLL()->model->get_translated_post_types() );
echo "\n";
$o = get_option( 'polylang' );
echo 'opt_post_types=';
var_export( isset( $o['post_types'] ) ? $o['post_types'] : null );
echo "\n";
if ( ! in_array( 'edition', (array) $o['post_types'], true ) ) {
	$o['post_types'][] = 'edition';
	update_option( 'polylang', $o );
	echo "edition_added\n";
}
