import React, { Component } from 'react'
import './styles.css'

class Card extends Component {
  render(){
    var url = '/' + this.props.wiki.replace( 'wiki', '' ) + '/wiki/' + encodeURIComponent( this.props.title );
    var styles = {
      backgroundImage: this.props.thumbnail ?
        'url(' + this.props.thumbnail.source + ')'
        : 'none'
    };
    var extracts = this.props.children.map( function ( item ) {
      return (<p className="card-extract">{item}</p>);
    });

    return (
      <div className="card">
        {this.props.indicator}
        <div className="card-thumb" style={styles}></div>
        <div className="card-detail">
          <h3>
            <a href={url}>{this.props.title}</a>
          </h3>
          {extracts}
        </div>
      </div>
    )
  }
}

Card.defaultProps = {
  extracts: [],
  children: []
};

export default Card
