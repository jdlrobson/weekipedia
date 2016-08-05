import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'

import Content from './../../containers/Content'

// Main component
class ArticleFooter extends Component {
  render(){
    var switcher,
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

    return (
      <Content key="footer" className="post-content footer">
        <ul className="footer-info">
          <li>
            <h2>Weekipedia</h2>
            {switcher}
          </li>
          <li>Content is available under <a className="external" rel="nofollow" href={license.url}>{license.name}</a> unless otherwise noted.</li>
        </ul>
      </Content>
    )
  }
}

export default ArticleFooter