/**
 * "Nearest trip" modal - shows once per session, closable via backdrop/X/Esc/CTA.
 * 2026-09-19: nie może się już pokazywać PRZED rozstrzygnięciem zgody na
 * cookies (dwa modale naraz walczące o uwagę) - czeka na 'nowator:cookies-
 * consent' (albo pokazuje się od razu, jeśli zgoda jest już zapisana z
 * wcześniejszej wizyty), ten sam wzorzec co w innych motywach tej sesji.
 * @package nowator
 */
const COOKIE_CONSENT_KEY = 'nowator_cookies_consent'; // musi być zgodny z modules/cookies.js
const DELAY_MS = 1600;

function hasCookieConsent() {
	try {
		return !! localStorage.getItem( COOKIE_CONSENT_KEY );
	} catch ( e ) {
		return true; // storage zablokowany — nie blokuj modala w nieskończoność
	}
}

export function initTripModal() {
	const tripModal = document.getElementById( 'tripModal' );
	if ( ! tripModal ) {
		return;
	}
	const openModal = () => {
		tripModal.classList.add( 'is-open' );
		tripModal.setAttribute( 'aria-hidden', 'false' );
		try {
			sessionStorage.setItem( 'nowator-trip-modal-seen', '1' );
		} catch ( e ) { /* private mode etc — non-fatal, modal just reopens next load */ }
	};
	const closeModal = () => {
		tripModal.classList.remove( 'is-open' );
		tripModal.setAttribute( 'aria-hidden', 'true' );
	};
	tripModal.querySelectorAll( '[data-modal-close]' ).forEach( ( el ) => {
		el.addEventListener( 'click', closeModal );
	} );
	document.addEventListener( 'keydown', ( e ) => {
		if ( 'Escape' === e.key && tripModal.classList.contains( 'is-open' ) ) {
			closeModal();
		}
	} );
	let alreadySeen = false;
	try {
		alreadySeen = '1' === sessionStorage.getItem( 'nowator-trip-modal-seen' );
	} catch ( e ) { /* ignore */ }
	if ( alreadySeen ) return;

	const scheduleOpen = () => setTimeout( openModal, DELAY_MS );
	if ( hasCookieConsent() ) {
		scheduleOpen();
	} else {
		document.addEventListener( 'nowator:cookies-consent', scheduleOpen, { once: true } );
	}
}
