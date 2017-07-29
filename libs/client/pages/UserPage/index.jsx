import React from 'react'
import createReactClass from 'create-react-class'

import { Icon, Button } from 'wikipedia-react-components';

import WikiPage from './../WikiPage'

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

import './icons.less'
import './styles.less'

// Pages
export default createReactClass({
  onTalkClick( ev ) {
    ev.preventDefault();
    this.props.router.navigateTo( '#/talk/' );
  },
  getTabs(){
    var props = this.props,
      onClickInternalLink = props.onClickInternalLink,
      titleSansPrefix = props.titleSansPrefix,
      getLocalUrl = props.getLocalUrl;

    return [
      <a href={getLocalUrl('User talk:' + titleSansPrefix)}
        onClick={this.onTalkClick}
        key="page-talk-tab">Talk</a>,
      <a href={getLocalUrl('Special:Collections', 'by/' + titleSansPrefix)}
        onClick={onClickInternalLink}
        key="page-collections-tab">{props.msg( 'menu-collections' )}</a>,
      <a href={getLocalUrl('Special:Contributions', titleSansPrefix)}
        onClick={onClickInternalLink}
        key="page-contrib-tab">Contributions</a>,
      <a href={getLocalUrl('Special:Uploads', titleSansPrefix )}
        onClick={onClickInternalLink}
        key="page-upload-tab">Uploads</a>
    ];
  },
  render(){
    var registered,
      body = [],
      props = this.props,
      lead = props.lead || {},
      leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : undefined;

    var user = props.title;
    var editUrl = "#/editor/0";
    var isReaderOwner = props.session && props.session.username === props.titleSanPrefix;
    var msg = isReaderOwner ? 'You don\'t have a user page yet' : 'No user page for ' + props.user;
    var pText = isReaderOwner ? 'You can describe yourself to fellow editors on your user page' :
      'This page should be created and edited by ' + user;
    var btn = isReaderOwner ? <Button label="Create your own" href={editUrl} isPrimary="1" /> :
      <a href={editUrl} className="mw-ui-progressive ">Create a page called User:{user}</a>

    if ( !leadHtml ) {
      body.push(
        <div className="component-user-page-cta" key="page-user-cta">
          <Icon glyph="user-page" large={true} />
          <h3>{msg}</h3>
          <p>{pText}</p>
          {btn}
        </div>
      );
    } else {
      body = props.body;
    }

    // workaround for T156830
    if ( lead.userinfo && lead.userinfo.missing === undefined ) {
      registered = new Date( lead.userinfo.registration );
      // FIXME: Translate
      lead.description = 'Member since ' + MONTHS[ registered.getMonth() ] + ', ' + registered.getFullYear();
    }

    return (
      <WikiPage {...props} body={body} tabs={this.getTabs()} />
    )
  }
} );
