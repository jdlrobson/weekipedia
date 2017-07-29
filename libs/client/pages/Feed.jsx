import React from 'react'
import createReactClass from 'create-react-class'

import TrendingCard from './../components/TrendingCard';
import PushButton from './../components/PushButton';

import CardListPage from './CardListPage'

const HALF_LIFE_HOURS = '1.5';
const HALF_LIFE_DAYS = '12';
const HALF_LIFE_WEEKS = '84';

// Pages
export default createReactClass({
  getDefaultProps: function () {
    return {
      router: null,
      wiki: 'enwiki',
      params: '',
      halflife: HALF_LIFE_DAYS
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
    var emptyProps = {
      msg: 'Nothing has trended recently.'
    };
    var links = [];
	var props = this.props;
    var args = this.props.params.split( '/' );
    var wiki = args[0] || 'enwiki';
    var halflife = args[1] || props.halflife;
    var prefix = '/wiki/Special:Feed/'

    var endpoint = '/api/en.wikipedia.org/rest_v1/feed/trending/edits/' + ( halflife * 2 );
    var hrClass = '', dayClass = '', wkClass = '', tClass = '';
    if ( wiki === 'old' ) {
      wiki = 'enwiki';
      endpoint = '/api/trending/' + wiki + '/' + halflife;
    } else if ( halflife === '84' ) {
      endpoint = '/api/edit-trends-week'
    }
    if ( halflife === HALF_LIFE_DAYS ) {
      emptyProps.msg = 'Nothing has happened today.';
      dayClass = 'active';
    } else if ( halflife === HALF_LIFE_WEEKS ) {
      wkClass = 'active';
      emptyProps.msg = 'Nothing has happened this week.';
    } else if ( halflife === HALF_LIFE_HOURS ) {
      hrClass = 'active';
      emptyProps.msg = 'Nothing has happened in the last hour.';
    } else if ( halflife === 'n' ) {
      tClass = 'active';
      endpoint = '/api/web-push/service/trending';
    }

    links = [
      <a href={prefix + wiki + '/' + HALF_LIFE_HOURS} className={hrClass} key='hot-filter-1'
        onClick={this.props.onClickInternalLink}>by hour</a>,
      <a href={prefix + wiki +'/' + HALF_LIFE_DAYS} className={dayClass} key='hot-filter-2'
        onClick={this.props.onClickInternalLink}>by day</a>,
      <a href={prefix + wiki +'/' + HALF_LIFE_WEEKS} className={wkClass} key='hot-filter-3'
        onClick={this.props.onClickInternalLink}>by week</a>,
      <a href={prefix + wiki +'/n'} className={tClass} key='hot-filter-4'
        onClick={this.props.onClickInternalLink}>notable</a>
    ];
    if ( !hrClass && !dayClass && !wkClass && !tClass ) {
      links.push( <a href={'/hot/' + wiki +'/' + halflife} className='active' key='hot-filter-4'>custom</a> );
    }

    push = (
      <PushButton api={this.props.api} key="home-push" />
    );

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint} tabs={links}
        emptyProps={emptyProps} CardClass={TrendingCard}
        title='Hot' tagline="The wiki in real time">{push}</CardListPage>
    )
  }
})

