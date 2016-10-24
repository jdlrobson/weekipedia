var assert = require( 'assert' );

import { agaricAcid, battleMosul, deaths2016, attaUr, cyberAttacks,
  NintendoSwitch, PeteBurns, Newspaper,
  WideAreaNetwork, AmericanFootball, JoanneAlbum } from './examples'

import TrendEvaluator from './../../../../libs/server/endpoints/trending/evaluator'

var evaluator = new TrendEvaluator( {
  minEdits: 6,
  minContributors: 4,
  minSpeed: 0.1,
  minAnonEdits: 1,
  maxBias: 0.6,
  minAge: 5,
  maxAge: 180
} );

describe('isTrending', function() {
  it('Agaric acid is not trending', function() {
    assert.ok( !evaluator.isTrending( agaricAcid ), 'no anonymous edits whatsoever' );
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

  it( 'October 2016 Dyn cyberattack is trending', function () {
    assert.ok( evaluator.isTrending( cyberAttacks ) );
  } );

  it( 'WideAreaNetwork is not trending', function () {
    assert.ok( !evaluator.isTrending( WideAreaNetwork ) );
  })

  it( 'American Football is not trending', function () {
    assert.ok( !evaluator.isTrending( AmericanFootball ) );
  })

  it( 'JoanneAlbum is not trending', function () {
    assert.ok( !evaluator.isTrending( JoanneAlbum ), 'no anonymous edit interest' );
  })

  it( 'NintendoSwitch is trending', function () {
    assert.ok( evaluator.isTrending( NintendoSwitch ) );
  })

  it( 'PeteBurns is trending', function () {
    assert.ok( evaluator.isTrending( PeteBurns ) );
  })
});
