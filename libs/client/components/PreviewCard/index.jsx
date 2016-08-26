import React, { Component } from 'react'

import Card from './../../containers/Card'

import './styles.less'

class PreviewCard extends Component {
  render(){
    var dist,
      units = 'm',
      props = this.props,
      extracts = props.description ?
        [ props.description ] : [];
    if ( props.coordinates ) {
      dist = parseInt( props.coordinates.dist, 10 );
      if ( dist > 1000 ) {
        dist = parseInt( dist / 1000, 10 );
        units = 'km';
      }
      extracts.push( dist + units );
    }
    return <Card {...props} extracts={extracts} />;
  }
}

PreviewCard.defaultProps = {
  terms: null,
  thumbnail: null
};

export default PreviewCard
