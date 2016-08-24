import React from 'react'

import './styles.less'

export default React.createClass({
  onChange( ev ) {
    this.setState( { month: ev.currentTarget.value })
  },
  getInitialState() {
    return {
      month: null
    }
  },
  onClick( ev ) {
    ev.preventDefault();
    this.props.router.navigateTo( '#/media/' +
      ev.currentTarget.getAttribute( 'href' ).replace( '/wiki/File:', '' ) );
  },
  componentWillMount() {
    var month = new Date().getMonth();
    this.setState( { month: month } );
  },
  render() {
    var options,
      climate = this.props.climate,
      curMonthNum = this.state.month,
      curMonth = climate[curMonthNum],
      degSuffix = curMonth.imperial ? '°F' : '°C',
      precSuffix = curMonth.imperial ? 'inches' : 'mm';

   options = climate.map( function ( data, i ) {
     return (
       <option value={i} key={"climate-option-" + i}>{data.heading}</option>
     );
   } );

    return (
      <div className="component-climate">
        <h2>Weather averages</h2>
        <div>
          <h3>
            <select defaultValue={curMonthNum} onChange={this.onChange}>{options}</select>
          </h3>
          <span className="high">{curMonth.high}<sup>{degSuffix}</sup></span>
          <span className="low">{curMonth.low}</span>
        </div>
        <div>Precipitation: { curMonth.precipitation} {precSuffix}</div>
      </div>
    );
  }
} );
