import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import TruncatedText from '../../containers/TruncatedText'

import './styles.less'

class Card extends Component {
  navigateTo(ev) {
    var node = ReactDOM.findDOMNode( this );
    var link = node.querySelector( 'a' );
    var href = link.getAttribute( 'href' );
    var title = link.getAttribute( 'title' );
    if ( href ) {
      ev.preventDefault();
      this.props.router.navigateTo( { pathname: href }, title );
    }
  }
  render(){
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

    return (
      <div className={className} onClick={this.navigateTo.bind(this)}>
        {this.props.indicator}
        {illustration}
        <div className="card-detail">
          <h3>
            <a title={title} href={url}>{title}</a>
          </h3>
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
