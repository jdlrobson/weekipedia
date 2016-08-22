import React from 'react'

import TrendingCard from './../components/TrendingCard';
import PushButton from './../components/PushButton';

import CardListPage from './CardListPage'

const HALF_LIFE_HOURS = '0.5';
const HALF_LIFE_DAYS = '12';
const HALF_LIFE_WEEKS = '84';

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      router: null,
      wiki: 'enwiki',
      params: '',
      halflife: HALF_LIFE_HOURS
    };
  },
  getInitialState() {
    return {
      error: false,
      cardList: null
    };
  },
  render(){
    // show intermediate state if still loading, otherwise show list
    var push;
    var links = [];
    var args = this.props.params.split( '/' );
    var wiki = args[0] || 'enwiki';
    var halflife = args[1] || HALF_LIFE_HOURS;
    var prefix = '/wiki/Special:Feed/'
    
    var endpoint = '/api/trending/' + wiki + '/' + halflife;
    var hrClass = '', dayClass = '', wkClass = '';
    if ( halflife === HALF_LIFE_DAYS ) {
      dayClass = 'active';
    } else if ( halflife === HALF_LIFE_WEEKS ) {
      wkClass = 'active';
    } else if ( halflife === HALF_LIFE_HOURS ) {
      hrClass = 'active';
    }
    links = [
      <a href={prefix + wiki + '/' + HALF_LIFE_HOURS} className={hrClass} key='hot-filter-1'
        onClick={this.props.onClickInternalLink}>by hour</a>,
      <a href={prefix + wiki +'/' + HALF_LIFE_DAYS} className={dayClass} key='hot-filter-2'
        onClick={this.props.onClickInternalLink}>by day</a>,
      <a href={prefix + wiki +'/' + HALF_LIFE_WEEKS} className={wkClass} key='hot-filter-3'
        onClick={this.props.onClickInternalLink}>by week</a>
    ];
    if ( !hrClass && !dayClass && !wkClass ) {
      links.push( <a href={'/hot/' + wiki +'/' + halflife} className='active' key='hot-filter-4'>custom</a> );
    }

    push = (
      <PushButton api={this.props.api} key="home-push" />
    );

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint} tabs={links}
        emptyMessage="Nothing is trending right now." CardClass={TrendingCard}
        title='Hot' tagline="The wiki in real time">{push}</CardListPage>
    )
  }
})

