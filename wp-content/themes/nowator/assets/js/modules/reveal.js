/**
 * Scroll reveal: arm .js-reveal only after JS confirmed running (fail-safe —
 * content stays visible by default via CSS, see .reveal rules in base.css).
 * @package nowator
 */
export function initReveal() {
	const prefersReduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	if ( ! prefersReduced ) {
		document.documentElement.classList.add( 'js-reveal' );
	}

	if ( ! prefersReduced && 'IntersectionObserver' in window ) {
		const io = new IntersectionObserver( ( entries ) => {
			entries.forEach( ( entry ) => {
				if ( entry.isIntersecting ) {
					entry.target.classList.add( 'is-visible' );
					io.unobserve( entry.target );
				}
			} );
		}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' } );
		document.querySelectorAll( '.reveal' ).forEach( ( el ) => io.observe( el ) );
	} else {
		document.querySelectorAll( '.reveal' ).forEach( ( el ) => el.classList.add( 'is-visible' ) );
	}
}
