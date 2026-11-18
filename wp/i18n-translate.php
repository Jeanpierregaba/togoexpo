<?php
// Traductions EN + JA des editions et actus FR + liaison Polylang.
// Usage : wpcli eval-file /tmp/pll-translate.php (relancer sans risque : idempotent).
$editions = array(
	'osaka-2025' => array(
		'thumb' => 17,
		'en'    => array(
			'title'   => 'Osaka 2025',
			'ville'   => 'Osaka',
			'pays'    => 'Japan',
			'theme'   => 'Inclusion and social protection',
			'pavillon' => "Togo's pavilion highlights inclusion and social protection as drivers of growth: crafts, agro-processing and investment opportunities.",
		),
		'ja'    => array(
			'title'   => '大阪 2025',
			'ville'   => '大阪',
			'pays'    => '日本',
			'theme'   => 'インクルージョンと社会保障',
			'pavillon' => 'トーゴ館は、成長の原動力としてインクルージョンと社会保障を発信します。工芸品、農産加工、投資機会を紹介します。',
		),
	),
	'dubai-2021' => array(
		'thumb' => 18,
		'en'    => array(
			'title'   => 'Dubai 2021',
			'ville'   => 'Dubai',
			'pays'    => 'UAE',
			'theme'   => 'Connecting Minds, Creating the Future',
			'pavillon' => 'In Dubai, Togo showcases its connectivity, port logistics and startup ecosystem as gateways to West Africa.',
		),
		'ja'    => array(
			'title'   => 'ドバイ 2021',
			'ville'   => 'ドバイ',
			'pays'    => 'UAE',
			'theme'   => '心をつなぎ、未来を創る',
			'pavillon' => 'ドバイでは、西アフリカへの玄関口としてトーゴの連結性、港湾物流、スタートアップのエコシステムを紹介します。',
		),
	),
	'milan-2015' => array(
		'thumb' => 0,
		'en'    => array(
			'title'   => 'Milan 2015',
			'ville'   => 'Milan',
			'pays'    => 'Italy',
			'theme'   => 'Feeding the Planet, Energy for Life',
			'pavillon' => 'In Milan, Togo promotes sustainable agriculture and local produce.',
		),
		'ja'    => array(
			'title'   => 'ミラノ 2015',
			'ville'   => 'ミラノ',
			'pays'    => 'イタリア',
			'theme'   => '地球に食料を、生命にエネルギーを',
			'pavillon' => 'ミラノでは、持続可能な農業と郷土の産品を発信します。',
		),
	),
	'shanghai-2010' => array(
		'thumb' => 0,
		'en'    => array(
			'title'   => 'Shanghai 2010',
			'ville'   => 'Shanghai',
			'pays'    => 'China',
			'theme'   => 'Better City, Better Life',
			'pavillon' => 'In Shanghai, Togo exhibits its urban culture and crafts.',
		),
		'ja'    => array(
			'title'   => '上海 2010',
			'ville'   => '上海',
			'pays'    => '中国',
			'theme'   => 'より良い都市、より良い生活',
			'pavillon' => '上海では、都市文化と工芸品を展示します。',
		),
	),
	'hanovre-2000' => array(
		'thumb' => 0,
		'en'    => array(
			'title'   => 'Hanover 2000',
			'ville'   => 'Hanover',
			'pays'    => 'Germany',
			'theme'   => 'Humankind, Nature, Technology',
			'pavillon' => 'In Hanover, Togo asserts its presence through dialogue between humankind, nature and technology.',
		),
		'ja'    => array(
			'title'   => 'ハノーファー 2000',
			'ville'   => 'ハノーファー',
			'pays'    => 'ドイツ',
			'theme'   => '人間・自然・技術',
			'pavillon' => 'ハノーファーでは、人間、自然、技術の対話を通じてトーゴの存在感を示します。',
		),
	),
	'yokohama-2027' => array(
		'thumb' => 21,
		'en'    => array(
			'title'   => 'Yokohama 2027',
			'ville'   => 'Yokohama',
			'pays'    => 'Japan',
			'theme'   => 'Scenery of the Future for Happiness',
			'pavillon' => 'Togo takes part in GREEN×EXPO 2027, the international horticultural exhibition: nature, sustainable agriculture and green innovation.',
		),
		'ja'    => array(
			'title'   => '横浜 2027',
			'ville'   => '横浜',
			'pays'    => '日本',
			'theme'   => 'Scenery of the Future for Happiness（幸せな未来の風景）',
			'pavillon' => 'トーゴは国際園芸博覧会GREEN×EXPO 2027に参加します。自然、持続可能な農業、グリーンイノベーションを発信します。',
		),
	),
	'belgrade-2027' => array(
		'thumb' => 20,
		'en'    => array(
			'title'   => 'Belgrade 2027',
			'ville'   => 'Belgrade',
			'pays'    => 'Serbia',
			'theme'   => 'Playing for Humanity: sport and music for all',
			'pavillon' => 'Togo takes part in the specialised Expo 2027 Belgrade: youth, sport, music and culture.',
		),
		'ja'    => array(
			'title'   => 'ベオグラード 2027',
			'ville'   => 'ベオグラード',
			'pays'    => 'セルビア',
			'theme'   => '人類のためにプレーする：すべての人のためのスポーツと音楽',
			'pavillon' => 'トーゴはベオグラード専門博覧会2027に参加します。若者、スポーツ、音楽、文化を発信します。',
		),
	),
);

