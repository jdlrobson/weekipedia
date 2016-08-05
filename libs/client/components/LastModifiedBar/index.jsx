import React from 'react'
import timeago from 'timeago'
import './styles.less'
import Content from './../../containers/Content'

export default ({ editor, lang, title, timestamp }) => {
  const isAnon = editor && editor.name ? false : true;
  const MOBILE_WP = 'https://' + lang + '.m.wikipedia.org/wiki/'
  const historyUrl = MOBILE_WP + 'Special:History/' + title
  const prefix = '/wiki/User:'
  const historyText = 'Last edited ' + timeago(new Date(timestamp))

  var editorElement, text = '', editorLabel;
  // Cached pages may not have this available.
  if ( editor ) {
    editorLabel = isAnon ? 'an anonymous user' : editor.name
    editorElement = isAnon ? <span>{editorLabel}</span> : <a href={prefix + editor.name}>{editorLabel}</a>
    text = ' by ';
  }

  return (
    <Content className={'post-content last-modified-bar'}>
      <div>
        <a href={historyUrl}>{historyText}</a>{text}{editorElement}
      </div>
    </Content>
  )
}
