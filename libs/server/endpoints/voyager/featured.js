import domino from 'domino'

import addProps from './../prop-enricher'
import page from './../page'

export default function() {
  return page( 'Main_Page', 'en', 'wikivoyage' ).then( function ( json ) {
    var pages = [];
    var window = domino.createWindow( '<div>' + json.lead.sections[0].text + '</div>' );
    var document = window.document;
    window = domino.createWindow(
      '<div>' + document.querySelector('#mf-mapbanner ~ .mf-mobile-only' ).innerHTML + '</div>'
    );
    document = window.document;
    pages.push( document.querySelector('a[title]').getAttribute('title' ) );
    return addProps( pages, [ 'pageimages', 'pageterms' ], 'en', 'wikivoyage' )
  }).then( (pages) => {
    return {
      pages: pages
    };
  } );
};
