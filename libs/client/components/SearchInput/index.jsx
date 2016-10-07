import React from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

export default React.createClass({
  onDoSearch( ev ){
    ev.preventDefault();
    this.props.onSearch( ev.currentTarget.value );
  },
  componentDidMount: function(){
    var input = ReactDOM.findDOMNode( this );
    if ( this.props.focusOnRender ) {
      input.focus();
      // show keyboard
      input.click();
    }
    if ( this.props.defaultValue ) {
      this.props.onSearch( this.props.defaultValue );
    }
  },
  render() {
    return (
      <input className="search" type="search" placeholder={this.props.placeholder} ref="input" onClick={this.props.onClick} onInput={this.onDoSearch} defaultValue={this.props.defaultValue}
        onKeyUp={this.onDoSearch}/>
    )
  }
} );
