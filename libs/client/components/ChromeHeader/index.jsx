import React, { Component } from 'react'

class ChromeHeader extends Component {
  render(){
    var siteinfo = this.props.siteinfo;
    var content = siteinfo.wordmark ? <img src={siteinfo.wordmark} alt={siteinfo.title} height="18" /> :
      siteinfo.title;

    return (
      <h1>{content}</h1>
    )
  }
}

export default ChromeHeader
