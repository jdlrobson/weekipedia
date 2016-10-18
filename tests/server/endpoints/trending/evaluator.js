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

var deaths2016 = new Page( {
  anonEdits: 0,
  edits: 130,
  reverts: 2,
  anons: [],
  views: 9807,
  notabilityFlags: 0,
  volatileFlags: 0,
  start: "2016-10-14T23:35:44.813Z",
  trendedAt: "2016-10-15T00:25:54.960Z",
  bias: 0.15384615384615385,
  contributors: Array( 46 )
} );

var attaUr = new Page( {
  anonEdits: 5,
  anons: Array(2),
  bias: 0.3076923076923077,
  edits: 13,
  reverts: 1,
  start: "2016-10-18T18:13:17.987Z",
  trendedAt: "2016-10-18T20:12:34.933Z",
  contributors: new Array( 4 ),
  views: 0,
  notabilityFlags: 0,
  volatileFlags: 1
} );

describe('isTrending', function() {
  it('Agaric acid is not trending', function() {
    assert.ok( !evaluator.isTrending( agaricAcid ) );
  });

  it('Battle of Mosul is trending', function() {
    assert.ok( evaluator.isTrending( battleMosul ) );
  });

  it('Deaths in 2016 is not trending', function() {
    assert.ok( !evaluator.isTrending( deaths2016 ), 'has lived long enough to capture views' );
  });

  it('Atta ur Rehman Khan is not trending', function() {
    assert.ok( !evaluator.isTrending( attaUr ), 'has a vandalism flag' );
  });
});
