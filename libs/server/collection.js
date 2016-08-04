import WikiSocketCollection from 'WikiSocketCollection'

const collection = new WikiSocketCollection( {
  id: 'mysocket',
  project: '*.wikipedia.org',
  minPurgeTime: 20,
  maxLifespan: ( 60 * 24 ) * 7,
  maxInactivity: ( 60 * 24 ) * 7,
  minSpeed: 0.1
} );

export default collection
