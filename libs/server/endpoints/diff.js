import mwApi from './mwApi'
import domino from 'domino'
import htmlHelper from 'mediawiki-html-construction-helper'

let jsdiff = require( 'diff' );

function getText( html ) {
  var window = domino.createWindow( '<div>' + html + '</div>' ),
    document = window.document;
  return htmlHelper.escape( document.documentElement.textContent );
}

function transform( body ) {
  var newDiff = '',
    window = domino.createWindow( '<table>' + body + '</table>' ),
    document = window.document,
    trs = document.querySelectorAll( 'tr' );

  Array.prototype.forEach.call( trs, function ( row ) {
    var added, removed, context, charDiff,
      children = row.querySelectorAll( 'td' ),
      charDiffVal = '';

    Array.prototype.forEach.call( children, function ( col ) {
      var html = col.innerHTML || '&nbsp;';
      if ( col.className === 'diff-lineno' && newDiff ) {
        newDiff += '<br />';
      } else if ( col.className === 'diff-context' ) {
        context = html;
      } else if ( col.className === 'diff-addedline' ) {
        added = html;
      } else if ( col.className ===  'diff-deletedline' ) {
        removed = html;
      }
    } );
    if ( context ) {
      newDiff += '<div>' + context + '</div>';
    }
    if ( removed && !added ) {
      newDiff += '<div class="diff-deletedline">' + removed + '</div>';
    } else if ( added && !removed ) {
      newDiff += '<div class="diff-addedline">' + added + '</div>';
    } else if ( added && removed ) {
      // must diffChars to avoid wrapping html codes e.g. &lt; with a ins or del tag
      charDiff = jsdiff.diffChars( getText( removed ), getText( added ) );
      charDiff.forEach( function ( change ) {
        if ( change.added ) {
          charDiffVal += '<ins>'
        }
        if ( change.removed ) {
          charDiffVal += '<del>'
        }
        charDiffVal += change.value;
        if ( change.added ) {
          charDiffVal += '</ins>'
        }
        if ( change.removed ) {
          charDiffVal += '</del>'
        }
      } )
      newDiff += '<div>' + charDiffVal + '</div>';
    }
  } );
  return '<div>' + newDiff + '</div>';
}

function revUserInfo( lang, username, project, revData ) {
  var params = {
    list: 'users',
    ususers: username,
    usprop: 'groups|editcount'
  };

  return mwApi( lang, params, project ).then( function ( data ) {
    return Object.assign( revData, {
      user: data.query.users[0]
    } );
  } );
}

export default function ( lang, revId, project ) {
  var params = {
    prop: 'revisions',
    revids: revId,
    rvprop: 'ids|timestamp|comment|size|flags|sizediff|user',
    rvdiffto: 'prev'
  };

  return mwApi( lang, params, project ).then( function ( data ) {
    var page, rev, body, revData,
      pages = data.pages;

    if ( pages[0] && pages[0].revisions ) {
      page = pages[0];
      rev = page.revisions[0];
      body = transform( rev.diff.body );
      delete rev.diff;

      revData = Object.assign( rev, {
        title: page.title,
        comment: rev.comment,
        parent: rev.parentid,
        body: body,
        timestamp: rev.timestamp
      } );
      return revUserInfo( lang, rev.user, project, revData );
    }
    throw new Error( 'Unable to load diff.' );
  } );
}

