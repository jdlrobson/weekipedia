import React, { Component } from 'react'

import Card from './../../containers/Card'

import './styles.less'

class PreviewCard extends Component {
  render(){
    var extracts = this.props.terms && this.props.terms.description ?
      this.props.terms.description : [];
    return <Card {...this.props} extracts={extracts} />;
  }
}

PreviewCard.defaultProps = {
  terms: null,
  thumbnail: null
};

export default PreviewCard
