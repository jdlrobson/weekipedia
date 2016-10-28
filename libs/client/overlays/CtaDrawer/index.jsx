import React from 'react'

import Overlay from './../../containers/Overlay'
import { Button } from 'wikipedia-react-components'

export default React.createClass({
  getDefaultProps() {
    return {
      message: 'Keep track of this page and all changes to it.'
    };
  },
  render(){
    var props = this.props;
    var loginUrl = '/' + props.language_project + '/Special:UserLogin?returnto=' + encodeURIComponent( props.title );
    return (
      <Overlay {...props} isDrawer="1">
        <p>{props.message}</p>
        <div>
          <Button label='Log in' href={loginUrl} isPrimary="1" />
        </div>
        <p>
          <a href="https://www.mediawiki.org/wiki/Special:CreateAccount">Sign up at MediaWiki.org</a>
        </p>
      </Overlay>
    )
  }
} )

