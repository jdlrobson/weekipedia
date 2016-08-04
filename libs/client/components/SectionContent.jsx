import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class SectionContent extends Component {
  hijackLinks(){
    var links = ReactDOM.findDOMNode( this ).querySelectorAll( 'a' );
    var props = this.props;

    function navigateTo( ev ) {
      var link = ev.currentTarget;
      var childNode = link.firstChild;
      var parentNode = link.parentNode;
      if ( parentNode.className === 'mw-ref' ) {
        ev.preventDefault();
        ev.stopPropagation();
        props.router.navigateTo( null,
          '#/ref/' + link.getAttribute( 'href' ).substr( 1 ), true );
      } else if ( childNode && childNode.nodeName === 'IMG' ) {
        var href = link.getAttribute( 'href' ) || '';
        var match = href.match( /\/wiki\/File\:(.*)/ );
        if ( match && match[1] ) {
          ev.preventDefault();
          props.router.navigateTo( '#/media/' + match[1] );
        }
      } else {
        var href = link.getAttribute( 'href' ) || '';
        // FIXME: Workaround for #5
        if ( href.substr( 0, 5 ) === '/wiki' ) {
          href = '/' + props.lang + href;
        }
        props.router.navigateTo( href );
        ev.preventDefault();
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
