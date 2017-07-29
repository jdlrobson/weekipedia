import React from 'react'
import createReactClass from 'create-react-class'

import WatchListEdit from './WatchlistEdit'
import WatchListFeed from './WatchlistFeed'

// Pages
export default createReactClass({
  render(){
    var props = this.props;
    var isEditWatchlist = props.title === 'EditWatchlist';
    var prefix = '/' + this.props.lang + '/wiki/';

    var editLink = <a
      key="watchlist-list-tab"
      className={isEditWatchlist ? 'active' : '' }
      onClick={props.onClickInternalLink}
      href={prefix + 'Special:EditWatchlist'}>List</a>;

    var modLink = <a
      key="watchlist-modifier-tab"
      className={isEditWatchlist ? '' : 'active' }
      onClick={props.onClickInternalLink}
      href={prefix + 'Special:Watchlist'}>Modified</a>;

    var newProps = Object.assign( {}, props, {
      tabs: [ editLink, modLink ],
      tagline: 'Pages on your watchlist',
      title: 'Watchlist'
    } );

    if ( isEditWatchlist ) {
      return (<WatchListEdit {...newProps} />);
    } else {
      return (<WatchListFeed {...newProps} />);
    }
  }
})
