import React from 'react'
import timeago from 'timeago'
import './styles.less'

export default ({ editor, lang, title, timestamp }) => {
  const isAnon = editor && editor.name ? false : true;
  const MOBILE_WP = 'https://' + lang + '.m.wikipedia.org/wiki/'
  const historyUrl = MOBILE_WP + 'Special:History/' + title
  const prefix = '/wiki/User:'
  const tsAsDate = new Date( timestamp );
  const historyText = 'Last edited ' + timeago( tsAsDate )
  const now = Math.round( new Date().getTime() / 1000 );
  // calculate delta in seconds
  const timeDelta = now - ( tsAsDate.getTime() / 1000 );

  var editorElement, text = '', editorLabel,
    className = 'last-modified-bar';

  // Cached pages may not have this available.
  if ( editor ) {
    editorLabel = isAnon ? 'an anonymous user' : editor.name
    editorElement = isAnon ? <span>{editorLabel}</span> : <a href={prefix + editor.name}>{editorLabel}</a>
    text = ' by ';
  }
  // check if fresh (< 1hr)
  if ( timeDelta < 60 * 60 ) {
    className += ' active';
  }

  return (
    <div className={className}>
      <div>
        <a href={historyUrl}>{historyText}</a>{text}{editorElement}
      </div>
    </div>
  )
}
