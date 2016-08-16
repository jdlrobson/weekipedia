import React from 'react'

import LastModifiedBar from './../LastModifiedBar'

import ReadMore from './../../containers/ReadMore'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      related: null
    };
  },
  componentWillMount(){
    this.loadRelatedArticles( this.props.title, this.props.lang );
  },
  componentWillReceiveProps(nextProps){
    this.loadRelatedArticles( nextProps.title, nextProps.lang );
  },
  loadRelatedArticles( title, lang ) {
    var self = this;
    var endpoint = '/api/related/' + lang + '/' + title;
    if ( this.props.namespace === 0 ) {
      this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
        self.setState( {
          related: cards
        } );
      } );
    }
  },
  render(){
    var related;
    var props = this.props;
    var lang = props.lang;
    var title = props.title;

    if ( this.state.related ) {
      related = <ReadMore cards={this.state.related} key="article-read-more" />;
    }

    return (
      <div className="component-page-footer" key="article-footer">
        <LastModifiedBar editor={props.lastmodifier} lang={lang}
          title={title} timestamp={props.lastmodified} />
        {related}
      </div>
    )
  }
} );
