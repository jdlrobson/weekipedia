import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'

import Content from './../../containers/Content'

import ArticleFooter from './ArticleFooter'
import ArticleHeader from './ArticleHeader'

import './styles.less'

// Main component
class Article extends Component {
  componentDidUpdate() {
    // If given update scroll position on container
    if ( this.props.scrollY ) {
      window.scrollTo( 0, this.props.scrollY );
    }
  }
  render(){
    return (
      <div className="mw-body">
        <ArticleHeader {...this.props} />
        {this.props.children}
        <ArticleFooter {...this.props} />
      </div>
    )
  }
}
Article.props = {
  actions: []
};

export default Article