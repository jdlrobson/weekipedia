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