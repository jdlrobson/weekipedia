import React, { Component } from 'react'
import Content from './../../containers/Content'
import './styles.css'

// Main component
class Article extends Component {
  render(){
    var header = this.props.title ?
      [ <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: this.props.title}}></h1> ] : [],
      license = {
        url: '//creativecommons.org/licenses/by-sa/3.0/',
        name: 'CC BY-SA 3.0'
      },
      tagline = this.props.tagline;

    if ( tagline ) {
      header.push(<div className="tagline" key="article-tagline">{tagline}</div>)
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
            <li><h2>Weekipedia</h2></li>
            <li>Content is available under <a className="external" rel="nofollow" href={license.url}>{license.name}</a> unless otherwise noted.</li>
          </ul>
        </Content>
      </div>
    )
  }
}

export default Article