import React from 'react'

import IntermediateState from './../../components/IntermediateState';
import TrendingCard from './../../components/TrendingCard';
import ErrorBox from './../../components/ErrorBox';
import PushButton from './../../components/PushButton';

import Article from './../../containers/Article';
import Content from './../../containers/Content';

const HALF_LIFE_HOURS = '0.1';
const HALF_LIFE_DAYS = '10';
const HALF_LIFE_WEEKS = '36';
const OFFLINE_ERROR = 'You do not have an internet connection';

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      isBetaMode: false,
      router: null,
      wiki: 'enwiki',
      halflife: HALF_LIFE_HOURS
    };
  },
  getInitialState() {
    return {
      error: false,
      cardList: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
  },
  load() {
    var self = this;
    var props = this.props;
    var wiki = props.wiki;
    var halflife = props.halflife;
    var endpoint = '/api/trending/' + wiki + '/' + halflife;
    var cardListProps = Object.assign( {}, props, {
      emptyMessage: 'Nothing is trending right now.'
    } );

    this.props.api.fetchCardList( endpoint, cardListProps, TrendingCard ).then( function ( cardList ) {
      self.setState({ cardList: cardList });
    } ).catch( function ( error ) {
      if ( error.message.indexOf( 'Failed to fetch' ) > -1 ) {
        self.setState({ errorMsg: OFFLINE_ERROR });
      }
      self.setState({ error: true });
    } );
  },
  render(){
    // show intermediate state if still loading, otherwise show list
    var children, footer;
    var wiki = this.props.wiki;
    var links = [];
    var halflife = this.props.halflife;
    var hrClass = '', dayClass = '', wkClass = '';
    if ( halflife === HALF_LIFE_DAYS ) {
      dayClass = 'active';
    } else if ( halflife === HALF_LIFE_WEEKS ) {
      wkClass = 'active';
    } else if ( halflife === HALF_LIFE_HOURS ) {
      hrClass = 'active';
    }
    links = [
      <a href={'/hot/' + wiki + '/' + HALF_LIFE_HOURS} className={hrClass} key='hot-filter-1'>by hour</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_DAYS} className={dayClass} key='hot-filter-2'>by day</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_WEEKS} className={wkClass} key='hot-filter-3'>by week</a>
    ];
    if ( !hrClass && !dayClass && !wkClass ) {
      links.push( <a href={'/hot/' + wiki +'/' + halflife} className='active' key='hot-filter-4'>custom</a> );
    }
    if ( this.state.error ) {
      children = (<ErrorBox msg={this.state.errorMsg}></ErrorBox>)
    } else if ( this.state.cardList ) {
      children = (this.state.cardList);
    } else {
      children = (<IntermediateState></IntermediateState>);
    }

    footer = (
      <Content className="post-content">
        <PushButton api={this.props.api} />
      </Content>
    );

    return (
      <Article {...this.props} tagline="The wiki in real time" isSpecialPage="1"
        tabs={links}
        body={children} footer={footer} />
    )
  }
})

