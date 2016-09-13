import React, { Component } from 'react'

import Icon from './../Icon'
import EditIcon from './../EditIcon'
import SectionContent from './../SectionContent'

import './styles.less'

class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpen: true
    };
  }
  componentWillMount(){
    this.setState( { jsEnabled: false } );
    if ( this.isReferenceSection() ) {
      this.setState( { isOpen: false } );
    }
    this.setState( { isOpen: this.props.siteinfo.expandSectionsByDefault } );
  }
  componentDidMount() {
    this.setState( { jsEnabled: true } );
  }
  isReferenceSection() {
    return this.props.text.indexOf( 'class="mw-references' ) > -1;
  }
  onToggle() {
    if ( this.props.isCollapsible ) {
      this.setState( { isOpen: !this.state.isOpen } );
    }
  }
  render(){
    var isCollapsible = this.props.isCollapsible;
    var hLevel = this.props.toclevel + 1;
    var hMethod = React.DOM['h' + hLevel];
    var headingChildren = [
      <span dangerouslySetInnerHTML={{ __html: this.props.line}} key={"section-heading-span-" + this.props.id} />
    ];
    if ( this.props.canAuthenticate && this.props.isEditable ) {
      headingChildren.push( <EditIcon {...this.props} section={this.props.id}
        key={"section-edit-icon-" + this.props.id} /> );
    }

    if ( isCollapsible ) {
      headingChildren.unshift( <Icon glyph={this.state.jsEnabled ? "arrow" : ""} small={true}
        className="indicator" key={"section-heading-toggle-" + this.props.id} /> );
    }
    var heading = hMethod.call(React.DOM, { onClick: this.onToggle.bind(this), id: this.props.anchor }, headingChildren );
    return (
      <div className={ this.state.isOpen || !isCollapsible ? 'section open-block' : 'section' }>
        {heading}
        <SectionContent {...this.props} text={this.props.text}></SectionContent>
        {this.props.subsections}
      </div>
    )
  }
}
Section.propTypes = {
  isEditable: React.PropTypes.bool,
  isCollapsible: React.PropTypes.bool
};
Section.defaultProps = {
  isEditable: true,
  isCollapsible: true,
  subsections: []
};

export default Section
