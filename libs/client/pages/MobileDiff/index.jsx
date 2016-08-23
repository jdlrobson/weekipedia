import React from 'react'
import timeago from 'timeago'

import HorizontalList from './../../components/HorizontalList'
import IntermediateState from './../../components/IntermediateState'
import Icon from './../../components/Icon'

import Article from './../../containers/Article'
import Content from './../../containers/Content'

import './styles.less'
import './icons.less'

// Pages
export default React.createClass({
  getInitialState() {
    return {
      diff: null
    };
  },
  componentWillMount(){
    this.load( this.props.params );
  },
  componentWillReceiveProps( nextProps ){
    this.load( nextProps.params );
  },
  load( revId ) {
    var self = this;
    var endpoint = '/api/diff/' + this.props.lang + '/' + revId;
    this.props.api.fetch( endpoint ).then( function ( page ) {
      var rev = page.revisions[0];
      self.setState( {
        diff: {
          title: page.title,
          comment: rev.comment,
          user: rev.user,
          parent: rev.parentid,
          body: rev.diff.body,
          timestamp: rev.timestamp
        }
      } );
    } );
  },
  render(){
    var body, title, footer, link,
      links = [],
      urlPrefix = '/' + this.props.lang + '/wiki/',
      diff = this.state.diff;

    if ( diff ) {
      title = diff.title;
      links = [
        <a href={urlPrefix + 'Special:MobileDiff/' + diff.parent}
          onClick={this.props.onClickInternalLink}>← Previous edit</a>
      ];
      body = (
        <Content key="special-page-row-1" className="content">
          <div className="diff-header">
            <h2>
              <a href={urlPrefix + title}
                onClick={this.props.onClickInternalLink}>{title}</a>
            </h2>
            <div>edited {timeago( new Date( diff.timestamp ) )}</div>
          </div>
          <p className="diff-comment">{diff.comment}</p>
          <div className="diff-body" dangerouslySetInnerHTML={{ __html: diff.body }} />
          <HorizontalList className="diff-links">{links}</HorizontalList>
        </Content>
      );

      link = <a href={urlPrefix + 'User:' + diff.user}
        onClick={this.props.onClickInternalLink}>{diff.user}</a>;
      footer = (
        <Content>
          <Icon type="before" glyph="user" label={link} />
        </Content>
      )
    } else {
      body = <IntermediateState />;
    }


    return (
      <Article {...this.props} title="Changes"
        footer={footer}
        isSpecialPage='yes' body={body} />
    )
  }
} );
