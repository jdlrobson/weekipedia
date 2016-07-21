import React, { Component } from 'react'
import './styles.css'

class Card extends Component {
  render(){
    var title = this.props.title;
    var url = '/' + this.props.wiki.replace( 'wiki', '' ) + '/wiki/' + encodeURIComponent( title );
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
      <div className="card">
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
