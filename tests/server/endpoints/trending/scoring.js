var assert = require( 'assert' );

import { page, page2, page3, page4,
   CascadeMall,PacificTyphoon, Liliuokalani, ShimonPeres, Hoboken } from './examples'

import calcScore from './../../../../libs/server/endpoints/trending/scoring.js'

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

  it('things that have visits get weighed down heavily with small half lifes', function() {
    assert.ok( calcScore( Hoboken, 24 ) > calcScore( ShimonPeres, 24 ) );
  });

  it('if things have been viewed they show up in the `by week` section', function() {
    assert.ok( calcScore( ShimonPeres, 84 ) > calcScore( Hoboken, 84 ) );
  });

  it('number of contributors weighs more heavily than number of edits', function() {
    assert.ok( calcScore( PacificTyphoon, 84 ) > calcScore( Liliuokalani, 84 ) );
  });

  it('number of contributors weighs more heavily than number of edits - even if only half the number of edits', function() {
    assert.ok( calcScore( CascadeMall, 84 ) > calcScore( PacificTyphoon, 84 ) );
  });
});
