import React from 'react'

import ErrorBox from './../components/ErrorBox';

import Content from './../containers/Content'

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

