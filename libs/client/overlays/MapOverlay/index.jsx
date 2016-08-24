import React from 'react'

import Map from './../../components/Map'

import Overlay from './../Overlay'

import './styles.less'

export default React.createClass({
  render(){
    return (
      <Overlay {...this.props} className="map-overlay" isLightBox="1">
        <Map {...this.props}/>
      </Overlay>
    );
  }
} )

