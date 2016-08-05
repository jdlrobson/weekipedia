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
    var url = '/' + this.props.lang + '/wiki/' + encodeURIComponent( title );
    var styles = {
      backgroundImage: this.props.thumbnail ?
        'url(' + this.props.thumbnail.source + ')'
        : 'none'
    };
    var description = this.props.terms && this.props.terms.description ?
      this.props.terms.description[0] : '';
    var extracts = this.props.children.map( function ( item, i ) {
      return (<p className="card-extract" key={'card-extract-' + title + '-' + i}>{item}</p>);
    });

    return (
      <div className="card" onClick={this.navigateTo.bind(this)}>
        {this.props.indicator}
        <div className="card-thumb" style={styles}></div>
        <div className="card-detail">
          <h3>
            <a href={url}>{this.props.title}</a>
          </h3>
          <p className="card-extract"><span>{description}</span></p>
          {extracts}
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
  children: [],
  terms: null,
  thumbnail: null
};

export default Card
