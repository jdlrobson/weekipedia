const MIN_EDITS = 8;

function calcScore( q, hrs ) {
  var exponential = Math.pow( 0.5, q.age() / ( hrs * 60 ) );
  var visitScore = q.views > 0 ? q.views : 0;
  var editScore = ( ( -4 * q.volatileFlags ) + ( q.edits - q.anonEdits - ( q.reverts / 2 ) - MIN_EDITS ) + ( q.anonEdits * 0.2 ) );
  var numContributors = q.anons.length + q.contributors.length;
  var byteScore = ( q.bytesChanged / ( q.edits / numContributors ) );
  if ( byteScore < 0 ) {
    byteScore = -byteScore;
  }
  var contributionScore = byteScore * ( q.contributors.length / 2 );

  if ( q.views > 0 && hrs < 84 ) {
    visitScore = -visitScore;
  }
  var bias = q.getBias();
  if ( bias === 0 ) {
    bias = 1;
  }

  var base = ( visitScore + editScore ) /
    bias *
    contributionScore *
    exponential;

  return base;
}

export default calcScore
