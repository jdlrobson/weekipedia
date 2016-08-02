import pageviews from 'pageviews';
import addProps from './../prop-enricher'

const blacklist = [ 'Main_Page', 'Web_scraping', 'Special:', '-', 'Talk:', 'User:', 'File:' ];

function isBlacklisted( title ) {
  var blacklisted = false;
  blacklist.forEach( function ( term ) {
    if ( title.indexOf( term ) > -1 ) {
      blacklisted = true;
    }
  } );
  return blacklisted;
}

export default function ( lang ) {
  var results = {};
  var today = new Date();
  var day = ( 24 * 60 * 60 * 1000 );
  var yesterday = new Date( today - day );
  var beforeYesterday = new Date( yesterday - day );

  return pageviews.getTopPageviews( {
    project: lang + '.wikipedia',
    year: yesterday.getFullYear(),
    month: yesterday.getMonth() + 1,
    day: yesterday.getDate(),
    limit: 50
  } ).then(function( result ) {
    result.items[0].articles.forEach( function ( item ) {
      if ( !isBlacklisted( item.article ) ) {
        results[item.article] = { title: item.article.replace( /_/gi, ' ' ), lang: lang, visits: item.views };
      }
    } );
    return pageviews.getTopPageviews( {
      project: lang + '.wikipedia',
      year: beforeYesterday.getFullYear(),
      month: beforeYesterday.getMonth() + 1,
      day: beforeYesterday.getDate(),
      limit: 500
    } )
  } ).then( function ( result ) {
    result.items[0].articles.forEach( function ( item ) {
      if ( results[item.article] ) {
        results[item.article].delta = results[item.article].visits - item.views;
      }
    } );
  } ).then( function () {
    var pages = [];
    var key;
    for( key in results ) {
      if( results.hasOwnProperty( key ) ) {
        pages.push( results[key] );
      }
    }

    return addProps( pages, [ 'pageimages','pageterms' ] )
  } ).then( function ( pages ) {
    return pages.sort( function ( a, b ) {
      if ( !a.delta ) {
        return 1;
      } else {
        return a.delta < b.delta ? 1 : -1;
      }
    } );
  } );
}