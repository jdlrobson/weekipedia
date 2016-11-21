import React, { Component } from 'react'

import { CardWithLocation } from 'wikipedia-react-components'

class CollectionCard extends Component {
  render(){
    var props = this.props;
    var url = '/' + props.lang + '/wiki/Special:Collections/by/' + props.owner + '/' + props.id;
    return <CardWithLocation {...props} url={url} />;
  }
}

export default CollectionCard
