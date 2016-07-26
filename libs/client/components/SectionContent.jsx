import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class SectionContent extends Component {
  hijackLinks(){
    var links = ReactDOM.findDOMNode( this ).querySelectorAll( 'a' );
    var props = this.props;

    function navigateTo( ev ) {
      var link = ev.currentTarget;
      var childNode = link.firstChild;
      if ( childNode && childNode.nodeName === 'IMG' ) {
        var href = link.getAttribute( 'href' ) || '';
        var match = href.match( /\/wiki\/File\:(.*)/ );
        if ( match && match[1] ) {
          ev.preventDefault();
          props.router.navigateTo( '#/media/' + match[1] );
        }
      }
    }

    Array.prototype.forEach.call( links, function ( link ) {
      link.addEventListener( 'click', navigateTo );
    } );
  }
  componentDidMount(){
    this.hijackLinks();
  }
  render(){
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
    )
  }
}

export default SectionContent
