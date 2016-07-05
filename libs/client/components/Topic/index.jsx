import React, { Component } from 'react'
import './styles.css'

class Topic extends Component {
  render(){
    var totalEdits = this.props.edits;
    var totalEditors = this.props.contributors.length + this.props.anons.length;
    var prevIndex = this.props.bestIndex;
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

    return (
      <div className="media">
        <div className="media-left">
          <img className="list-thumbnail"/>
        </div>
        <div className="media-body">
          <p className="list-secondary-text">{speed} edits / minute [debug={this.props.score},{bias.toFixed(2)}]</p>
          <h3 className="media-heading">
            <a href={url}>{this.props.title}</a>
          </h3>
          <p>
          <span className={'indicator ' + className} title={label}>&nbsp;</span> {totalEdits} edits ({this.props.anonEdits} anonymous) by {totalEditors} editors ({this.props.anons.length} anonymous) changing {this.props.bytesChanged} bytes with {this.props.reverts} reverts in {mins} minutes (updated {updated} mins ago).</p>
          <p>{tags.join( ' | ' )}</p>
        </div>
      </div>
    )
  }
}

export default Topic
