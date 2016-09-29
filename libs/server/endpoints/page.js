import fetch from 'isomorphic-fetch'
import domino from 'domino'

import { SPECIAL_PROJECTS } from './../config'
import mwApi from './mwApi';

function extractLeadParagraph( doc ) {
  var p = '';
  var node = doc.querySelector( 'p' );
  if ( node ) {
    p = node.innerHTML;
    // delete it
    node.parentNode.removeChild( node );
  }
  return p;
}
function extractHatnote( doc ) {
  // Workaround for https://phabricator.wikimedia.org/T143739
  // Do not remove it from the DOM has a reminder this is not fixed.
  var hatnoteNodes = doc.querySelectorAll( '.hatnote' );
  var hatnote;
  if ( hatnoteNodes.length ) {
    hatnote = '';
    Array.prototype.forEach.call( hatnoteNodes, function ( hatnoteNode ) {
      hatnote += hatnoteNode.innerHTML + '<br/>';
      hatnoteNode.parentNode.removeChild( hatnoteNode );
    } );
  }
  return hatnote;
}
function extractInfobox( doc ) {
  var infobox;
  var node = doc.querySelector( '.infobox' );
  if ( node ) {
    infobox = '<table class="' + node.getAttribute( 'class' ) + '">' + node.innerHTML + '</table>';
    // delete it
    node.parentNode.removeChild( node );
  }
  return infobox;
}

function markReferenceSections( sections, removeText ) {
  var topHeadingLevel = sections[0] ? sections[0].toclevel : 2;
  var lastTopLevelSection,
    isReferenceSection = false;

  function mark( from, to ) {
    if ( isReferenceSection && from !== undefined ) {
      // Mark all the sections between the last heading and this one as reference sections
      sections.slice( from, to ).forEach( function ( section ) {
        section.isReferenceSection = true;
        if ( removeText ) {
          delete section.text;
        }
      } );
    }
  }

  sections.forEach( function ( section, i ) {
    var text = section.text;
    if ( section.toclevel === topHeadingLevel ) {
      mark( lastTopLevelSection, i );
      // reset the top level section and begin the hunt for references again.
      lastTopLevelSection = i;
      isReferenceSection = false;
    }
    if ( text.indexOf( 'class="mw-references' ) > -1 || text.indexOf( 'class="refbegin' ) > -1 ) {
      isReferenceSection = true;
    }
  } );
  // the last section may have been a reference section
  mark( lastTopLevelSection, sections.length - 1 );
}

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function getBaseHost( lang, project ) {
  if ( SPECIAL_PROJECTS.indexOf( project ) > -1 ) {
    return project + '.wikimedia';
  } else {
    return lang + '.' + project;
  }
}

export default function ( title, lang, project, includeReferences ) {
  // FIXME: Handle this better please. Use better API.
  var url = 'https://' + getBaseHost( lang, project ) + '.org/api/rest_v1/page/mobile-sections/' +
    encodeURIComponent( title );

  return fetch( url )
    .then( function ( resp ) {
      if ( resp.status === 200 ) {
        return resp.json();
      } else {
        if ( title.indexOf( 'User:' ) > -1 ) {
          return {
            lead: {
              ns: 2,
              sections: [ { text: '' } ]
            },
            remaining: {
              sections: []
            }
          }
        } else {
          throw Error( resp.status );
        }
      }
    } ).then( function ( json ) {
      var username = title.indexOf( ':' ) > -1 ? title.split( ':' )[1] : title;
      // mark references sections with a flag
      if ( json.remaining.sections ) {
        markReferenceSections( json.remaining.sections, !includeReferences );
      }

      if ( json.lead && json.lead.ns === 2 ) {
        // it's a user page so get more info
        return mwApi( lang, { meta: 'globaluserinfo',
          guiuser: username }, project ).then( function ( userInfo ) {
          var registered;
          json.user =  userInfo;
          if ( userInfo.registration ) {
            registered = new Date( userInfo.registration );
            // FIXME: Translate
            json.lead.description = 'Member since ' + MONTHS[ registered.getMonth() ] + ', ' + registered.getFullYear();
          }
          return json;
        } ).catch( function () {
          return json;
        } )
      } else {
        // Workaround for https://phabricator.wikimedia.org/T145034
        var doc = domino.createDocument( json.lead.sections.length && json.lead.sections[0] && json.lead.sections[0].text );
        if ( doc ) {
          var infobox = extractInfobox( doc );
          var leadParagraph = extractLeadParagraph( doc );
          json.lead.infobox = infobox;
          json.lead.paragraph = leadParagraph;
          json.lead.hatnote = extractHatnote( doc );
          json.lead.sections[0].text = doc.body.innerHTML;
        }
        return json;
      }
    } );
}