$posts = array(
	'le-togo-a-osaka-2025' => array(
		'en' => array(
			'title'   => 'Togo asserts its economic leadership at Expo 2025 Osaka',
			'content' => 'A look back at the economic day of the Togo pavilion in Osaka: investment, agro-processing and logistics.',
		),
		'ja' => array(
			'title'   => '大阪万博2025でトーゴの経済的リーダーシップを発信',
			'content' => '大阪トーゴ館の経済デーを振り返ります。投資、農産加工、物流がテーマです。',
		),
	),
	'bilan-pavillon-togo-osaka-2025' => array(
		'en' => array(
			'title'   => "Review of Togo's pavilion at Osaka 2025",
			'content' => 'Attendance, B2B meetings and highlights of the Togolese pavilion over six months of exhibition.',
		),
		'ja' => array(
			'title'   => '大阪2025トーゴ館の成果報告',
			'content' => '半年間の展示会におけるトーゴ館の来場者、B2B商談、ハイライトを報告します。',
		),
	),
);

function togo_upsert_translation( $fr_slug, $post_type, $lang, $title, $content, $metas = array(), $thumb = 0 ) {
	$slug = $fr_slug . '-' . $lang;
	$found = get_page_by_path( $slug, OBJECT, $post_type );
	if ( $found ) {
		wp_update_post(
			array(
				'ID'           => $found->ID,
				'post_title'   => $title,
				'post_content' => $content,
				'post_status'  => 'publish',
			)
		);
		$id = $found->ID;
	} else {
		$id = wp_insert_post(
			array(
				'post_type'    => $post_type,
				'post_title'   => $title,
				'post_name'    => $slug,
				'post_content' => $content,
				'post_status'  => 'publish',
			)
		);
	}
	if ( is_wp_error( $id ) || ! $id ) {
		echo "ERR create $slug\n";
		return 0;
	}
	foreach ( $metas as $k => $v ) {
		update_post_meta( $id, $k, $v );
	}
	if ( $thumb ) {
		set_post_thumbnail( $id, $thumb );
	}
	pll_set_post_language( $id, $lang );
	return $id;
}

foreach ( $editions as $fr_slug => $data ) {
	$fr = get_page_by_path( $fr_slug, OBJECT, 'edition' );
	if ( ! $fr ) {
		echo "ERR missing FR $fr_slug\n";
		continue;
	}
	$base_metas = array(
		'annee'           => get_post_meta( $fr->ID, 'annee', true ),
		'dateDebut'       => get_post_meta( $fr->ID, 'dateDebut', true ),
		'dateFin'         => get_post_meta( $fr->ID, 'dateFin', true ),
		'estEvenementFutur' => get_post_meta( $fr->ID, 'estEvenementFutur', true ),
	);
	$ids = array( 'fr' => $fr->ID );
	foreach ( array( 'en', 'ja' ) as $lang ) {
		$t = $data[ $lang ];
		$metas = array_merge(
			$base_metas,
			array(
				'ville' => $t['ville'],
				'pays'  => $t['pays'],
				'theme' => $t['theme'],
			)
		);
		$ids[ $lang ] = togo_upsert_translation( $fr_slug, 'edition', $lang, $t['title'], $t['pavillon'], $metas, $data['thumb'] );
	}
	pll_save_post_translations( $ids );
	echo "OK edition $fr_slug fr={$ids['fr']} en={$ids['en']} ja={$ids['ja']}\n";
}

foreach ( $posts as $fr_slug => $data ) {
	$fr = get_page_by_path( $fr_slug, OBJECT, 'post' );
	if ( ! $fr ) {
		echo "ERR missing FR post $fr_slug\n";
		continue;
	}
	$thumb = get_post_thumbnail_id( $fr->ID );
	$ids = array( 'fr' => $fr->ID );
	foreach ( array( 'en', 'ja' ) as $lang ) {
		$t = $data[ $lang ];
		$ids[ $lang ] = togo_upsert_translation( $fr_slug, 'post', $lang, $t['title'], $t['content'], array(), $thumb );
	}
	pll_save_post_translations( $ids );
	echo "OK post $fr_slug fr={$ids['fr']} en={$ids['en']} ja={$ids['ja']}\n";
}
