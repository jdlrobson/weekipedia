import React, { Component } from 'react'
import PropTypes from 'prop-types'
import DOM from 'react-dom-factories';

import { Icon, ErrorBox, IntermediateState } from 'wikipedia-react-components'
import EditIcon from './../EditIcon'
import SectionContent from './../SectionContent'
import withInterAppLinks from './../../pages/withInterAppLinks'

import { getSections } from './../../react-helpers'

import './styles.less'

class Section extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false,
      isOpen: true,
      isLoading: false
    };
  }
  componentWillMount(){
    var isOpen,
      props = this.props;

    if ( props.isExpandedByDefault ) {
      isOpen = true;
    } else if ( !props.siteoptions.isExpandedByDefaultTablet ){
      isOpen = !props.isCollapsible ? !props.isCollapsible :
        ( props.siteoptions.expandSectionsByDefault && !props.isReferenceSection );
    }

    this.setState( {
      jsEnabled: false,
      isOpen: isOpen
    } );
  }
  componentDidUpdate() {
    var self = this;
    var props = this.props;
    var id = props.id;

    if ( this.state.isOpen && props.text === undefined && !this.state.isLoading ) {
      this.setState( { isLoading: true } );
      if ( props.isReferenceSection ) {
        props.api.getReferenceSections( props.title, props.language_project ).then( function ( json ) {
          var sectionComponents = getSections( json.references.sections, props );
          sectionComponents.forEach( function ( section ) {
            if ( section.props.id === id ) {
              self.setState( {
                text: section.props.text,
                subsections: section.props.subsections
              } )
            }
          } );
        } );
      } else {
        this.setState( { error: true } );
      }
    }
  }
  componentDidMount() {
    this.setState( { jsEnabled: true } );
    if ( this.props.siteoptions.expandSectionsByDefaultTablet && window.innerWidth > 768 ) {
      this.setState( {
        isOpen: true
      } );
    }
  }
  onToggle() {
    if ( this.props.isCollapsible ) {
      this.setState( { isOpen: !this.state.isOpen } );
    }
  }
  render(){
    var props = this.props;
    var SectionContentWithInterAppLinks = withInterAppLinks(
      SectionContent, props
    );
    var state = this.state;
    var isCollapsible = this.props.isCollapsible;
    var hLevel = this.props.toclevel + 1;
    var hMethod = DOM['h' + hLevel];
    var isExpanded = this.state.isOpen !== undefined ? this.state.isOpen : !isCollapsible;

    var headingChildren = [
      <span id={props.anchor}
        dangerouslySetInnerHTML={{ __html: this.props.line}} key={"section-heading-span-" + this.props.id} />
    ];
    if ( this.props.canAuthenticate && this.props.isEditable ) {
      headingChildren.push( <EditIcon {...this.props} section={this.props.id}
        key={"section-edit-icon-" + this.props.id} /> );
    }

    if ( isCollapsible ) {
      headingChildren.unshift( <Icon glyph={this.state.jsEnabled ? "arrow" : ""} small={true}
        className="indicator" key={"section-heading-toggle-" + this.props.id} /> );
    }
    var heading = hMethod.call(React.DOM, {
      className: 'section-heading',
      onClick: this.onToggle.bind(this)
     }, headingChildren );

    var body;
    var text = state.text !== undefined ? state.text : props.text;
    var subsections = state.subsections !== undefined ? state.subsections : props.subsections;

    if ( text === undefined ) {
      if ( this.state.error ) {
        body = <ErrorBox msg="An error occurred while trying to load this section." />;
      } else {
        body = <IntermediateState msg="Loading sub section" />;
      }
    } else {
      body = subsections;
    }

    return (
      <div className={ isExpanded ? 'section open-block' : 'section' }>
        {heading}
        <SectionContentWithInterAppLinks {...this.props}
          subsections={subsections} text={text}></SectionContentWithInterAppLinks>
        {body}
      </div>
    )
  }
}

Section.propTypes = {
  isEditable: PropTypes.bool,
  isCollapsible: PropTypes.bool
};

Section.defaultProps = {
  isEditable: true,
  isCollapsible: true,
  subsections: []
};

export default Section
