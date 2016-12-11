var assert = require( 'assert' );
import { isNodeEmpty } from './../../../../libs/server/endpoints/voyager/domino-utils'

describe('isNodeEmpty', function() {
  it('isNodeEmpty', function() {
    var text = `\n\n\n\n\n\n\n\n\t \n\n\n\n\n`;
    var empty = isNodeEmpty( { textContent: text } );
    assert.ok( empty, 'Yup' );
  });
});