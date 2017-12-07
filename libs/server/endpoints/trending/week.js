import trends from 'wikily-edit-trends'

/**
 * use the wikily-edit-trends module which maintains a list of the
 * weeks top topic - trigger an update and then ger the interesting
 * topics from the last week.
 * @param {String} url to obtain the trends for the last 24 hr period.
 */
function trending( url ) {
  return trends.update( url ).then( function () {
    return trends.get();
  } );
}

export default trending

