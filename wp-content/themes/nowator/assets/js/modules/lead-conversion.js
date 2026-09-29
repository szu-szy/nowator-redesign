/**
 * GA4: zdarzenie "generate_lead" po dotarciu na stronę podziękowania — element
 * z [data-nowator-generate-lead] oznacza tę stronę (page-dziekujemy.php).
 * Zdarzenie odpala się dopiero gdy gtag dostępny (po zgodzie, patrz tracking.js).
 * @package nowator
 */
export function initLeadConversion() {
	if ( ! document.querySelector( '[data-nowator-generate-lead]' ) ) {
		return;
	}
	window.addEventListener( 'load', function () {
		if ( 'function' === typeof window.gtag ) {
			window.gtag( 'event', 'generate_lead', { source: 'form' } );
		}
	} );
}
