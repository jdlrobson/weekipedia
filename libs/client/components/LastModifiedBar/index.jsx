import React from 'react'
import timeago from 'timeago'

import './styles.less'
import './icons.less'

import Icon from './../Icon'

import Content from './../../containers/Content'

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
    iconVariant = '-gray',
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
    iconVariant = '-invert';
  }

  var modifierTagline = [<a href={historyUrl}>{historyText}</a>, text, editorElement,
    <Icon small={true} glyph={'arrow' + iconVariant} className='indicator' />];
  return (
    <div className={className}>
      <Content>
      <Icon glyph={'clock' + iconVariant} type="before" small={true}
          label={modifierTagline} className="last-modifier-tagline" />
      </Content>
    </div>
  )
}
