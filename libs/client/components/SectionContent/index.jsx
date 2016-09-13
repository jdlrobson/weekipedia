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
    if ( this.props.text && this.state.contentChanged ) {
      this.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  componentWillReceiveProps( nextProps ) {
    this.setState( { contentChanged: nextProps.text !== this.props.text } );
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
    var classSuffix = this.props.className ? ' ' + this.props.className : '';
    if ( this.props.id ) {
      classSuffix += ' section-' + this.props.id;
    }
    return (
      <div data-section={this.props.id}
        className={"component-section-content content" + classSuffix}
        dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
    )
  }
}

export default SectionContent
