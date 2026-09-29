/**
 * Entry ES module — ładuje moduły interakcji po DOM ready.
 * @package nowator
 */
import { initNav } from './modules/nav.js';
import { initReveal } from './modules/reveal.js';
import { initStatsCount } from './modules/stats-count.js';
import { initTripModal } from './modules/trip-modal.js';
import { initForms } from './modules/forms.js';
import { initLeadConversion } from './modules/lead-conversion.js';
import { initCookies } from './modules/cookies.js';

const boot = () => {
	initNav();
	initReveal();
	initStatsCount();
	initCookies();
	initTripModal();
	initForms();
	initLeadConversion();
};

if ( 'loading' === document.readyState ) {
	document.addEventListener( 'DOMContentLoaded', boot );
} else {
	boot();
}
