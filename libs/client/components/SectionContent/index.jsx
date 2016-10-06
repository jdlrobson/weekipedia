import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import './styles.less'

class SectionContent extends Component {
  componentDidMount(){
    if ( this.props.text ) {
      this.props.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  componentDidUpdate(){
    if ( this.props.text && this.state.contentChanged ) {
      this.props.hijackLinks( ReactDOM.findDOMNode( this ) );
    }
  }
  componentWillReceiveProps( nextProps ) {
    this.setState( { contentChanged: nextProps.text !== this.props.text } );
  }
  render(){
    var divId;
    var id = this.props.id;
    if ( id ) {
      // For consistency with MobileFrontend the id uses the section number - the lead section
      divId = 'content-collapsible-block-' + ( id - 1 );
    }
    var classSuffix = this.props.className ? ' ' + this.props.className : '';
    if ( this.props.id ) {
      classSuffix += ' section-' + id;
    }
    return (
      <div data-section={id}
        id={divId}
        className={"component-section-content content" + classSuffix}
        dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
    )
  }
}

export default SectionContent
