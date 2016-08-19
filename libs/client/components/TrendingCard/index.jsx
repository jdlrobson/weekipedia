import React, { Component } from 'react'

import Icon from './../Icon'

import Card from './../../containers/Card'

import './styles.less'

class TrendingCard extends Component {
  render(){
    var props = this.props;
    var totalEdits = this.props.edits;
    var totalEditors = this.props.contributors.length + this.props.anons.length;
    var prevIndex = this.props.lastIndex;
    var curIndex = this.props.index;
    var label, glyph;
    var bias = this.props.bias || 1;

    if ( prevIndex ) {
      label = prevIndex - curIndex;
      if ( prevIndex === curIndex ) {
        glyph = 'nochange';
      } else if ( prevIndex < curIndex ) {
        glyph = 'decrease';
      } else {
        glyph = 'increase';
      }
    } else {
      label = 'New';
      glyph = 'increase';
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

    var indicator = (<Icon glyph={glyph} className='indicator' small={true}
      label={this.props.bytesChanged} type='before' />);

    var description = this.props.terms && this.props.terms.description ?
      this.props.terms.description[0] + '; ' : '';

    var extracts = [
      <span>{description}{totalEdits} edits ({this.props.anonEdits} anon) (updated {updated} mins ago).
        by {totalEditors} editors ({this.props.anons.length} anon) with {this.props.reverts} reverts (created {mins} mins ago)
      </span>,
      <span
        data-speed={speed} data-score={this.props.score}
        data-tags={tags.join( ' | ' )} data-bias={bias.toFixed(2)}></span>
    ];

    return <Card {...props} indicator={indicator} extracts={extracts} />;
  }
}

export default TrendingCard
