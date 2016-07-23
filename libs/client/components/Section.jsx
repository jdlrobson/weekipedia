import React, { Component } from 'react'

import SectionContent from './SectionContent'

class Section extends Component {
  render(){
    var hLevel = this.props.toclevel + 1;
    var hMethod = React.DOM['h' + hLevel];
    var heading = hMethod.call(React.DOM, {},this.props.line);

    return (
      <div>
        {heading}
        <SectionContent {...this.props} text={this.props.text}></SectionContent>
      </div>
    )
  }
}

export default Section
