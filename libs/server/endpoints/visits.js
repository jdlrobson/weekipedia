import pageviews from 'pageviews';
import addProps from './prop-enricher'

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

export default function ( lang, project ) {
  var results = {};
  var twoHours = ( 2 * 60 * 60 * 1000 );
  // use 2 hrs ago to give browser time to catch up
  var today = new Date( new Date() - twoHours );
  var day = ( 24 * 60 * 60 * 1000 );
  var yesterday = new Date( today - day );
  var beforeYesterday = new Date( yesterday - day );

  return pageviews.getTopPageviews( {
    project: lang + '.' + project,
    year: yesterday.getUTCFullYear(),
    month: yesterday.getUTCMonth() + 1,
    day: yesterday.getUTCDate(),
    limit: 50
  } ).then(function( result ) {
    result.items[0].articles.forEach( function ( item ) {
      if ( !isBlacklisted( item.article ) ) {
        results[item.article] = { title: item.article.replace( /_/gi, ' ' ), lang: lang, visits: item.views, delta: item.views };
      }
    } );
    return pageviews.getTopPageviews( {
      project: lang + '.' + project,
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

    return addProps( pages, [ 'pageimages','pageterms' ], lang, project )
  } ).then( function ( pages ) {
    pages = pages.sort( function ( a, b ) {
      if ( !a.delta ) {
        return 1;
      } else {
        return a.delta < b.delta ? 1 : -1;
      }
    } );

    return { pages: pages };
  } ).catch( function () {
    return { pages: [] };
  } );
}