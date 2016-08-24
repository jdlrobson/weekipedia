var assert = require( 'assert' );

import extract from './../../../../libs/server/endpoints/voyager/extract-description-from-text'

describe('extract-description-from-text', function() {
  it('recognises `-`', function() {
    var input = [ 'Teotihuacan - ', 'In the state of Mexico, near Mexico City. Enormous site with several large pyramids.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  });

  it( 'recognises `—`', function () {
    var input = [ 'Wieliczka Salt Mine — ',
      'the oldest still existing enterprise worldwide, this salt mine was exploited continuously since the 13th century. UNESCO World Heritage Site.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  });

  it( 'recognises `.`', function () {
    var input = [ 'Great Dunmow. ',
      'Ancient flitch town. Worth a walk up and down the high street' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  });

  it( 'recognises commas', function () {
    var input = [ 'Maidstone, ',
      'county town of Kent, known as the Garden of England.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  })

  it( 'recognises colons', function () {
    var input = [ 'Back to My Roots:  ',
      'Located on Burns Avenue across from the JNC mall.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  })

  it( 'recognises double dashes', function () {
    var input = [ 'Kolmanskop -- ',
      'A ghost town just outside Lüderitz.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  })

  it( 'can handle no spaces', function () {
    var input = [ 'Petra—',
      'ancient city carved out of sandstone and one of the new 7 Wonders' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  })

  it( 'can handle no spaces and names with more than one word', function () {
    var input = [ 'Fish River Canyon Park—',
      'The second largest canyon in the world.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[1] );
  })

  it( 'leading full stop', function () {
    var input = [ 'Southend-on-Sea',
      '. ', 'An Essex seaside town with pebble and sand beaches, fairground rides, arcades, and the longest pier in the world. Make sure to grab yourself a delicious Rossi ice cream - a local delicacy since 1932 - while you\'re there! Only 40 minutes by train from Fenchurch Street station.' ];
    assert.strictEqual( extract( input.join( '' ) ), input[2] );
  })
});
