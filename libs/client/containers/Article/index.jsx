import React, { Component } from 'react'
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
        <div className="pre-content heading-holder">
          {header}
        </div>
        <div className="content">
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Article