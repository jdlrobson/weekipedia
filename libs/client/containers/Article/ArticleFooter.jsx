import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'

import Content from './../../containers/Content'

// Main component
class ArticleFooter extends Component {
  render(){
    var switcher, wordmark, places = [],
      siteinfo = this.props.siteinfo,
      license = {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      };

    if ( this.props.mobileUrl ) {
      switcher = (
        <HorizontalList>
          <span>WebApp</span>
          <a href={this.props.mobileUrl}>Mobile</a>
          <a href={this.props.desktopUrl}>Desktop</a>
        </HorizontalList>
      );
    }
    wordmark = siteinfo.wordmark ? <img src={siteinfo.wordmark} alt={siteinfo.title} height="16" />
      : <h2>{siteinfo.title}</h2>;

    if ( siteinfo.termsUrl ) {
      places.push(
        <a key="article-footer-terms-url" href={siteinfo.termsUrl}>Terms of Use</a>
      );
    }

    if ( siteinfo.privacyUrl ) {
      places.push(
        <a key="article-footer-privacy-url" href={siteinfo.privacyUrl}>Privacy</a>
      );
    }

    return (
      <Content key="footer" className="post-content footer">
        {this.props.footer}
        <ul className="footer-info">
          <li>{wordmark}{switcher}</li>
          <li>Content is available under <a className="external" rel="nofollow" href={license.url}>{license.name}</a> unless otherwise noted.</li>
        </ul>
        <HorizontalList isSeparated="1">{places}</HorizontalList>
      </Content>
    )
  }
}

export default ArticleFooter