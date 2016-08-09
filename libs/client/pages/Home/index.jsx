import React from 'react'

import HorizontalList from './../../components/HorizontalList'
import IntermediateState from './../../components/IntermediateState';
import TrendingCard from './../../components/TrendingCard';
import ErrorBox from './../../components/ErrorBox';
import PushButton from './../../components/PushButton';

import Article from './../../containers/Article';
import Content from './../../containers/Content';
import CardList from './../../containers/CardList';

import './styles.less';

const HALF_LIFE_HOURS = '2';
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
      halflife: HALF_LIFE_DAYS
    };
  },
  getInitialState() {
    return {
      error: false,
      errorMsg: 'Nothing is trending right now.',
      topics: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.load();
    if ( window.location.search.indexOf( 'beta=' ) > -1 ) {
      this.setState( { isBetaMode: true } );
    }
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
      <a href={'/hot/' + wiki + '/' + HALF_LIFE_HOURS} className={hrClass}>by hour</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_DAYS} className={dayClass}>by day</a>,
      <a href={'/hot/' + wiki +'/' + HALF_LIFE_WEEKS} className={wkClass}>by week</a>
    ];
    if ( !hrClass && !dayClass && !wkClass ) {
      links.push( <a href={'/hot/' + wiki +'/' + halflife} className='active'>custom</a> );
    }
    if ( this.state.error ) {
      children = (<ErrorBox msg={this.state.errorMsg}></ErrorBox>)
    } else if ( this.state.topics ) {
      children = (<CardList cards={this.state.topics} />);
    } else {
      children = (<IntermediateState></IntermediateState>);
    }

    if ( this.state.isBetaMode ) {
      footer = (
        <Content className="post-content">
          <PushButton api={this.props.api} />
        </Content>
      );
    }
    return (
      <Article {...this.props} tagline="The wiki in real time" isSpecialPage="1">
        <Content className="pre-content-special">
          <HorizontalList isSeparated="1" className="nav-list">
            {links}
          </HorizontalList>
        </Content>
        <Content>
          {children}
        </Content>
        {footer}
      </Article>
    )
  }
})

