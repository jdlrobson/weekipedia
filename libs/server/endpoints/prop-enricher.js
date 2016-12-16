import mwApi from './mwApi'

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
      index[page.title].thumbnail = page.thumbnail;
      index[page.title].coordinates = page.coordinates;
      index[page.title].pageprops = page.pageprops;
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
      page.coordinates = obj.coordinates;
      if ( obj.description && !page.description ) {
        page.description = obj.description;
      }
      page.pageprops = obj.pageprops;
    } );
    return arr;
  } ).catch( function () {
    // Looks like the endpoint is down or no internet connection - so return original array
    return arr;
  } );
}

export default propEnricher
