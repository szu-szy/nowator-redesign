/**
 * Formularze — redirect na stronę podziękowania po wysłaniu CF7 + drobny UX.
 * @package nowator
 */
export function initForms() {
	document.addEventListener( 'wpcf7mailsent', () => {
		const url = ( document.documentElement.dataset.nowatorThankyouUrl || '/dziekujemy/' );
		setTimeout( () => { window.location.assign( url ); }, 250 );
	}, false );

	document.addEventListener( 'wpcf7invalid', ( e ) => {
		const form = e.target;
		const bad = form && form.querySelector( '.wpcf7-not-valid' );
		if ( bad ) {
			bad.scrollIntoView( { behavior: 'smooth', block: 'center' } );
		}
	}, false );
}
