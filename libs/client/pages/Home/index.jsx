import React, { Component } from 'react'

import HorizontalList from './../../components/HorizontalList'
import IntermediateState from './../../components/IntermediateState';
import TrendingCard from './../../components/TrendingCard';
import ErrorBox from './../../components/ErrorBox';

import Article from './../../containers/Article';
import Content from './../../containers/Content';
import CardList from './../../containers/CardList';

import './styles.css';

const HALF_LIFE_HOURS = '2';
const HALF_LIFE_DAYS = '10';
const HALF_LIFE_WEEKS = '36';

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      router: null,
      wiki: 'enwiki',
      halflife: HALF_LIFE_DAYS
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
    var links = [];
    var halflife = this.props.halflife;
    var hrClass = '', dayClass = '', wkClass = '';
    if ( halflife === HALF_LIFE_DAYS ) {
      dayClass = 'active';
    } else if ( halflife == HALF_LIFE_WEEKS ) {
      wkClass = 'active';
    } else if ( halflife === HALF_LIFE_HOURS ) {
      hrClass = 'active';
    }
    links = [
      <a href={'/hot/' + wiki + '/' + HALF_LIFE_HOURS} className={hrClass}>by hour</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_DAYS} className={dayClass}>by day</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_WEEKS} className={wkClass}>by week</a>
    ];
    if ( !hrClass && !dayClass && !wkClass ) {
      link.push( <a href={'/hot/' + wiki +'/' + halflife} className='active'>custom</a> );
    }
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
          <HorizontalList isSeparated="1" className="nav-list">
            {links}
          </HorizontalList>
          {children}
        </Content>
      </Article>
    )
  }
})

