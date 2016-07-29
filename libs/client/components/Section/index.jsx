import React, { Component } from 'react'

import SectionContent from './../SectionContent'

class Section extends Component {
  render(){
    var hLevel = this.props.toclevel + 1;
    var hMethod = React.DOM['h' + hLevel];
    var headingText = <span dangerouslySetInnerHTML={{ __html: this.props.line}} />
    var heading = hMethod.call(React.DOM, {}, headingText);
    return (
      <div>
        {heading}
        <SectionContent {...this.props} text={this.props.text}></SectionContent>
      </div>
    )
  }
}

export default Section
