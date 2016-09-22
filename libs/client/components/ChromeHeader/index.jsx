import React, { Component } from 'react'

import './styles.less'

class ChromeHeader extends Component {
  render(){
    var icon;
    var siteinfo = this.props.siteinfo;
    var content = siteinfo.wordmark ? <img src={siteinfo.wordmark} alt={siteinfo.title} height="18" /> :
      siteinfo.title;
    var project = this.props.project;

    if ( project !== siteinfo.defaultProject ) {
      icon = <div className={"project-icon project-" + project}>{project}</div>
    }
    return (
      <h1>{content} {icon}</h1>
    )
  }
}

export default ChromeHeader
