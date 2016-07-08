import React, { Component } from 'react'
import Content from './../../containers/Content'
import './styles.css'

// Main component
class Article extends Component {
  render(){
    var header = this.props.title ?
      [ <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: this.props.title}}></h1> ] : [],
      tagline = this.props.tagline;

    if ( tagline ) {
      header.push(<div className="tagline">{tagline}</div>)
    }

    return (
      <div className="mw-body">
        <Content key="article-row-0" className="pre-content heading-holder">
          {header}
        </Content>
        {this.props.children}
      </div>
    )
  }
}

export default Article