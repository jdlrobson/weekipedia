import React from 'react'

import ErrorBox from './../components/ErrorBox';
import IntermediateState from './../components/IntermediateState';
import HorizontalList from './../components/HorizontalList'

import Article from './../containers/Article'
import Content from './../containers/Content'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      cards: null
    };
  },
  componentWillReceiveProps( props ) {
    this.loadCoords( props.params || '' );
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    this.loadCoords( this.props.params || '' );
  },
  loadCoords( params ) {
    var coords = params.split( ',' );
    if ( coords.length === 2 ) {
      this.setState( {
        latitude: parseFloat( coords[0] ),
        longitude: parseFloat( coords[1] )
      } )
    } else {
      this.requestCoords();
    }
  },
  requestCoords() {
    var self = this;
    navigator.geolocation.getCurrentPosition( function ( geo ) {
      self.setState( {
        latitude: parseFloat( geo.coords.latitude ),
        longitude: parseFloat( geo.coords.longitude )
      } );
    },
    function ( err ) {
      // see https://developer.mozilla.org/en-US/docs/Web/API/PositionError
      if ( err.code === 1 ) {
        err = 'permission';
      } else {
        err = 'locating';
      }
      self.setState( {
        error: err
      } );
    },
    {
    	timeout: 10000,
    	enableHighAccuracy: true
    } );
  },
  render(){
    var lat = this.state.latitude;
    var lng = this.state.longitude;
    var props = this.props;

    if ( this.state.error ) {
      return (<Content><ErrorBox msg="Something went wrong when trying to get your location."></ErrorBox></Content>)
    } else if ( lat !== undefined ) {
      var endpoint = '/api/nearby/' + props.lang
        + '/' + lat + ',' + lng;

      // Each degree of latitude is approximately 69 miles
      var north = lat + 1 / 69;
      var south = lat - 1 / 69;
      var east = lng + 1 / 69;
      var west = lng - 1 / 69;
      var baseUrl = '/' + props.lang + '/wiki/Special:Nearby/';

      var content = (
        <Content className="post-content">Explore 1 mile:
          <HorizontalList>
            <a href={baseUrl + lat + ',' + west}
              onClick={props.onClickInternalLink}>west</a>
            <a href={baseUrl + north + ',' + lng}
              onClick={props.onClickInternalLink}>north</a>
            <a href={baseUrl + lat + ',' + east}
              onClick={props.onClickInternalLink}>east</a>
            <a href={baseUrl + south + ',' + lng}
              onClick={props.onClickInternalLink}>south</a>
          </HorizontalList>
        </Content>
      );

      return (
        <CardListPage {...this.props} apiEndpoint={endpoint}
          title='Nearby' tagline="Pages that are near you">{content}</CardListPage>
      )
    } else {
      var body = <IntermediateState msg="Locating you to find pages nearby"/>;
      return (<Article isSpecialPage='1' {...this.props} body={body} />);
    }
  }
})

