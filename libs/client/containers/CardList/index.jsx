import React from 'react'

import './styles.less'

export default React.createClass({
  getDefaultProps: function () {
    return {
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
      this.props.api.fetchCardListProps( url, this.props ).then( function ( props ) {
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
    var props = this.props;
    var cards = this.state.cards;
    var continuer = props.continue && props.endpoint ?
      <div className='gutter' /> : null;
    return props.cards.length ? (
        <div className={"card-list" + ( props.unordered ? ' card-list-unordered' : '' ) }>{cards}{continuer}</div>
      ) : <div>{props.emptyMessage}</div>;
  }
} );