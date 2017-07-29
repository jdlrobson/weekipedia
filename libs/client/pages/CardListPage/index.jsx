import React from 'react'
import createReactClass from 'create-react-class'

import { CardWithLocation } from 'wikipedia-react-components'

import EmptyList from './EmptyList'

import CardList from './../../components/CardList'

import Article from './../Article'

import './styles.less'

// Pages
export default createReactClass({
  getDefaultProps: function () {
    return {
      CardClass: CardWithLocation,
      api: null,
      apiEndpoint: null,
      title: null,
      tagline: null,
      lang: 'en'
    };
  },
  onEmpty() {
    this.setState( { isEmpty: true } );
  },
  getInitialState() {
    return {
      isEmpty: false,
      errorMsg: 'Something went wrong when trying to render the list. Please refresh and try again.',
      error: false,
      list: null
    };
  },
  componentWillReceiveProps() {
    this.setState( { isEmpty: false } );
  },
  render(){
    var props = this.props;
    // api endpoint may change...
    var key = 'card-list-page-card-list-' + props.language_project + '-' + props.apiEndpoint;
    var body = [ <CardList key={key} {...props}
      title={undefined}
      onEmpty={this.onEmpty}/> ]
      .concat( props.children );

    if ( this.state.isEmpty ) {
      body = <EmptyList {...props} {...props.emptyProps} />
    }
    return (
      <Article {...this.props} isSpecialPage="1" body={body} />
    )
  }
})

