import React from 'react'

import CardList from './CardList'
import EditorLink from './EditorLink'

export default React.createClass({
  getInitialState(){
    return {
      wikitext: ''
    };
  },
  componentDidMount() {
    var self = this;
    var props = this.props;
    props.api.fetch( props.apiEndpoint ).then( function ( json ) {
      var text = json.pages.map( function ( page ) {
        return '* [[' + page.title + ']]';
      } ).join( '\n' );
      if ( props.section ) {
        text = '\n' + text + '\n\n';
      } else {
        text = '== Go next ==\n\n' + text;
      }
      self.setState( { wikitext: text } );
    } );
  },
  render(){
    var props = this.props;
    var editLink;
    if (!props.foreign) {
      editLink = (
        <EditorLink key="editor-link-new-nearby"
          session={props.session}
          section={props.section || 'new'}
          wikitext={this.state.wikitext}
          label="Curate list" />
      );
    }
    return (
      <div>
        <CardList {...this.props}
            key="go-next-card-list"
            emptyMessage="Nothing near but tumbleweed."
            infiniteScroll={false}
            router={props.router} />
        {editLink}
      </div>
    )
  }
})
