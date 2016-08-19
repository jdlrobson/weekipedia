import React from 'react'

import ListHeader from './../../components/ListHeader'

import './styles.less'

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

export default React.createClass({
  getDefaultProps: function () {
    return {
      isDiffCardList: false,
      endpoint: null,
      continue: null,
      emptyMessage: 'The list is disappointedly empty.'
    };
  },
  getInitialState() {
    return {
      isPending: false,
      cards: [],
      continue: null
    };
  },
  componentWillMount(){
    this.setState( { continue: this.props.continue, cards: this.props.cards } );
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
      url = this.props.endpoint + '?' + param( continuer );
      this.setState( { isPending: true } );
      this.props.api.fetchCardListProps( url, this.props, this.props.CardClass ).then( function ( props ) {
        // this wont work again without the continue
        self.setState( { continue: props.continue, isPending: false,
          cards: self.state.cards.concat( props.cards ) } );
      } );
    }
  },
  componentDidMount() {
    var self = this;
    // setup infinite scroll
    document.addEventListener( 'scroll', function () {
      if ( document.body.scrollHeight === document.body.scrollTop + window.innerHeight ) {
        self.loadMore();
      }
    } );
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
    return props.cards.length ? (
        <div className={className}>{cards}{continuer}</div>
      ) : <div>{props.emptyMessage}</div>;
  }
} );