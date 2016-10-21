import React from 'react'

import { Icon } from 'wikipedia-react-components'
import { Button } from 'wikipedia-react-components'

import './styles.less'
import './icons.less'

const UserPageCta = (props) => {
  var user = props.user;
  var editUrl = "#/editor/0";
  var isReaderOwner = props.isReaderOwner;
  var msg = isReaderOwner ? 'You don\'t have a user page yet' : 'No user page for ' + props.user;
  var pText = isReaderOwner ? 'You can describe yourself to fellow editors on your user page' :
    'This page should be created and edited by ' + user;
  var btn = isReaderOwner ? <Button label="Create your own" href={editUrl} isPrimary="1" /> :
    <a href={editUrl} className="mw-ui-progressive ">Create a page called User:{user}</a>

  return (
    <div className="component-user-page-cta">
      <Icon glyph="user-page" large={true} />
      <h3>{msg}</h3>
      <p>{pText}</p>
      {btn}
    </div>
  );
}

export default UserPageCta
