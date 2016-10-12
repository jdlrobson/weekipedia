import React from 'react'

import WikiPage from './../containers/WikiPage'

import UserPageCta from './../components/UserPageCta'

// Pages
export default React.createClass({
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
    var body = [],
      props = this.props,
      lead = props.lead || {},
      leadHtml = lead.sections && lead.sections.length ? lead.sections[0].text : undefined;

    if ( !leadHtml ) {
      body.push( <UserPageCta user={props.title} key="page-user-cta"
        isReaderOwner={props.session && props.session.username === props.titleSanPrefix } /> );
    } else {
      body = props.body;
    }

    return (
      <WikiPage {...props} body={body} tabs={this.getTabs()} />
    )
  }
} );
