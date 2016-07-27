import React, { Component } from 'react'

import HorizontalList from './../components/HorizontalList'
import IntermediateState from './../components/IntermediateState';
import TrendingCard from './../components/TrendingCard';
import ErrorBox from './../components/ErrorBox';

import Article from './../containers/Article'
import Content from './../containers/Content'
import CardList from './../containers/CardList'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      router: null,
      wiki: 'enwiki',
      halflife: null,
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
    var props = this.props;

    this.props.api.getTrending( this.props.wiki, this.props.halflife ).then( function ( data ) {
      var topics = data.map( function ( item ) {
        item.key = item.id;
        return React.createElement( TrendingCard, Object.assign( {}, props, item ) );
      } );
      self.setState({ topics: topics });
    } ).catch( function () {
      self.setState({ error: true });
    } );
  },
  render(){
    // show intermediate state if still loading, otherwise show list
    var children;
    var wiki = this.props.wiki;

    if ( this.state.error ) {
      children = (<ErrorBox msg="Nothing is trending right now."></ErrorBox>)
    } else if ( this.state.topics ) {
      children = (<CardList cards={this.state.topics} />);
    } else {
      children = (<IntermediateState></IntermediateState>);
    }

    return (
      <Article {...this.props} tagline="The wiki in real time">
        <Content>
          <HorizontalList isSeparated="1">
            <a href={'/hot/' + wiki }>by hour</a>
            <a href={'/hot/' + wiki +'/48'}>by day</a>
            <a href={'/hot/' + wiki +'/84'}>by week</a>
          </HorizontalList>
          {children}
        </Content>
      </Article>
    )
  }
})

