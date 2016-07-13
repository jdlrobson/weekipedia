import React, { Component } from 'react'
import './styles.css'

class TrendingCard extends Component {
  render(){
    var totalEdits = this.props.edits;
    var totalEditors = this.props.contributors.length + this.props.anons.length;
    var prevIndex = this.props.lastIndex;
    var curIndex = this.props.index;
    var label, className;
    var bias = this.props.bias || 1;

    if ( prevIndex ) {
      label = prevIndex - curIndex;
      if ( prevIndex === curIndex ) {
        className = 'trend-icon-nochange';
      } else if ( prevIndex < curIndex ) {
        className = 'trend-icon-down';
      } else {
        className = 'trend-icon-up';
      }
    } else {
      label = 'New';
      className = 'trend-icon-up';
    }
    var tags = [];
    if ( this.props.isNew ) {
       tags.push( 'new' )
    }
    if ( this.props.volatileFlags ) {
      tags.push( 'volatile:' + this.props.volatileFlags );
    }
    if ( this.props.notabilityFlags ) {
      tags.push( 'notable:' + this.props.notabilityFlags )
    }
    if ( this.props.bias < 0.4 ) {
      tags.push( 'neutral' )
    }
    if ( bias > 0.7 ) {
      tags.push( 'bias' )
    }
    var mins = parseInt( ( new Date() - new Date( this.props.start ) ) / 1000 / 60, 10 );
    var updated = parseInt( ( new Date() - new Date( this.props.updated || this.props.start ) ) / 1000 / 60, 10 );
    var speed = mins < 1 ? totalEdits : ( totalEdits / mins ).toFixed( 2 );
    var url = '/' + this.props.wiki.replace( 'wiki', '' ) + '/wiki/' + encodeURIComponent( this.props.title );
    var styles = {
      backgroundImage: this.props.thumbnail ?
        'url(' + this.props.thumbnail.source + ')'
        : 'none'
    };
    var description = this.props.terms && this.props.terms.description ?
      this.props.terms.description[0] : '';

    return (
      <div className="card">
        <span className={'indicator ' + className} title={label}>&nbsp;</span>
        <div className="card-thumb" style={styles}></div>
        <div className="card-detail"
          data-speed={speed} data-score={this.props.score}
          data-tags={tags.join( ' | ' )} data-bias={bias.toFixed(2)}>
          <h3>
            <a href={url}>{this.props.title}</a>
          </h3>
          <p className="card-extract">{description}</p>
          <p className="card-extract">
          {totalEdits} edits ({this.props.anonEdits} anonymous) by {totalEditors} editors ({this.props.anons.length} anonymous) changing {this.props.bytesChanged} bytes with {this.props.reverts} reverts in {mins} minutes (updated {updated} mins ago).</p>
        </div>
      </div>
    )
  }
}

export default TrendingCard
