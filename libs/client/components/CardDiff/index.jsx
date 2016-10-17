import React, { Component } from 'react'

import './styles.less'

import Icon from './../Icon'

import Card from './../../containers/Card'

class CardDiff extends Component {
  render(){
    var username = this.props.user;
    var extracts = [
      <span className="edit-summary">{this.props.comment || 'No edit summary'}</span>
    ];
    if ( !this.props.title && username ) {
      extracts.unshift( <Icon glyph="user" type="before" label={username} className="mw-mf-user"
        href={'/' + this.props.language_project + '/User:' + encodeURIComponent( username )} /> );
    }
    var date = new Date( this.props.timestamp );
    var bytes = this.props.newlen ? this.props.newlen - this.props.oldlen : this.props.sizediff;
    var bytesDeltaClass = bytes < 0 ? 'bytes-removed' : 'bytes-added';
    var metaInfo = <div className="meta">
      <p className="timestamp">{date.getUTCHours()}:{date.getUTCMinutes()}</p>
      <p className={bytesDeltaClass}>{bytes}</p>
    </div>;
    if ( this.props.minor ) {
      extracts.push( <abbr className="minor-edit" title="This is a minor edit">m</abbr>);
    }

    var source = this.props.language_project || this.props.lang + '/wiki';
    var url = '/' + source + '/Special:MobileDiff/' + this.props.revid;

    return (
      <Card className="card-diff" {...this.props} extracts={extracts} metaInfo={metaInfo} url={url} />
    )
  }
}

export default CardDiff
