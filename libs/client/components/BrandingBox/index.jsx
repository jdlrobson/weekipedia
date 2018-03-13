import React, { Component } from 'react'

import { Icon, Header } from 'wikipedia-react-components'

import './styles.less'

const ChromeHeader = (props) => {
  var heading, project, icon, siteinfo, content;
  var search = props.search;
  var useSiteBranding = props.includeSiteBranding;
  var secondaryIcons = useSiteBranding ? [ <Icon /> ] : null;
  if ( props.secondaryIcons ) {
    secondaryIcons = props.secondaryIcons;
  }
  siteinfo = props.siteinfo;
  content = siteinfo.wordmark ?
    <img src={siteinfo.wordmark} alt={siteinfo.title} height="15" width="97" /> :
    siteinfo.title;

  project = props.project;

  if ( project !== siteinfo.defaultProject ) {
    icon = <div className={"project-icon project-" + project}>{project}</div>
  }
  return (
    <div className="branding-box" key="chrome-header-heading">
      <h1>
        <span>
          {content}
        </span>
        <sup>{icon}</sup>
      </h1>
    </div>
  );
}

export default ChromeHeader
