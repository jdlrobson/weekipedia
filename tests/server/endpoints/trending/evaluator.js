var assert = require( 'assert' );

import TrendEvaluator from './../../../../libs/server/endpoints/trending/evaluator'

function Page( opts ) {
  Object.assign( this, opts );
}

Page.prototype = {
  getBias: function () {
    return this.bias;
  },
  age: function () {
    return ( new Date( this.trendedAt ) - new Date( this.start ) ) /
      1000 / 60;
  },
  editsPerMinute: function () {
    var age = this.age(),
      editCount = this.edits;

    return age < 1 || editCount === 0 ? editCount : editCount / age;
  }
};

var evaluator = new TrendEvaluator( {
  minEdits: 6,
  minContributors: 4,
  minSpeed: 0.1,
  maxBias: 0.5,
  minAge: 5,
  maxAge: 180
} );

var agaricAcid = new Page( {
  anonEdits: 0,
  edits: 60,
  reverts: 13,
  anons: [],
  notabilityFlags: 0,
  volatileFlags: 0,
  views: 0,
  start: '2016-10-13T15:04:47.853Z',
  trendedAt: '2016-10-13T15:22:37.952Z',
  bias: 0.5423728813559322,
  contributors: Array( 9 )
} );

var battleMosul = new Page( {
  anonEdits: 6,
  edits: 34,
  reverts: 2,
  anons: Array( 3 ),
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 0,
  start: "2016-10-18T16:39:59.389Z",
  trendedAt: "2016-10-18T18:03:06.731Z",
  bias: 0.3333333333333333,
  contributors: Array( 11 )
} );

describe('isTrending', function() {
  it('Agaric acid is not trending', function() {
    assert.ok( !evaluator.isTrending( agaricAcid ) );
  });

  it('Battle of Mosul is trending', function() {
    assert.ok( evaluator.isTrending( battleMosul ) );
  });
});
