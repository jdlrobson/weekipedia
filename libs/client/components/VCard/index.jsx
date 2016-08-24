import React, { Component } from 'react'
import { Icon, Card } from 'wikipedia-react-components'

import './styles.less'
import './icons.less'

class VCard extends Component {
  onClick( ev ) {
    ev.preventDefault();
  }
  render(){
    var extracts = [ this.props.address, this.props.telephone, this.props.email,
      this.props.cost, this.props.description ];
    var glyph = this.props.category ? this.props.category : '';
    return (
      <Card className="vcard" {...this.props}
        showPlaceholderIllustration={false}
        metaInfo={<Icon glyph={glyph} small={true} className="indicator"/>}
        url={this.props.link || '#'} onClick={this.onClick.bind( this )}
        extracts={extracts} title={this.props.title} />
    )
  }
}

export default VCard
