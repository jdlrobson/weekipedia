import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import { IntermediateState } from 'wikipedia-react-components'

import Overlay from './../Overlay'

class PagePreviewOverlay extends Overlay {
  componentDidMount() {
    var node = ReactDOM.findDOMNode( this );
    setTimeout( function () {
      node.className += ' visible';
    }, 0 );
  }
  render(){
    var props = this.props;
    var img;
    var item = props.item;
    if ( item.thumbnail ) {
      var thumb = item.thumbnail;
      img = <img src={thumb.source} height={thumb.height} width={thumb.width} alt={item.title}/>;
    }
    var hello = [
      <h2 key="p-p-h">{item.title}</h2>,
      img,
      item.description,
      <a key="p-p-link" onClick={props.onClickInternalLink}
        href={props.getLocalUrl(props.item.title)}>View article</a>
    ];
    return <Overlay children={hello} {...this.props} className="page-preview-overlay" />;
  }
}
PagePreviewOverlay.defaultProps = {
  isLightBox: false,
  isDrawer: true
};

export default PagePreviewOverlay
