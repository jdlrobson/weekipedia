import React, { Component } from 'react'

import ArticleFooter from './ArticleFooter'
import ArticleHeader from './ArticleHeader'
import Content from './../Content'

import './styles.less'

// Main component
class Article extends Component {
  componentDidUpdate() {
    var node;

    if ( window.location.hash && window.location.hash !== '#' ) {
      try {
        node = document.querySelector( window.location.hash );
        node.scrollIntoView();
      } catch ( e ) {}
    } else if ( this.props.scrollY ) {
      window.scrollTo( 0, this.props.scrollY );
    }
  }
  render(){
    return (
      <div className="component-article mw-body">
        <ArticleHeader {...this.props} />
        <Content key="page-row-1" className={this.props.isSpecialPage ? '' : 'content'}>
          {this.props.body}
        </Content>
        <Content className="post-content">
          <div>{this.props.secondaryActions}</div>
        </Content>
        <ArticleFooter {...this.props} />
      </div>
    )
  }
}
Article.props = {
  tagline: '',
  lead: '',
  body: [],
  footer: [],
  tabs: [],
  actions: [],
  secondaryActions: []
};

export default Article