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
      latitude: null,
      longitude: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      cards: null
    };
  },
  // You want to load subscriptions not only when the component update but also when it gets mounted.
  componentWillMount(){
    if ( this.props.latitude ) {
      this.setState( {
        latitude: parseFloat( this.props.latitude ),
        longitude: parseFloat( this.props.longitude )
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

    if ( this.state.error ) {
      return (<Content><ErrorBox msg="Something went wrong when trying to get your location."></ErrorBox></Content>)
    } else if ( lat !== undefined ) {
      var endpoint = '/api/nearby/' + this.props.lang
        + '/' + lat + ',' + lng;

      // Each degree of latitude is approximately 69 miles
      var north = lat + 1 / 69;
      var south = lat - 1 / 69;
      var east = lng + 1 / 69;
      var west = lng - 1 / 69;
      var baseUrl = '/' + this.props.lang + '/wiki/Special:Nearby/';

      var content = (
        <Content className="post-content">Explore 1 mile:
          <HorizontalList>
            <a href={baseUrl + lat + ',' + west}>west</a>
            <a href={baseUrl + north + ',' + lng}>north</a>
            <a href={baseUrl + lat + ',' + east}>east</a>
            <a href={baseUrl + south + ',' + lng}>south</a>
          </HorizontalList>
        </Content>
      );

      return (
        <CardListPage {...this.props} apiEndpoint={endpoint}
          title='Nearby' tagline="Pages that are near you">{content}</CardListPage>
      )
    } else {
      var body = <IntermediateState msg="Locating you to find pages nearby"/>;
      return (<Article {...this.props} body={body} />);
    }
  }
})

