import React from 'react'

import Overlay from './../../containers/Overlay'
import Button from './../../components/Button'

export default React.createClass({
  getDefaultProps() {
    return {
      message: 'Keep track of this page and all changes to it.'
    };
  },
  render(){

    return (
      <Overlay {...this.props} isDrawer="1">
        <p>{this.props.message}</p>
        <div>
          <Button label='Log in' href='/auth/mediawiki' isPrimary="1" />
        </div>
        <p>
          <a href="https://www.mediawiki.org/wiki/Special:CreateAccount">Sign up at MediaWiki.org</a>
        </p>
      </Overlay>
    )
  }
} )

