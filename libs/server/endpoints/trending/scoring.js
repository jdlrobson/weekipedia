const MIN_EDITS = 8;

function calcScore( q, hrs ) {
  var visitScore = q.views > 0 ? q.views / 2000 : 0;

  var base = visitScore +
    ( ( -4 * q.volatileFlags ) + ( q.edits - q.anonEdits - ( q.reverts / 2 ) - MIN_EDITS ) + ( q.anonEdits * 0.2 ) ) /
    q.getBias() *
    ( q.contributors.length / 2 ) *
    Math.pow( 0.5, q.age() / ( hrs * 60 ) );

  return base * ( q.bytesChanged / 3 );
}

export default calcScore
