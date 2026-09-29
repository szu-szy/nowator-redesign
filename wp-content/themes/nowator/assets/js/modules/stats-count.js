/**
 * Stat count-up (fail-safe: markup already shows the real final number —
 * this only re-animates 0 -> target once the element is confirmed on screen).
 * @package nowator
 */
export function initStatsCount() {
	const prefersReduced = window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches;
	if ( prefersReduced || ! ( 'IntersectionObserver' in window ) ) {
		return;
	}
	const statEls = document.querySelectorAll( '.stats__num[data-count]' );
	if ( ! statEls.length ) {
		return;
	}
	const easeOutQuad = ( t ) => t * ( 2 - t );
	const animateCount = ( el ) => {
		const target = parseInt( el.dataset.count, 10 );
		const valEl = el.querySelector( '.stats__num-val' );
		if ( ! valEl || Number.isNaN( target ) ) {
			return;
		}
		const duration = 900;
		const start = performance.now();
		const step = ( now ) => {
			const p = Math.min( ( now - start ) / duration, 1 );
			valEl.textContent = Math.round( target * easeOutQuad( p ) );
			if ( p < 1 ) {
				requestAnimationFrame( step );
			}
		};
		requestAnimationFrame( step );
	};
	const statsIo = new IntersectionObserver( ( entries ) => {
		entries.forEach( ( entry ) => {
			if ( entry.isIntersecting ) {
				animateCount( entry.target );
				statsIo.unobserve( entry.target );
			}
		} );
	}, { threshold: 0.4 } );
	statEls.forEach( ( el ) => statsIo.observe( el ) );
}
