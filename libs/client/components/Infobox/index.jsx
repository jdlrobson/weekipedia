import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

class SectionContent extends Component {
  componentDidMount(){
    if ( this.props.text ) {
      this.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  componentDidUpdate(){
    if ( this.props.text ) {
      this.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  hijackLinks( container ){
    container = container || ReactDOM.findDOMNode( this );

    var links = ReactDOM.findDOMNode( this ).querySelectorAll( 'a' );
    var props = this.props;

    function navigateTo( ev ) {
      props.onClickInternalLink( ev );
    }

    container.setAttribute( 'data-hijacked-prev', 1 );
    Array.prototype.forEach.call( links, function ( link ) {
      link.addEventListener( 'click', navigateTo );
    } );
  }
  render(){
    return (
      <div className="infobox-container" dangerouslySetInnerHTML={{ __html: this.props.text}} />
    )
  }
}

export default SectionContent
