import fetch from 'isomorphic-fetch'
import param from 'node-jquery-param'

function propEnricher( arr, props ) {
  if ( arr.length > 50 ) {
    throw 'Too many items passed. Max limit is 50.';
  }

  // TODO: Support for multi-languages
  var base = 'https://en.wikipedia.org/w/api.php';
  var titles = [];
  arr.forEach( function (page) {
    titles.push(encodeURIComponent(page.title));
  });
  var params = {
    prop: props.join('|')
  };
  if ( props.indexOf('pageimages') > -1 ) {
    params.pilimit = 50;
    params.pithumbsize = 120;
  }
  if ( props.indexOf('pageterms') > -1 ) {
    params.wbptterms = 'description';
  }
  var url = base + '?action=query&format=json&titles='
    + titles.join('|') + '&formatversion=2&' + param( params );

  return fetch( url ).then(function(resp) {
    return resp.json();
  }).then(function(data) {
    var index = {};
    var pages = data.query.pages;

    pages.forEach(function(page){
      index[page.title] = {};
      index[page.title].terms = page.terms;
      index[page.title].thumbnail = page.thumbnail;
    })
    arr.forEach(function(page){
      var obj = index[page.title]
      page.thumbnail = obj.thumbnail;
      page.terms = obj.terms;
    });
    return arr;
  });
}

export default propEnricher
