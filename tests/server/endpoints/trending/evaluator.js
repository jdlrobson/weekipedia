var assert = require( 'assert' );

import { agaricAcid, battleMosul, deaths2016, attaUr, cyberAttacks,
  NintendoSwitch, PeteBurns, Newspaper,
  Keijo, IcelandElection, NotreDame, Rainbow,
  TrumpPresident, Rupee,
  AmistadMemorial, JeffSessions,
  PukhrayanTrain,
  WideAreaNetwork, AmericanFootball, JoanneAlbum } from './examples'

import TrendEvaluator from './../../../../libs/server/endpoints/trending/evaluator'

var evaluator = new TrendEvaluator( {
  minEdits: 6,
  minContributors: 4,
  minSpeed: 0.1,
  minAnonEdits: 1,
  maxAnonEditRatio: 0.51,
  maxBias: 0.55,
  minAge: 5,
  maxAge: 300
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

  it( 'Keijo is not trending', function () {
    assert.ok( !evaluator.isTrending( Keijo ), 'when anonymous edits account for over half edits' );
  })

  it( 'IcelandElection is trending', function () {
    assert.ok( evaluator.isTrending( IcelandElection ) );
  })

  it( 'NotreDame is not trending', function () {
    assert.ok( !evaluator.isTrending( NotreDame ), 'too many anons' );
  })

  it( 'Rainbow is not trending', function () {
    assert.ok( evaluator.isTrending( Rainbow ), 'band disbanded' );
  })

  it( 'Trump is trending', function () {
    assert.ok( evaluator.isTrending( TrumpPresident ) );
  })

  it( 'Rupee is trending', function () {
    assert.ok( evaluator.isTrending( Rupee ), '(Modi\'s ban)' );
  })

  it( 'JeffSessions is trending', function () {
    assert.ok( evaluator.isTrending( JeffSessions ) );
  })

  it( 'PukhrayanTrain is trending', function () {
    assert.ok( evaluator.isTrending( PukhrayanTrain ), 'Some events may need 5 hours to trend as the develop.' );
  })

  it( 'AmistadMemorial is not trending', function () {
    assert.ok( !evaluator.isTrending( AmistadMemorial ) );
  })
});
