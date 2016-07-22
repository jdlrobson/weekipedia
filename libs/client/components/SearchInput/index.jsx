import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.css'

export default React.createClass({
  onDoSearch( ev ){
    this.props.onSearch( ev.currentTarget.value );
  },
  componentDidMount: function(){
    if ( this.props.focusOnRender ) {
      ReactDOM.findDOMNode( this ).focus();
    }
  },
  render() {
    return (
      <input className="search" ref="input" onClick={this.props.onClick}
        onKeyUp={this.onDoSearch}/>
    )
  }
} );
