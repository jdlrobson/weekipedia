import React, { Component } from 'react'

import Card from './../../containers/Card'

import './styles.less'

class PreviewCard extends Component {
  render(){
    var extracts = this.props.description ?
      [ this.props.description ] : [];
    return <Card {...this.props} extracts={extracts} />;
  }
}

PreviewCard.defaultProps = {
  terms: null,
  thumbnail: null
};

export default PreviewCard
