import React from 'react'

import WatchListEdit from './WatchlistEdit'
import WatchListFeed from './WatchlistFeed'

// Pages
export default React.createClass({
  render(){
    var props = this.props;
    var isEditWatchlist = props.title === 'EditWatchlist';
    var prefix = '/' + this.props.lang + '/wiki/';

    var editLink = <a
      className={isEditWatchlist ? 'active' : '' }
      onClick={props.onClickInternalLink}
      href={prefix + 'Special:EditWatchlist'}>List</a>;

    var modLink = <a
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
