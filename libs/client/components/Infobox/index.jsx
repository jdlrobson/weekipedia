import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

class SectionContent extends Component {
  componentDidMount(){
    if ( this.props.text ) {
      this.props.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  componentDidUpdate(){
    if ( this.props.text ) {
      this.props.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  render(){
    return (
      <div className="infobox-container" dangerouslySetInnerHTML={{ __html: this.props.text}} />
    )
  }
}

export default SectionContent
