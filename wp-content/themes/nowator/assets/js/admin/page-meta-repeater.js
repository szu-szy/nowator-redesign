document.addEventListener( 'click', function ( e ) {
	const add = e.target.closest && e.target.closest( '.iab-rep__add' );
	if ( add ) {
		const rep = add.closest( '.iab-rep' );
		const tpl = rep.querySelector( '.iab-rep__tpl' );
		const tmp = document.createElement( 'div' );
		tmp.innerHTML = tpl.innerHTML.trim();
		rep.querySelector( '.iab-rep__list' ).appendChild( tmp.firstElementChild );
	}
	const rm = e.target.closest && e.target.closest( '.iab-rep__rm' );
	if ( rm ) {
		const row = rm.closest( '.iab-rep__row' );
		if ( row ) {
			row.remove();
		}
	}
} );
