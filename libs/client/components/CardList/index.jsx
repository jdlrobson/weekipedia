import React from 'react'

import ListHeader from './../ListHeader'
import ErrorBox from './../ErrorBox';
import PreviewCard from './../PreviewCard'
import IntermediateState from './../IntermediateState';

import Content from './../../containers/Content'

import './styles.less'

const OFFLINE_ERROR = 'You do not have an internet connection';
const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

function getCards( data, props, keyPrefix ) {
  var cards = [],
    CardClass = props.CardClass;

  if ( data.pages && data.pages.length ) {
    data.pages.forEach( function ( item, i ) {
      var id = item.revid || item.pageid || item.id;
      item.key = keyPrefix + 'card-' + i + '-' + id;
      // If no title we can assume they are all the same page so promote username
      if ( !item.title ) {
        item.title = item.user;
      }
      cards.push( React.createElement( CardClass, Object.assign( {}, props, item ) ) );
    } );
  }
  return cards;
}

export default React.createClass({
  getDefaultProps: function () {
    return {
      CardClass: PreviewCard,
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
  componentWillReceiveProps( props ) {
    this.load( props.apiEndpoint );
  },
  load( apiEndpoint ) {
    var self = this;
    var api = this.props.api;
    var props = this.props;
    var cardListProps = {
      lang: props.lang,
      unordered: props.unordered,
      CardClass: props.CardClass,
      isDiffCardList: props.isDiffCardList,
      emptyMessage: props.emptyMessage,
      router: props.router,
      api: api
    };
    this.setState({ list : null });
    this.fetchCardListProps( apiEndpoint, cardListProps ).then( function ( state ) {
      self.setState( state );
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
        continue: data.continue,
        cards: getCards( data, props, url + '-' )
      };
    } );
  },
  loadMore() {
    var url,
      continuer = this.state.continue,
      self = this;

    // Issue with node-jquery-param
    function param( args ) {
      var key,
        array = [];

      for( key in args ) {
         array.push( encodeURIComponent(key) + '=' + encodeURIComponent( args[key] ) );
      }
      return array.join( '&' );
    }

    if ( !this.state.isPending && this.props.api && continuer ) {
      url = this.props.apiEndpoint + '?' + param( continuer );
      this.setState( { isPending: true } );
      this.fetchCardListProps( url, this.props ).then( function ( props ) {
        // this wont work again without the continue
        self.setState( { continue: props.continue, isPending: false,
          cards: self.state.cards.concat( props.cards ) } );
      } );
    }
  },
  componentDidMount() {
    var self = this;
    this.load( this.props.apiEndpoint );
    // setup infinite scroll
    if ( this.props.infiniteScroll ) {
      document.addEventListener( 'scroll', function () {
        if ( document.body.scrollHeight === document.body.scrollTop + window.innerHeight ) {
          self.loadMore();
        }
      } );
    }
  },
  render: function () {
    var lastTs;
    var props = this.props;
    var isDiffCardList = this.props.isDiffCardList;
    var isUnordered = props.unordered && !isDiffCardList;
    var cards = this.state.cards;
    var cardsAndHeaders = [];
    var continuer = props.continue && props.endpoint ?
      <div className='gutter' /> : null;
    var className = 'card-list' + ( isUnordered ? ' card-list-unordered' : '' );

    if ( this.state.error ) {
      return (
        <Content key="card-list-error">
          <ErrorBox msg={this.state.errorMsg}/>
        </Content>
      );
    } else if ( !cards ) {
      return <Content key="card-list-loading"><IntermediateState msg={this.props.loadingMessage} /></Content>;
    }

    if ( isDiffCardList ) {
      className += ' diff-list';
      cards.forEach( function ( card, i ) {
        var ts, header;
        if ( card.props.timestamp ) {
          ts = new Date( card.props.timestamp );
          if ( !lastTs || ( ts.getDate() !== lastTs.getDate() ) ) {
            header = (
              <ListHeader key={'card-list-header-' + i}>
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
    return cards.length ? (
        <div className={className}>{cards}{continuer}</div>
      ) : <div>{props.emptyMessage}</div>;
  }
} );