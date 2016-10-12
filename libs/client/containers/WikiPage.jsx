import React, { Component } from 'react'

import Article from './Article'

// Main component
class WikiPage extends Component {
  render(){
    // Note id `#content` is added for consistency with MobileFrontend
    return (
      <Article {...this.props}
        id="content"
        isWikiPage={true} />
    )
  }
}

export default WikiPage