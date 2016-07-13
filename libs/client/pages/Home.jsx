import React, { Component } from 'react'
import IntermediateState from './../components/IntermediateState';
import TrendingCard from './../components/TrendingCard';
import ErrorBox from './../components/ErrorBox';

import Article from './../containers/Article'
import Content from './../containers/Content'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      filter: ''
    };
  },
  getInitialState() {
    return {
      error: false,
      topics: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  load() {
    var self = this;
    this.props.api.getTrending( this.props.filter ).then( function ( data ) {
      var topics = data.map( function ( item ) {
        item.key = item.id;
        var obj = React.createElement(TrendingCard, item);
         return obj;
      } );
      self.setState({ topics: topics });
    } ).catch( function () {
      self.setState({ error: true });
    } );
  },
  render(){
    // show intermediate state if still loading, otherwise show list
    var children;
    if ( this.state.error ) {
      children = (<ErrorBox msg="Nothing is trending right now."></ErrorBox>)
    } else if ( this.state.topics ) {
      children = (<div className="list-simple-group">{this.state.topics}</div>);
    } else {
      children = (<IntermediateState></IntermediateState>);
    }

    return (
      <Article title={this.props.title} tagline="The wiki in real time">
        <Content>{children}</Content>
      </Article>
    )
  }
})

