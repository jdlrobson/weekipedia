import React, { Component } from 'react'

import Header from './../../components/Header'
import { Icon } from 'wikipedia-react-components'

import './styles.less'

class ChromeHeader extends Component {
  componentDidMount() {
    // cache the request so it doesn't get requested multiple times.
    new Image( this.props.siteinfo.wordmark );
  }
  render(){
    var heading, project, icon, siteinfo, content;
    var props = this.props;
    var search = props.search;
    var useSiteBranding = props.siteoptions.includeSiteBranding;
    var secondaryIcon = useSiteBranding ? <Icon /> : null;
    if ( this.props.secondaryIcon ) {
      secondaryIcon = this.props.secondaryIcon;
    }
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
      secondaryIcon={secondaryIcon}
      search={search}></Header>
  }
}

export default ChromeHeader
