import React from 'react'

import Button from './../Button'
import LastModifiedBar from './../LastModifiedBar'

import Content from './../../containers/Content'
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
    this.props.api.fetchCards( endpoint, this.props ).then( function ( cards ) {
      self.setState( {
        related: cards
      } );
    } );
  },
  render(){
    var btns = [];
    var related;
    var props = this.props;
    var lang = props.lang;
    var title = props.title;

    if ( props.namespace === 0 ) {
      btns.push(<Button key="article-talk" href={'/' + lang + '/wiki/Talk:' + title }
        label="Talk" />);
    }

    if ( this.state.related ) {
      related = <ReadMore cards={this.state.related} key="article-read-more" />;
    }

    return (
      <Content className="component-page-footer" key="article-footer">
        <div>{btns}</div>
        <LastModifiedBar editor={props.lastmodifier} lang={lang}
          title={title} timestamp={props.lastmodified} />
        {related}
      </Content>
    )
  }
} );
