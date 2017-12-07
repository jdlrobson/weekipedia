import mwApi from './mwApi'

const ENT = 'tv/movie';
const EVENT = 'event';
const POLITICS = 'politics';
const AWARDS = 'awards';

function categoriesToTags( pages ) {
  const keywords = {
    actors: 'film',
    deaths: 'death',
    wrestling: 'wrestling',
    // e.g. Time person of the year
    'annual magazine': 'publication',
    'current wildfires': 'wildfire',
    events: 'event',
    sports: 'sports',
    royalty: 'monarchy',
    motorsport: 'sports',
    scandals: 'scandal',
    controversies: 'scandal',
    'cabinet members': POLITICS,
    elections: POLITICS,
    politicians: POLITICS,
    presidential: POLITICS,
    'house of representatives': POLITICS,
    films: ENT,
    'awards and honors': AWARDS,
    winners: AWARDS,
    'video games': ENT,
    'game franchises': ENT,
    'football players': 'sports',
    'football coaches': 'sports',
    ' videos': 'entertainment',
    'baseball players': 'sports',
    '–present': EVENT,
    'category:leaders': POLITICS,
    'television seasons': ENT,
    'tv series': ENT,
    'upcoming albums': 'music'
  };

  return pages.map( function ( page ) {
    var tags = [];
    var categories = page.categories || [];
    categories.forEach( function ( category ) {
      const title = category.toLowerCase();
      Object.keys( keywords ).forEach( function ( keyword ) {
        var tag = keywords[keyword]
        if ( title.indexOf( keyword ) > -1 && tags.indexOf( tag ) === -1 ) {
          tags.push( tag );
        }
      } );
    } );
    page.tags = tags;
    return page;
  } );
}

function propEnricher( arr, props, lang, project, params ) {
  lang = lang || 'en';
  project = project || 'wikipedia';
  params = params || {};

  if ( arr.length > 50 ) {
    throw 'Too many items passed. Max limit is 50.';
  }

  var titles = [];
  if ( typeof arr[0] === 'string' ) {
    arr = arr.map( function ( title ) {
      return {
        title: title
      };
    } );
  }
  arr.forEach( function ( page ) {
    titles.push( page.title );
  } );
  params = Object.assign( params, {
    redirects: '',
    prop: props.join( '|' ),
    titles: titles.join( '|' )
  } );
  if ( props.indexOf( 'pageimages' ) > -1 ) {
    params.pilimit = 50;
    params.pithumbsize = 120;
  }
  if ( props.indexOf( 'coordinates' ) > -1 ) {
    params.colimit = 'max';
  }
  if ( props.indexOf( 'categories' ) > -1 ) {
    params.clshow = '!hidden';
    params.cllimit = 'max';
  }
  if ( props.indexOf( 'pageterms' ) > -1 ) {
    params.wbptterms = 'description';
  }

  return mwApi( lang, params, project ).then( function ( data ) {
    var index = {};
    var pages = data.pages;
    var redirects = {};
    if ( data.redirects ) {
      data.redirects.forEach( ( redirect ) => {
        redirects[redirect.from] = redirect.to;
      } );
    }

    pages.forEach( function ( page ) {
      index[page.title] = {};
      index[page.title].description = page.description;
      if ( page.thumbnail && page.pageimage ) {
        page.thumbnail.title = 'File:' + page.pageimage;
      }
      if ( page.categories ) {
        index[page.title].categories = page.categories.map( function ( category ) {
          return category.title;
        } );
      }
      index[page.title].thumbnail = page.thumbnail;
      index[page.title].coordinates = page.coordinates;
      if ( page.missing ) {
        index[page.title].missing = true;
      }
    } )
    arr.forEach( function ( page ) {
      var t = page.title.replace( /_/gi, ' ' );
      var obj = index[t] || index[redirects[t]] || {};
      page.thumbnail = obj.thumbnail;
      if ( obj.missing ) {
        page.missing = true;
      }
      page.categories = obj.categories;
      page.coordinates = obj.coordinates;
      if ( obj.description && !page.description ) {
        page.description = obj.description;
      }
    } );
    return categoriesToTags( arr );
  } ).catch( function () {
    // Looks like the endpoint is down or no internet connection - so return original array
    return arr;
  } );
}

export default propEnricher
