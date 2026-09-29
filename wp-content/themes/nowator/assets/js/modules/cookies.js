/**
 * Modal zgody na cookies — natywny (2026-09-19, zastąpił Cookie Law Info/
 * CookieYes). Dispatch 'nowator:cookies-consent' zamiast pluginowego
 * 'cookieyes_consent_update' — tracking.js zaktualizowany żeby nasłuchiwać
 * tego eventu bezpośrednio (bez CookieYes API pośrodku).
 * @package nowator
 */
const STORAGE_KEY = 'nowator_cookies_consent';

function readConsent() {
	try {
		const raw = localStorage.getItem( STORAGE_KEY );
		return raw ? JSON.parse( raw ) : null;
	} catch ( e ) {
		return null;
	}
}

function writeConsent( consent ) {
	try {
		localStorage.setItem( STORAGE_KEY, JSON.stringify( consent ) );
	} catch ( e ) { /* prywatna karta — zgoda tylko na tę sesję */ }
	document.dispatchEvent( new CustomEvent( 'nowator:cookies-consent', { detail: consent } ) );
}

export function initCookies() {
	const modal = document.querySelector( '[data-cookies]' );
	const reopenBtn = document.querySelector( '[data-cookies-reopen]' );
	if ( ! modal ) return;

	const backdrop = modal.querySelector( '[data-cookies-backdrop]' );
	const settingsPanel = modal.querySelector( '[data-cookies-settings]' );
	const acceptBtn = modal.querySelector( '[data-cookies-accept]' );
	const necessaryBtn = modal.querySelector( '[data-cookies-necessary]' );
	const toggleSettingsBtn = modal.querySelector( '[data-cookies-toggle-settings]' );
	const saveBtn = modal.querySelector( '[data-cookies-save]' );
	const categoryInputs = modal.querySelectorAll( '[data-cookies-cat]' );
	let lastFocused = null;

	const open = () => {
		lastFocused = document.activeElement;
		modal.hidden = false;
		document.body.style.overflow = 'hidden';
		( modal.querySelector( 'button' ) || modal ).focus();
	};

	const close = () => {
		modal.hidden = true;
		document.body.style.overflow = '';
		if ( reopenBtn ) reopenBtn.hidden = false;
		if ( lastFocused && typeof lastFocused.focus === 'function' ) lastFocused.focus();
	};

	const buildConsent = ( analytics, marketing ) => ( { necessary: true, analytics, marketing, ts: Date.now() } );

	const consent = readConsent();
	if ( consent ) {
		if ( reopenBtn ) reopenBtn.hidden = false;
		document.dispatchEvent( new CustomEvent( 'nowator:cookies-consent', { detail: consent } ) );
	} else {
		open();
	}

	if ( acceptBtn ) acceptBtn.addEventListener( 'click', () => { writeConsent( buildConsent( true, true ) ); close(); } );
	if ( necessaryBtn ) necessaryBtn.addEventListener( 'click', () => { writeConsent( buildConsent( false, false ) ); close(); } );
	if ( saveBtn ) {
		saveBtn.addEventListener( 'click', () => {
			const analytics = modal.querySelector( '[data-cookies-cat="analytics"]' )?.checked ?? false;
			const marketing = modal.querySelector( '[data-cookies-cat="marketing"]' )?.checked ?? false;
			writeConsent( buildConsent( analytics, marketing ) );
			close();
		} );
	}
	if ( toggleSettingsBtn && settingsPanel ) {
		toggleSettingsBtn.addEventListener( 'click', () => { settingsPanel.hidden = ! settingsPanel.hidden; } );
	}
	if ( backdrop ) {
		backdrop.addEventListener( 'click', () => { /* klik w tło NIE zapisuje zgody, tylko chowa do reload/reopen */ } );
	}
	document.addEventListener( 'keydown', ( e ) => {
		if ( modal.hidden ) return;
		if ( 'Escape' === e.key ) { modal.hidden = true; document.body.style.overflow = ''; return; }
		if ( 'Tab' === e.key ) {
			const focusable = modal.querySelectorAll( 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])' );
			if ( ! focusable.length ) return;
			const first = focusable[ 0 ];
			const last = focusable[ focusable.length - 1 ];
			if ( e.shiftKey && document.activeElement === first ) { e.preventDefault(); last.focus(); }
			else if ( ! e.shiftKey && document.activeElement === last ) { e.preventDefault(); first.focus(); }
		}
	} );

	if ( reopenBtn ) {
		reopenBtn.addEventListener( 'click', () => {
			const saved = readConsent();
			if ( saved ) {
				categoryInputs.forEach( ( input ) => { input.checked = !! saved[ input.dataset.cookiesCat ]; } );
				if ( settingsPanel ) settingsPanel.hidden = false;
			}
			open();
		} );
	}
}
