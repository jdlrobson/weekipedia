var assert = require( 'assert' );
import extractMembers from './../../../../libs/server/endpoints/collection/extract-members'

describe('extractMembers', function() {
  it('extractMembers', function() {
    var members = extractMembers( [
        '* [[Member]]',
        '* [[Category:Foo]]'
      ].join( '\n' ), false );
    assert.ok( members.length === 1, 'Check length - category not included' );
    assert.ok( members[0] === 'Member', 'No expand' );
  });

  it('extractMembers', function() {
    var members = extractMembers( [
      '== Items ==',
      '* [[Koh Rong]]',
      '* [[Kep]]',
      '* [[Kampot]]',
      '* [[Sihanoukville]]',
      '* [[Ho_Chi_Minh_City]]',
      '* [[Cat Tien National Park]]',
      '* [[Can Tho]]',
      '* [[Ha Tien]]',
      '* [[Rach Gia]]',
      '* [[Chau Doc]]',
      '* [[Kuala Lumpur]]',
      '* [[Melaka]]',
      '* [[Kota Tinggi]]',
      '* [[Singapore]]',
      '* [[Ben Tre]]',
      '* [[Can_Tho]][[Category:Community maintained collections]]'
    ].join( '\n' ), true );
    assert.ok( members.length === 15, 'duplicate removed' );
    assert.ok( members[4].title === 'Ho Chi Minh City', 'Underscores removed' );
  });

  it('extractMembers', function() {
    var members = extractMembers( [
        '* [[Member]]',
        '* [[Member 2]] - text',
        '* [[Category:Foo]]'
      ].join( '\n' ), true );
    assert.ok( members.length === 2, 'Check length - category not included' );
    assert.ok( members[0].title === 'Member', 'Expand' );
    assert.ok( members[1].title === 'Member 2', 'Expand' );
    assert.ok( members[1].description === 'text', 'Expand' );
  });
});