import React from 'react'
import createReactClass from 'create-react-class'

import Article from './Article'

// Pages
export default createReactClass({
  render() {
    var props = this.props;
    var title = props.msg( 'action-info-title', props.title );
    var msg = <p>{props.msg( 'action-info-not-available' )}</p>;

    return (
      <Article {...this.props} title={title} body={msg} />
    )
  }
})
