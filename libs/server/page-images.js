import fetch from 'isomorphic-fetch'

function addPageImages( arr ) {
  if ( arr.length > 50 ) {
    throw 'Too many items passed. Max limit is 50.';
  }

  // TODO: Support for multi-languages
  var base = 'https://en.wikipedia.org/w/api.php';
  var titles = [];
  arr.forEach( function (page) {
    titles.push(encodeURIComponent(page.title));
  });
  var url = base + '?action=query&format=json&prop=pageimages&pilimit=50&titles='
    + titles.join('|') + '&formatversion=2';

  return fetch( url ).then(function(resp) {
    return resp.json();
  }).then(function(data) {
    var index = {};
    var pages = data.query.pages;

    pages.forEach(function(page){
      index[page.title] = page.thumbnail;
    })
    arr.forEach(function(page){
      page.thumbnail = index[page.title];
    });
    return arr;
  });
}

export default addPageImages;
