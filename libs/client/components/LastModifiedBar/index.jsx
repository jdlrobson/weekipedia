import React from 'react'
import timeago from 'timeago'
import './styles.css'
import Content from './../../containers/Content'

export default ({ editor, lang, title, timestamp }) => {
  const MOBILE_WP = 'https://' + lang + '.m.wikipedia.org/wiki/'
  const historyUrl = MOBILE_WP + 'Special:History/' + title
  const historyText = 'Last edited ' + timeago(new Date(timestamp))

  return (
    <Content className={'post-content last-modified-bar'}>
      <div>
        <a href={historyUrl}>{historyText}</a>
      </div>
    </Content>
  )
}
