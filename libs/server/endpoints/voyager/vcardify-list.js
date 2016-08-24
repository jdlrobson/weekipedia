import { extractElements, cleanupScrubbedLists } from './domino-utils'
import extractDescFromText from './extract-description-from-text'

function vcard( title, desc, category, additionalData ) {
  return Object.assign( {
    category: category.toLowerCase().replace( ' ', '-' ),
    title: title ? title.trim() : null,
    description: desc,
    url: false
  }, additionalData || {} );
}

function vcardifyLists( section, category ) {
  var ext = extractElements( section.text, 'li[id]', true );
  var vcards = [];
  Array.prototype.forEach.call( ext.extracted, function ( node ) {
    var titleNode = node.querySelector( 'b:first-child' );
    var title, desc;
    if ( titleNode ) {
      title = titleNode.textContent;
      desc = extractDescFromText( node.textContent );
      if ( !desc ) {
        desc = node.textContent.replace( title, '' ).trim();
      }
      vcards.push( {
        category: category || section.line,
        title: title,
        description: desc
      } );
      node.parentNode.removeChild( node );
    } else {
      desc = extractDescFromText( node.textContent );
      if ( desc ) {
        title = node.textContent.replace( desc, '' );
        title = title.replace( /(.*) *-(.*)/g, '$1' );
        vcards.push( vcard( title, desc, category || section.line ) );
        node.parentNode.removeChild( node );
      }
    }
  } );
  section.text = cleanupScrubbedLists( ext.document.body.innerHTML );
  section.vcards = vcards;
  return section;
}

function getTextContent( node, selector ) {
  var n = node.querySelector( selector );
  return n ? n.textContent : null;
}

function vcardify( section, category ) {
  var listNode;
  var ext = extractElements( section.text, 'li .vcard', true );
  section.vcards = Array.prototype.map.call( ext.extracted, function ( node ) {
    var link = node.querySelector( '[href]' );
    var img = node.parentNode.querySelector( '[src]' );
    var lat = getTextContent( node, '.geo .latitude' );
    var lng = getTextContent( node, '.geo .longitude' );
    var thumbnail;
    var parentNode = node.parentNode;
    listNode = parentNode.parentNode;

    if ( img ) {
      thumbnail = {
        width: img.getAttribute( 'width' ),
        height: img.getAttribute( 'height' ),
        source: img.getAttribute( 'src' )
      };
    }
    var url = link ? link.getAttribute( 'href' ) : null;
    if ( url && url.indexOf( '/wiki/Special:Map/' ) > -1 ) {
      url = null;
    }

    parentNode.removeChild( node );

    return vcard( getTextContent( node, '.fn.org' ),
      getTextContent( node, '.listing-content' ),
      category || section.line, {
        coordinates: lat && lng ? { lat: lat,
          lon: lng } : null,
        thumbnail: thumbnail,
        telephone: getTextContent( node, '.tel' ),
        link: url,
        address: getTextContent( node, '.street-address' ),
        cost: getTextContent( node, '.listing-price' ),
        email: getTextContent( node, '.email' )
      } );
  } );
  section.text = cleanupScrubbedLists( ext.document.body.innerHTML );
  return section;
}

export { vcardifyLists, vcardify };
