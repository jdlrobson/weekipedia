import mwApi from './mwApi'

function propEnricher( arr, props, lang, project ) {
  lang = lang || 'en';
  project = project || 'wikipedia';

  if ( arr.length > 50 ) {
    throw 'Too many items passed. Max limit is 50.';
  }

  var titles = [];
  arr.forEach( function (page) {
    titles.push( page.title );
  });
  var params = {
    prop: props.join('|'),
    titles: titles.join( '|' )
  };
  if ( props.indexOf('pageimages') > -1 ) {
    params.pilimit = 50;
    params.pithumbsize = 120;
  }
  if ( props.indexOf('pageterms') > -1 ) {
    params.wbptterms = 'description';
  }

  return mwApi( lang, params, project ).then( function( data ) {
    var index = {};
    var pages = data.pages;

    pages.forEach(function(page){
      index[page.title] = {};
      if ( page.description ) {
        index[page.title].description = page.description;
      }
      index[page.title].thumbnail = page.thumbnail;
    })
    arr.forEach(function(page){
      var obj = index[page.title];
      page.thumbnail = obj.thumbnail;
      page.description = obj.description;
    });
    return arr;
  }).catch( function () {
    // Looks like the endpoint is down or no internet connection - so return original array
    return arr;
  });
}

export default propEnricher
