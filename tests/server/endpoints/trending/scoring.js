var assert = require( 'assert' );

import calcScore from './../../../../libs/server/endpoints/trending/scoring.js'

var MockPage = function ( data ) {
  var key;
  for ( key in data ) {
    if ( data.hasOwnProperty( key ) ) {
      this[key] = data[key];
    }
  }
};
MockPage.prototype.getBias = function() {
  return this.bias;
}
MockPage.prototype.age = function() {
  return this._age;
}

const page = new MockPage( {
  _age: 3086,
  anonEdits: 0,
  bias: 0.5,
  bytesChanged: 2825,
  contributors: [ 'a', 'b', 'c', 'd', 'e' ],
  edits: 12,
  notabilityFlags: 0,
  volatileFlags: 1,
  reverts: 1,
  visits: 0
} );

const page2 = new MockPage( {
  _age: 4096,
  anonEdits: 13,
  bias: 0.1,
  bytesChanged: 606,
  contributors: [ 'a', 'b', 'c', 'd', 'e', 'f', 'g' ],
  edits: 20,
  notabilityFlags: 0,
  volatileFlags: 0,
  reverts: 3,
  visits: 0
} );

const page3 = new MockPage( {
  _age: 10235,
  anonEdits: 14,
  edits: 65,
  contributors: new Array( 25 ),
  bias: 0.26153846153846155,
  bytesChanged: 4830,
  reverts: 1,
  visits: 0,
  notabilityFlags: 0,
  volatileFlags: 0
} );

const page4 = new MockPage( {
  _age: 10114,
  anonEdits: 3,
  edits: 65,
  contributors: new Array( 16 ),
  bias: 0.265625,
  bytesChanged: 2382,
  reverts: 2,
  visits: 0,
  notabilityFlags: 0,
  volatileFlags: 0
} );

describe('calcScore', function() {
  it('page 1 is hotter than page 2 with half life 2', function() {
    assert.ok( calcScore( page2, 2 ) > calcScore( page, 2 ) );
  });

  it('page 1 is hotter than page 2 with half life 10', function() {
    assert.ok( calcScore( page2, 10 ) > calcScore( page, 10 ) );
  });

  it('page 3 is hotter than page 4', function() {
    assert.ok( calcScore( page3, 10 ) > calcScore( page4, 10 ) );
  });
});
