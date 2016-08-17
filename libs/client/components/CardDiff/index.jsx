import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

import Card from './../../containers/Card'

class CardDiff extends Component {
  render(){
    var extracts = [ this.props.comment ];
    var date = new Date( this.props.timestamp );
    var bytes = this.props.newlen ? this.props.newlen - this.props.oldlen : this.props.sizediff;
    var bytesDeltaClass = bytes < 0 ? 'bytes-removed' : 'bytes-added';
    var metaInfo = <div className="meta">
      <p className="timestamp">{date.getUTCHours()}:{date.getUTCMinutes()}</p>
      <p className={bytesDeltaClass}>{bytes}</p>
    </div>;

    var url = '/wiki/Special:MobileDiff/' + this.props.revid;
    return (
      <Card {...this.props} extracts={extracts} metaInfo={metaInfo} url={url} />
    )
  }
}

export default CardDiff
