import React from 'react'
import createReactClass from 'create-react-class'

import Overlay from './../Overlay'
import { Button } from 'wikipedia-react-components'

export default createReactClass({
  getDefaultProps() {
    return {
      message: 'You need to sign in to use this feature'
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

