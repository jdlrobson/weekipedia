import trends from 'wikily-edit-trends'

/**
 * use the wikily-edit-trends module which maintains a list of the
 * weeks top topic - trigger an update and then ger the interesting
 * topics from the last week.
 */
function trending() {
  return trends.update().then( function () {
    return trends.get();
  } );
}

export default trending

