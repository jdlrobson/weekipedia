import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

export default React.createClass({
  onDoSearch( ev ){
    this.props.onSearch( ev.currentTarget.value );
  },
  componentDidMount: function(){
    var input = ReactDOM.findDOMNode( this );
    if ( this.props.focusOnRender ) {
      input.focus();
      // show keyboard
      input.click();
    }
  },
  render() {
    return (
      <input className="search" type="search" placeholder={this.props.placeholder} ref="input" onClick={this.props.onClick}
        onKeyUp={this.onDoSearch}/>
    )
  }
} );
