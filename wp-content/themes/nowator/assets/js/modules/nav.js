/**
 * Nav: scroll state, burger toggle, mobile mega-menu tap-to-expand.
 * @package nowator
 */
export function initNav() {
	const nav = document.getElementById( 'nav' );
	if ( nav ) {
		window.addEventListener( 'scroll', () => {
			nav.classList.toggle( 'is-scrolled', window.scrollY > 60 );
		}, { passive: true } );
	}

	// Menu mobilne: fokus-trap + blokada scrolla + ESC (parytet z "naszym standardem"
	// drawera - zero-koszt bezpieczeństwa WCAG 2.4.3, ta sama logika co
	// wp-builder-mobile-drawer, dopasowana do istniejącego mechanizmu is-open zamiast
	// przepisywania na osobny <dialog>/panel).
	const burger = document.getElementById( 'burger' );
	const links = document.querySelector( '.nav__links' );
	const FOCUSABLE = 'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])';
	let navLastFocused = null;

	const navTrap = ( e ) => {
		if ( 'Escape' === e.key ) {
			closeNav();
			return;
		}
		if ( 'Tab' !== e.key ) return;
		const f = links.querySelectorAll( FOCUSABLE );
		if ( ! f.length ) return;
		const first = f[ 0 ], last = f[ f.length - 1 ];
		if ( e.shiftKey && document.activeElement === first ) { e.preventDefault(); last.focus(); }
		else if ( ! e.shiftKey && document.activeElement === last ) { e.preventDefault(); first.focus(); }
	};

	function openNav() {
		navLastFocused = document.activeElement;
		links.classList.add( 'is-open' );
		burger.setAttribute( 'aria-expanded', 'true' );
		document.body.style.overflow = 'hidden';
		document.addEventListener( 'keydown', navTrap );
		( links.querySelector( FOCUSABLE ) || links ).focus();
	}

	function closeNav() {
		links.classList.remove( 'is-open' );
		burger.setAttribute( 'aria-expanded', 'false' );
		document.body.style.overflow = '';
		document.removeEventListener( 'keydown', navTrap );
		if ( navLastFocused ) navLastFocused.focus();
	}

	if ( burger && links ) {
		burger.addEventListener( 'click', () => {
			links.classList.contains( 'is-open' ) ? closeNav() : openNav();
		} );
		document.querySelectorAll( '.nav__links > a' ).forEach( ( a ) => {
			a.addEventListener( 'click', () => closeNav() );
		} );
	}

	const navItem = document.querySelector( '.nav__item' );
	if ( navItem && window.matchMedia( '(max-width: 860px)' ).matches ) {
		navItem.querySelector( 'a' ).addEventListener( 'click', ( e ) => {
			e.preventDefault();
			navItem.classList.toggle( 'is-open' );
		} );
	}
}
