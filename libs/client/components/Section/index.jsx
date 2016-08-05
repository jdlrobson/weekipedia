import React, { Component } from 'react'

import Icon from './../Icon'
import SectionContent from './../SectionContent'

import './styles.css'

class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true
    };
  }
  onToggle() {
    if ( this.props.isCollapsible ) {
      this.setState( { isOpen: !this.state.isOpen } );
    }
  }
  render(){
    var hLevel = this.props.toclevel + 1;
    var hMethod = React.DOM['h' + hLevel];
    var headingChildren = [ <span dangerouslySetInnerHTML={{ __html: this.props.line}} /> ];

    if ( this.props.isCollapsible ) {
      headingChildren.unshift( <Icon glyph="arrow" className="indicator" /> );
    }
    var heading = hMethod.call(React.DOM, { onClick: this.onToggle.bind(this) }, headingChildren );
    return (
      <div className={ this.state.isOpen ? 'section open-block' : 'section' }>
        {heading}
        <SectionContent {...this.props} text={this.props.text}></SectionContent>
        {this.props.subsections}
      </div>
    )
  }
}
Section.propTypes = {
  isCollapsible: React.PropTypes.bool
};
Section.defaultProps = {
  isCollapsible: true,
  subsections: []
};

export default Section
