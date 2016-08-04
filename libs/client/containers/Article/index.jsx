import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'

import Content from './../../containers/Content'
import './styles.css'

// Main component
class Article extends Component {
  componentDidUpdate() {
    // If given update scroll position on container
    if ( this.props.scrollY ) {
      window.scrollTo( 0, this.props.scrollY );
    }
  }
  render(){
    var switcher,
      header = [],
      license = {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      },
      tagline = this.props.tagline;

    if ( this.props.actions ) {
      header.push( <HorizontalList className="page-actions">{this.props.actions}</HorizontalList> );
    }
    if ( this.props.title ) {
      header.push(
        <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: this.props.title}}></h1>
      );
    }
    if ( tagline ) {
      header.push(<div className="tagline" key="article-tagline">{tagline}</div>)
    }

    if ( this.props.mobileUrl ) {
      switcher = (
        <HorizontalList>
          <span>WebApp</span>
          <a href={this.props.mobileUrl}>Mobile</a>
          <a href={this.props.desktopUrl}>Desktop</a>
        </HorizontalList>
      );
    }
    var nsClass = this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading';

    return (
      <div className="mw-body">
        <Content key="article-row-0" className={"pre-content heading-holder" + nsClass}>
          {header}
        </Content>
        {this.props.children}
        <Content key="footer" className="post-content footer">
          <ul className="footer-info">
            <li>
              <h2>Weekipedia</h2>
              {switcher}
            </li>
            <li>Content is available under <a className="external" rel="nofollow" href={license.url}>{license.name}</a> unless otherwise noted.</li>
          </ul>
        </Content>
      </div>
    )
  }
}
Article.props = {
  actions: []
};

export default Article