import trends from 'wikily-edit-trends'

/**
 * @param {String} wiki name of wiki to generate a list of trending articles for
 * @param {Float} halflife in hours at which pages become less trending
 * @param {String} project e.g. wikipedia or wikivoyage
 * @param {String} [title] for debugging purposes
 */
function trending() {
  return trends.update().then( function () {
    return trends.get();
  });
}

export default trending

