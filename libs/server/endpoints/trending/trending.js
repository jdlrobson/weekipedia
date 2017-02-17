import fetch from 'isomorphic-fetch'
import week from './week'

/**
 * @param {String} wiki name of wiki to generate a list of trending articles for
 * @param {Float} halflife in hours at which pages become less trending
 * @param {String} project e.g. wikipedia or wikivoyage
 * @param {String} [title] for debugging purposes
 */
function trending( wiki, halflife, project, title ) {
  var lang = wiki.replace( 'wiki', '' );
  project = project || 'wikipedia';
  halflife = parseInt( halflife, 10 );
  var key = wiki + '-' + halflife;

  function filterLowEdits(json) {
    json.pages = json.pages.filter((page) => {
      return page.totalEdits > ( halflife + 5 );
    });
    return json;
  }

  function score(json) {
    // FIXME: This block of code reverses the decay in the score and applies a new one.

    json.pages.forEach((page) => {
      var start = new Date( page.since || page.updated );
      var age = ( new Date() - start ) / 1000 / 60;
      var defaultHl = Math.pow(0.5, age / ( 1.5 * 60 ));
      var exponential = Math.pow(0.5, age / ( halflife * 60 ));
      // FIXME: undo default halflife decay
      page.trendiness /= defaultHl;
      // apply the new half life decay based on parameter
      page.trendiness *= exponential;
    });

    // Sort with the new scores.
    json.pages = json.pages.sort((page1, page2) => {
      return page1.trendiness > page2.trendiness ? -1 : 1;
    });

    if ( halflife < 12 ) {
      json.pages = json.pages.filter((page) => {
        // FIXME: soon since will be available giving more accurate results
        var start = page.since || page.updated;
        return (new Date() - new Date(start)) / ( 1000 * 60 * 60 ) < halflife;
      });
    }

    return json;
  }

  if ( halflife < 25 ) {
    // TODO: soon in next deploy no filtering needed
    return fetch('https://' + lang + '.' + project + '.org/api/rest_v1/feed/trending/edits').then(( data ) => {
      return data.json();
    }).then(filterLowEdits).then(score);
  } else {
    return week.load().then(filterLowEdits).then(score);
  }
}

export default trending
