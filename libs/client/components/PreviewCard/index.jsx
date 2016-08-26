import React, { Component } from 'react'

import Card from './../../containers/Card'

import './styles.less'

class PreviewCard extends Component {
  render(){
    var props = this.props,
      extracts = props.description ?
        [ props.description ] : [];
    if ( props.coordinates ) {
      extracts.push( parseInt( props.coordinates.dist, 10 ) + 'm' );
    }
    return <Card {...props} extracts={extracts} />;
  }
}

PreviewCard.defaultProps = {
  terms: null,
  thumbnail: null
};

export default PreviewCard
