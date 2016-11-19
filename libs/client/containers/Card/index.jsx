import React, { Component } from 'react'

import { TruncatedText } from 'wikipedia-react-components'

import './styles.less'

class Card extends Component {
  render(){
    var heading;
    var props = this.props;
    var title = this.props.title;
    var className = this.props.className ? 'card ' + this.props.className : 'card';
    var styles = {
      backgroundImage: this.props.thumbnail ?
        'url(' + this.props.thumbnail.source + ')'
        : 'none'
    };
    var extracts = this.props.extracts.map( function ( item, i ) {
      return (
        <p className="card-extract" key={'card-extract-' + title + '-' + i}
          title={typeof item === 'string' ? item : null}>
          <TruncatedText>{item}</TruncatedText>
        </p>
      );
    });
    var wikiUrlPrefix = props.language_project ? '/' + props.language_project + '/' : '/' + props.lang + '/wiki/';
    var url = props.url !== undefined && props.url !== null ? props.url :
      wikiUrlPrefix + encodeURIComponent( title );
    var illustration;
    if ( this.props.thumbnail || this.props.metaInfo || this.props.showPlaceholderIllustration ) {
      illustration =<div className="card-thumb" style={styles}>{this.props.metaInfo}</div>;
    }

    if ( title ) {
      heading = (
        <h3>
          <a title={title} href={url}>{title}</a>
        </h3>
      );
    } else {
      heading = <a className="card-link" href={url} />
    }

    return (
      <div className={className} onClick={props.onClick}>
        {this.props.indicator}
        {illustration}
        <div className="card-detail">
          {heading}
          {extracts}
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
  showPlaceholderIllustration: true,
  url: null,
  title: null,
  indicator: null,
  thumbnail: null,
  extracts: []
};

export default Card
