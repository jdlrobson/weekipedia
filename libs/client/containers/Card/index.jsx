import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

class Card extends Component {
  navigateTo(ev) {
    var href = ReactDOM.findDOMNode( this ).querySelector( 'a' ).getAttribute( 'href' );
    if ( href ) {
      ev.preventDefault();
      this.props.router.navigateTo( href );
    }
  }
  render(){
    var title = this.props.title;
    var styles = {
      backgroundImage: this.props.thumbnail ?
        'url(' + this.props.thumbnail.source + ')'
        : 'none'
    };
    var extracts = this.props.extracts.map( function ( item, i ) {
      return (<p className="card-extract" key={'card-extract-' + title + '-' + i}>{item}</p>);
    });
    var url = this.props.url || '/' + this.props.lang + '/wiki/' + encodeURIComponent( title );

    return (
      <div className="card" onClick={this.navigateTo.bind(this)}>
        {this.props.indicator}
        <div className="card-thumb" style={styles}>{this.props.metaInfo}</div>
        <div className="card-detail">
          <h3>
            <a href={url}>{title}</a>
          </h3>
          {extracts}
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
  url: null,
  title: null,
  indicator: null,
  thumbnail: null,
  extracts: []
};

export default Card
