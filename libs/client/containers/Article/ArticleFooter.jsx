import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'

import Content from './../../containers/Content'

// Main component
class ArticleFooter extends Component {
  render(){
    var wordmark, places = [],
      siteinfo = this.props.siteinfo,
      license = {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      };

    wordmark = siteinfo.wordmark ? <h2><img src={siteinfo.wordmark} alt={siteinfo.title} height="30" /></h2>
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

    if ( this.props.desktopUrl ) {
      places.push( <a href={this.props.desktopUrl}>Desktop</a> );
    }

    return (
      <div key="footer" className="post-content footer">
        {this.props.footer}
        <Content className="footer-info">
          {wordmark}
          <div>Content is available under <a className="external" rel="nofollow" href={license.url}>{license.name}</a> unless otherwise noted.</div>
          <HorizontalList isSeparated="1">{places}</HorizontalList>
        </Content>
      </div>
    )
  }
}

export default ArticleFooter