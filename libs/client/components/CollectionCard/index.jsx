import React, { Component } from 'react'

import PreviewCard from './../PreviewCard'


class CollectionCard extends Component {
  render(){
    var props = this.props;
    var url = '/' + props.lang + '/wiki/Special:Collections/by/' + props.owner + '/' + props.id;
    return <PreviewCard {...props} url={url} />;
  }
}

export default CollectionCard
