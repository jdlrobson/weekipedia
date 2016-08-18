import WikiSocketCollection from 'wikitrender'
const project = process.env.PROJECT || 'wikipedia';

const collection = new WikiSocketCollection( {
  id: 'mysocket',
  project: '*.' + project + '.org',
  minPurgeTime: 40,
  maxLifespan: ( 60 * 24 ) * 7,
  maxInactivity: ( 60 * 24 ) * 7,
  minSpeed: 0.1
} );

export default collection
