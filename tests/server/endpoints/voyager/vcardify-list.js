import assert from 'assert'
import { vcardifyLists } from './../../../../libs/server/endpoints/voyager/vcardify-list'

describe('vcardifyLists', function() {
  
  it('Lobito, Angola', function() {
    var section = {
      text: '<div><div><div> \n<p>In Lobito, like the rest of Angola prices of pretty much everything, <b>except alcohol</b>, are high. Here are some places on the Restinga, the city\'s famous natural harbour:</p>\n\n<ul><li id="mwGw">Alfa Bar - Decent pizzas. Street tables that seem to be almost always full. Some more chairs closer to the beach.</li>\n<li id="mwHA">Zulu - At the very end of the Restinga. </li>\n<li id="mwHQ">Luna - The newest bar\\lounge opened in the summer of 2014. Very high standards for a bar in the province, nice atmosphere and good food but limited menu.</li>\n<li id="mwHg">Jango Hotel Restinga - Recently renovated with very nice outside wooden deck and beach chairs.</li></ul>\n\n</div></div></div>'
    };
    var section = vcardifyLists( section, 'cat' );
    assert.strictEqual( section.vcards.length, 4 );
    assert.strictEqual( section.vcards[0].title, 'Alfa Bar' );
    assert.strictEqual( section.vcards[0].description,
      'Decent pizzas. Street tables that seem to be almost always full. Some more chairs closer to the beach.' );
    assert.strictEqual( section.vcards[3].title, 'Jango Hotel Restinga' );
  });

});
