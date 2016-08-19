import React from 'react'

import IntermediateState from './../components/IntermediateState';
import ErrorBox from './../components/ErrorBox';

import Content from './../containers/Content'
import Article from './../containers/Article'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      CardClass: null,
      api: null,
      apiEndpoint: null,
      title: null,
      tagline: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      list: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  load() {
    var self = this;
    var api = this.props.api;
    var props = { lang: this.props.lang, unordered: this.props.unordered,
      isDiffCardList: this.props.isDiffCardList,
      router: this.props.router, api: api };
    api.fetchCardList( this.props.apiEndpoint, props, this.props.CardClass ).then( function ( list ) {
      self.setState({ list : list });
    } ).catch( function () {
      self.setState({ error: true });
    } );
  },
  render(){
    var body = [];

    if ( this.state.error ) {
      body = [
        <Content>
          <ErrorBox msg="Something went wrong when trying to render the list. Please refresh and try again."/>
        </Content>
      ];
    } else if ( this.state.list ) {
      body = [ this.state.list ];
    } else {
      body = [
        <Content><IntermediateState /></Content>
      ];
    }
    body = body.concat( this.props.children );

    return (
      <Article {...this.props} isSpecialPage="1" body={body} />
    )
  }
})

