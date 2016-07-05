import React, { Component } from 'react'

class Section extends Component {
  render(){
    var hLevel = this.props.toclevel + 1;
    var hMethod = React.DOM['h' + hLevel];
    var heading = hMethod.call(React.DOM, {},this.props.line);

    return (
      <div>
        {heading}
        <div dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
      </div>
    )
  }
}

export default Section
