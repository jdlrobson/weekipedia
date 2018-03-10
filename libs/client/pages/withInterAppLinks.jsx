import React from 'react'
import ReactDOM from 'react-dom'

import { onClickInternalLink } from './utils.jsx'

const withInterAppLinks = (
  Component, {
    // FIXME: Simplify parameters this needs
    router, supportedProjects, allowForeignProjects, lang, store, api, language_project
  }
) => {

  const clickInternalLink = onClickInternalLink(
    {
       router, supportedProjects, allowForeignProjects, lang, store, api, language_project
    }
  );

  class WithInterAppLinks extends React.Component {
    componentDidMount(){
      this.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
    componentDidUpdate(){
      this.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
    hijackLinks( container ){
      container = container || ReactDOM.findDOMNode( this );

      var links = container.querySelectorAll( 'a' );
      var self = this;

      container.setAttribute( 'data-hijacked-prev', 1 );
      Array.prototype.forEach.call( links, function ( link ) {
        link.addEventListener( 'click', clickInternalLink );
      } );
    }
    render() {
      return <Component {...this.props} />;
    }
  }
  return WithInterAppLinks;
};

export default withInterAppLinks;
