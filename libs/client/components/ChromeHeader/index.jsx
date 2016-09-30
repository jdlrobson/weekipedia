import React, { Component } from 'react'

import Header from './../../components/Header'
import Icon from './../Icon'

import './styles.less'

class ChromeHeader extends Component {
  render(){
    var heading, project, icon, siteinfo, content;
    var props = this.props;
    var search = props.search;
    var useSiteBranding = props.siteoptions.includeSiteBranding;
    if ( useSiteBranding ) {
      siteinfo = props.siteinfo;
      content = siteinfo.wordmark ? <img src={siteinfo.wordmark} alt={siteinfo.title} height="18" /> :
        siteinfo.title;
      project = props.project;

      if ( project !== siteinfo.defaultProject ) {
        icon = <div className={"project-icon project-" + project}>{project}</div>
      }
      heading = <h1 key="chrome-header-heading">{content} {icon}</h1>;
    } else {
      heading = search;
      search = null;
    }

    return <Header key="header-bar" primaryIcon={props.primaryIcon}
      fixed={props.fixed}
      main={heading}
      secondaryIcon={useSiteBranding ? <Icon /> : null}
      search={search}></Header>
  }
}

export default ChromeHeader
