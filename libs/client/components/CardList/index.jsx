import React from 'react'

import { ErrorBox, IntermediateState, ListHeader,
  CardWithLocation, CardList } from 'wikipedia-react-components';

import Content from './../Content'
import WatchIcon from './../WatchIcon'

import './styles.less'

const OFFLINE_ERROR = 'You do not have an internet connection';
const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function getCards( data, props, keyPrefix ) {
  var source = props.language_project ||
    ( props.language && props.project ? props.language + '.' + props.project : 'wiki' );
  var cards = [],
    CardClass = props.CardClass;

  if ( data.collections ) {
    data.pages = data.collections;
  }

  if ( data.pages && data.pages.length ) {
    data.pages.forEach( function ( item, i ) {
      var id = item.revid || item.pageid || item.id;
      item.key = keyPrefix + 'card-' + i + '-' + id + '-' + props.language_project;
      item.onClick = function ( ev ) {
        var node = ev.currentTarget;
        var link = node.tagName === 'A' ? node : node.querySelector( 'a' );
        var href = link.getAttribute( 'href' );
        var title = link.getAttribute( 'title' );
        if ( href ) {
          ev.preventDefault();
          props.router.navigateTo( { pathname: href }, title );
        }
      };
      if ( item.revid ) {
        item.url = '/' + source + '/Special:MobileDiff/' + item.revid;
      } else if ( !item.url && item.title ) {
        item.url = '/' + source + '/' + encodeURIComponent( item.title );
      }
      // some endpoints e.g. related endpoint return titles with `_`
      if ( item.title ) {
        item.title = item.title.replace( /_/g, ' ' );
      }

      var session = props.session;
      if ( session && props.collection && data.owner === session.username  && !props.unordered ) {
        item.indicator = <WatchIcon {...props}
          key={item.key + '-watch'}
          title={item.title} collection={props.collection} isWatched={true} />
      }
      if ( item.missing ) {
        item.thumbnail = {
          source: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Sin_mapa.svg/320px-Sin_mapa.svg.png'
        };
      }
      var session = props.session;
      var isOwner = ( session && data.owner === session.username ) || data.private;
      if ( isOwner && props.collection ) {
        item.indicator = <WatchIcon {...props}
          key={item.key + '-watch'}
          title={item.title} collection={props.collection} isWatched={true} />
      }
      // If server side rendering navigator will be undefined.
      if ( typeof( navigator ) !== 'undefined' && !navigator.onLine && item.offline !== undefined && !item.offline ) {
        item.className = 'offline';
      }
      cards.push( React.createElement( CardClass, Object.assign( {}, props, item ) ) );
    } );
  }
  return cards;
}

export default React.createClass({
  getDefaultProps: function () {
    return {
      CardClass: CardWithLocation,
      infiniteScroll: true,
      isDiffCardList: false,
      endpoint: null,
      continue: null,
      emptyMessage: 'The list is disappointedly empty.'
    };
  },
  getInitialState() {
    return {
      loadingMessage: 'Loading list',
      errorMsg: 'Something went wrong when trying to render the list. Please refresh and try again.',
      error: null,
      isPending: false,
      cards: null,
      continue: null
    };
  },
  loadCards( props ) {
    if ( props.apiEndpoint ) {
      this.load( props.apiEndpoint );
    }
  },
  componentWillReceiveProps( props ) {
    this.loadCards( props );
  },
  load( apiEndpoint ) {
    var self = this;
    var api = this.props.api;
    var props = this.props;
    var onEmpty = props.onEmpty;
    var cardListProps = {
      lang: props.lang,
      session: props.session,
      msg: props.msg,
      collection: props.collection,
      language_project: props.language_project,
      unordered: props.unordered,
      showNotification: props.showNotification,
      CardClass: props.CardClass,
      isDiffCardList: props.isDiffCardList,
      emptyMessage: props.emptyMessage,
      router: props.router,
      api: api
    };
    this.setState({ list : null });
    this.fetchCardListProps( apiEndpoint, cardListProps ).then( function ( state ) {
      self.setState( state );
      if ( state.cards.length === 0 && props.onEmpty ) {
        onEmpty();
      }
    } ).catch( function ( error ) {
      if ( error.message.indexOf( 'Failed to fetch' ) > -1 ) {
        self.setState({ errorMsg: OFFLINE_ERROR });
      }
      self.setState({ error: true });
    } );
  },
  fetchCardListProps: function ( url, props ) {
    return this.props.api.fetch( url ).then( function ( data ) {
      return {
        owner: data.owner,
        continue: data.continue,
        cards: getCards( data, props, url + '-' )
      };
    } );
  },
  loadMore() {
    var url,
      continuer = this.state.continue,
      self = this;

    if ( !this.state.isPending && this.props.api && continuer ) {
      url = this.props.apiEndpoint + '?' + this.props.api.param( continuer );
      this.setState( { isPending: true } );
      this.fetchCardListProps( url, this.props ).then( function ( props ) {
        // this wont work again without the continue
        self.setState( { continue: props.continue, isPending: false,
          owner: props.owner,
          cards: self.state.cards.concat( props.cards ) } );
      } );
    }
  },
  onScroll() {
    var self = this;
    if ( document.body.scrollHeight >= ( document.body.scrollTop + window.innerHeight ) / 2 ) {
      self.loadMore();
    }
  },
  componentWillUnmount() {
    document.removeEventListener( 'scroll', this.onScroll );
  },
  componentDidMount() {
    var props = this.props;

    this.loadCards( props );
    // setup infinite scroll
    if ( props.infiniteScroll && !props.limit ) {
      document.addEventListener( 'scroll', this.onScroll );
    }
  },
  render: function () {
    var lastTs;
    var props = this.props;
    var isDiffCardList = this.props.isDiffCardList;
    var isUnordered = props.unordered && !isDiffCardList;
    var cards = this.state.cards;
    var owner = this.state.owner || props.owner;
    if ( props.pages && !cards ) {
      cards = getCards( { pages: props.pages, owner: owner }, props );
    }
    if ( props.limit && cards ) {
      cards = cards.slice( 0, props.limit );
    }
    var cardsAndHeaders = [];
    var continuer = props.continue && props.endpoint ?
      <div className='gutter' /> : null;

    if ( this.state.error ) {
      cards = [
        <Content key="card-list-error">
          <ErrorBox msg={this.state.errorMsg}/>
        </Content>
      ];
    } else if ( !cards ) {
      cards = [<IntermediateState msg={this.props.loadingMessage} key="card-list-loading" />];
    } else if ( isDiffCardList ) {
      cards.forEach( function ( card, i ) {
        var ts, header;
        if ( card.props.timestamp ) {
          ts = new Date( card.props.timestamp );
          if ( !lastTs || ( ts.getDate() !== lastTs.getDate() ) ) {
            header = (
              <ListHeader key={'card-list-header-' + i + '-' + props.language_project}>
                {ts.getDate()} {MONTHS[ts.getMonth()]} {ts.getFullYear()}
              </ListHeader>
            );
            cardsAndHeaders.push( header );
          }
          lastTs = ts;
        }
        cardsAndHeaders.push( card );
      } );
      cards = cardsAndHeaders;
    }
    if ( continuer && !props.limit ) {
        cards.push( continuer );
    }
    return <CardList emptyMessage={props.emptyMessage}
        ordered={!isUnordered}
        className={ isDiffCardList ? ' diff-list side-list' : props.className}>{cards}</CardList>;
  }
} );