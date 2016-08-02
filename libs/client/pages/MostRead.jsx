import React, { Component } from 'react'

import ErrorBox from './../components/ErrorBox';
import IntermediateState from './../components/IntermediateState';
import HorizontalList from './../components/HorizontalList'

import Content from './../containers/Content'

import Random from './Random'
import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null
    };
  },
  getInitialState() {
    return {
      error: false
    };
  },
  render(){
    var lat = this.state.latitude;
    var lng = this.state.longitude;

    if ( this.state.error ) {
      return (<Content><ErrorBox msg="Something went wrong when trying to get most read."></ErrorBox></Content>)
    } else {
      var endpoint = '/api/visits/' + this.props.lang;

      return (
        <CardListPage {...this.props} apiEndpoint={endpoint}
          title='Most read' tagline="Pages that others are reading">
        </CardListPage>
      )
    }
  }
})

