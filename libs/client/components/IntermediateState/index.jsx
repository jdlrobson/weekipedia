import React from 'react'
import './styles.less'

import ErrorBox from './../ErrorBox'

export default React.createClass({
  componentWillMount() {
    this.setState( { jsEnabled: false } );
  },
  componentDidMount() {
    this.setState( { jsEnabled: true } );
  },
  render() {
    var props = this.props;
    var msg = props.msg || 'Loading';
    return (
      <div className={ this.state.jsEnabled ? "pending" : ""}>
        {this.state.jsEnabled ? msg : ''}
        <noscript><ErrorBox msg="Unable to load on your browser."/></noscript>
      </div>
    )
  }
});
