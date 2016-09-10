import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'
import SectionContent from './../../components/SectionContent'

import Content from './../../containers/Content'

// Main component
class ArticleHeader extends Component {
  render(){
    var
      header = [],
      lead = this.props.lead || {},
      nsClass = this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading';

    if ( typeof lead === 'string' ) {
      lead = { text: lead };
    }
    if ( this.props.tagline ) {
      lead.description = this.props.tagline;
    }
    if ( !lead.displaytitle && this.props.title ) {
      lead.displaytitle = this.props.title;
    }

    if ( this.props.actions ) {
      header.push( <HorizontalList className="page-actions" key="page-actions">{this.props.actions}</HorizontalList> );
    }
    if ( lead.displaytitle ) {
      header.push(
        <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: lead.displaytitle }}></h1>
      );
    }
    header.push(<div className="tagline" key="article-tagline">{lead.description}</div>)
    if ( lead.hatnote ) {
      header.push( <p className="hatnote" dangerouslySetInnerHTML={{ __html: lead.hatnote}} /> );
    }

    if ( this.props.tabs.length ) {
      header.push( <HorizontalList isSeparated="1"
        key="article-header-tabs">{this.props.tabs}</HorizontalList> );
    }
    return (
      <Content key="article-row-0" className={"pre-content " + nsClass}>
        <div className="heading-holder">{header}</div>
        <p className="lead-paragraph" dangerouslySetInnerHTML={{ __html: lead.paragraph}} />
        <div className="infobox-container" dangerouslySetInnerHTML={{ __html: lead.infobox}} />
        <SectionContent {...this.props} text={lead.text} />
      </Content>
    )
  }
}

ArticleHeader.defaultProps = {
  tabs: []
};

export default ArticleHeader
