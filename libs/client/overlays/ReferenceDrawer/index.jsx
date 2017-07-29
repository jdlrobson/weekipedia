import React from 'react'
import createReactClass from 'create-react-class'
import ReactDOM from 'react-dom'

import { ErrorBox, Icon, IntermediateState } from 'wikipedia-react-components'

import Overlay from './../Overlay'

import './styles.less'
import './icons.less'

export default createReactClass({
  getInitialState() {
    return {
      isLoading: true,
      isError: false,
      text: null
    }
  },
  loadReference( refId ) {
    var self = this;
    this.props.api.getReference( this.props.title, this.props.language_project, refId )
      .then( function ( refHtml ) {
        self.setState( { text: refHtml, isLoading: false } );
        if ( self.props.hijackLinks ) {
          self.props.hijackLinks( ReactDOM.findDOMNode( self ) );
        }
      } ).catch( function () {
        self.setState( { isError: true } );
      } );
  },
  componentDidMount() {
    this.loadReference( this.props.refId );
  },
  componentWillReceiveProps( nextProps ) {
    this.loadReference( nextProps.refId );
  },
  render(){
    var children;

    if ( this.state.isError ) {
      children = [
        <ErrorBox key="ref-drawer-error" msg="Error loading reference." />
      ]
    } else if ( this.state.isLoading ) {
      children = [
        <IntermediateState key="ref-drawer-1"></IntermediateState>
      ]
    } else {
      children = [
        <span key="ref-drawer-2" className="reference-text"
          dangerouslySetInnerHTML={{ __html: this.state.text }}></span>
      ];
    }
    // FIXME: references class name should not be necessary and is only added for consistency
    // with MobileFrontend output
    return (
      <Overlay {...this.props} className="references-drawer references" isDrawer="1">
        <div className="cite">
          <Icon type="before" glyph="citation" label="Citation" className="text"/>
        </div>
        {children}
      </Overlay>
    )
  }
} )

