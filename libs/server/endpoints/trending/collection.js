import WikiSocketCollection from 'wikitrender'
const project = process.env.PROJECT || 'wikipedia';

const TREND_ENABLED = process.env.TREND_ENABLED ?
  Boolean( parseInt( process.env.TREND_ENABLED, 10 ) ) : false;

var collection;

if ( TREND_ENABLED ) {
  collection = new WikiSocketCollection( {
    id: 'mysocket',
    project: 'en.' + project + '.org',
    minPurgeTime: 40,
    maxLifespan: ( 60 * 24 ) * 7,
    maxInactivity: ( 60 * 24 ) * 7,
    minSpeed: 0.1
  } );
}

export default collection
