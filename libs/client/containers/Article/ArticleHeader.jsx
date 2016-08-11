import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'
import SectionContent from './../../components/SectionContent'

import Content from './../../containers/Content'

// Main component
class ArticleHeader extends Component {
  render(){
    var tabs,
      header = [],
      nsClass = this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading',
      tagline = this.props.tagline;

    if ( this.props.actions ) {
      header.push( <HorizontalList className="page-actions" key="page-actions">{this.props.actions}</HorizontalList> );
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

    if ( this.props.tabs.length ) {
      tabs = <HorizontalList isSeparated="1">{this.props.tabs}</HorizontalList>
    }
    return (
      <Content key="article-row-0" className={"pre-content heading-holder" + nsClass}>
        {header}
        {tabs}
        <SectionContent {...this.props} text={this.props.lead} />
      </Content>
    )
  }
}

ArticleHeader.defaultProps = {
  tabs: []
};

export default ArticleHeader
