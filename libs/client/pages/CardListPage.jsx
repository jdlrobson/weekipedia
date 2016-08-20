import React from 'react'

import IntermediateState from './../components/IntermediateState';
import ErrorBox from './../components/ErrorBox';

import Content from './../containers/Content'
import Article from './../containers/Article'

const OFFLINE_ERROR = 'You do not have an internet connection';

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
      errorMsg: 'Something went wrong when trying to render the list. Please refresh and try again.',
      error: false,
      list: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentDidMount(){
    this.load( this.props.apiEndpoint );
  },
  componentWillReceiveProps( props ) {
    this.load( props.apiEndpoint );
  },
  load( apiEndpoint ) {
    var self = this;
    var api = this.props.api;
    var props = this.props;
    var cardListProps = {
      lang: props.lang,
      unordered: props.unordered,
      isDiffCardList: props.isDiffCardList,
      emptyMessage: props.emptyMessage,
      router: props.router,
      api: api
    };
    this.setState({ list : null });
    api.fetchCardList( apiEndpoint, cardListProps, props.CardClass ).then( function ( list ) {
      self.setState({ list : list });
    } ).catch( function ( error ) {
      if ( error.message.indexOf( 'Failed to fetch' ) > -1 ) {
        self.setState({ errorMsg: OFFLINE_ERROR });
      }
      self.setState({ error: true });
    } );
  },
  render(){
    var body = [];

    if ( this.state.error ) {
      body = [
        <Content key="card-list-error">
          <ErrorBox msg={this.state.errorMsg}/>
        </Content>
      ];
    } else if ( this.state.list ) {
      body = [ this.state.list ];
    } else {
      body = [
        <Content key="card-list-loading"><IntermediateState /></Content>
      ];
    }
    body = body.concat( this.props.children );

    return (
      <Article {...this.props} isSpecialPage="1" body={body} />
    )
  }
})

