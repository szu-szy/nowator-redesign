/**
 * Google Consent Mode v2 (default DENY) + GTM/GA4/Google Ads/Meta Pixel bootstrap,
 * consent-aware przez natywny modal cookies (2026-09-19: most do CookieYes
 * zdjęty razem z wtyczką - zastąpiony natywnym eventem 'nowator:cookies-consent',
 * patrz modules/cookies.js). Config czytany z data-attrs na <html>
 * (nowator_tracking_data_attrs(), inc/config.php) — CELOWO nie przez
 * wp_localize_script, bo to wymagałoby 'unsafe-inline' w script-src CSP.
 *
 * Klasyczny (nie-moduł) skrypt — musi wykonać się jak najwcześniej w <head>,
 * PRZED jakimkolwiek tagiem GTM/GA4.
 *
 * @package nowator
 */
( function () {
	'use strict';
	var d = document.documentElement.dataset;
	var cfg = {
		gtm: d.nowatorGtm || '',
		ga4: d.nowatorGa4 || '',
		pixel: d.nowatorPixel || '',
		ads: d.nowatorAds || '',
		conversionLabel: d.nowatorConversionLabel || '',
	};
	if ( ! cfg.gtm && ! cfg.ga4 && ! cfg.pixel && ! cfg.ads ) {
		return;
	}

	window.dataLayer = window.dataLayer || [];
	function gtag() { window.dataLayer.push( arguments ); }
	window.gtag = window.gtag || gtag;

	gtag( 'consent', 'default', {
		ad_storage: 'denied',
		ad_user_data: 'denied',
		ad_personalization: 'denied',
		analytics_storage: 'denied',
		functionality_storage: 'granted',
		security_storage: 'granted',
		wait_for_update: 500,
	} );

	function loadScript( src ) {
		var s = document.createElement( 'script' );
		s.async = true;
		s.src = src;
		document.head.appendChild( s );
	}

	function loadPixel( id ) {
		!function ( f, b, e, v, n, t, s ) {
			if ( f.fbq ) return;
			n = f.fbq = function () {
				n.callMethod ? n.callMethod.apply( n, arguments ) : n.queue.push( arguments );
			};
			if ( ! f._fbq ) f._fbq = n;
			n.push = n; n.loaded = true; n.version = '2.0'; n.queue = [];
			t = b.createElement( e ); t.async = true; t.src = v;
			s = b.getElementsByTagName( e )[ 0 ]; s.parentNode.insertBefore( t, s );
		}( window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js' );
		window.fbq( 'init', id );
		window.fbq( 'track', 'PageView' );
	}

	var pixelLoaded = false;
	function applyConsent( c ) {
		c = c || {};
		gtag( 'consent', 'update', {
			ad_storage: c.marketing ? 'granted' : 'denied',
			ad_user_data: c.marketing ? 'granted' : 'denied',
			ad_personalization: c.marketing ? 'granted' : 'denied',
			analytics_storage: c.analytics ? 'granted' : 'denied',
			functionality_storage: c.necessary ? 'granted' : 'denied',
		} );
		if ( cfg.pixel && c.marketing && ! pixelLoaded ) {
			pixelLoaded = true;
			loadPixel( cfg.pixel );
		}
	}
	document.addEventListener( 'nowator:cookies-consent', function ( e ) { applyConsent( e.detail ); } );

	if ( cfg.gtm ) {
		( function ( w, d2, s, l, i ) {
			w[ l ] = w[ l ] || [];
			w[ l ].push( { 'gtm.start': new Date().getTime(), event: 'gtm.js' } );
			var f = d2.getElementsByTagName( s )[ 0 ], j = d2.createElement( s ), dl = l != 'dataLayer' ? '&l=' + l : '';
			j.async = true;
			j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
			f.parentNode.insertBefore( j, f );
		} )( window, document, 'script', 'dataLayer', cfg.gtm );
	}

	if ( cfg.ga4 ) {
		loadScript( 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ga4 );
		gtag( 'js', new Date() );
		gtag( 'config', cfg.ga4 );
	}

	if ( cfg.ads && ! cfg.gtm ) {
		loadScript( 'https://www.googletagmanager.com/gtag/js?id=' + cfg.ads );
		gtag( 'js', new Date() );
		gtag( 'config', cfg.ads );
	}

	if ( cfg.ads && cfg.conversionLabel ) {
		gtag( 'event', 'conversion', { send_to: cfg.ads + '/' + cfg.conversionLabel } );
	}
} )();
