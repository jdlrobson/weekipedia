import React from 'react';

import { ErrorBox, Icon, IntermediateState, Overlay } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

class ReferenceDrawer extends React.Component {
	constructor() {
		super();
		this.state = {
			isLoading: true,
			isError: false,
			text: null
		};
	}
	loadReference( refId ) {
		var self = this;
		this.props.api.getReference( this.props.title, refId )
			.then( function ( refHtml ) {
				self.setState( { text: refHtml, isLoading: false } );
			} ).catch( function () {
				self.setState( { isError: true } );
			} );
	}
	componentDidMount() {
		this.loadReference( this.props.refId );
	}
	componentWillReceiveProps( nextProps ) {
		this.loadReference( nextProps.refId );
	}
	render() {
		var children = [
			<div className="cite">
				<Icon type="before" glyph="citation" label="Citation" className="text"/>
			</div>
		];

		if ( this.state.isError ) {
			children = [
				<ErrorBox key="ref-drawer-error" msg="Error loading reference." />
			];
		} else if ( this.state.isLoading ) {
			children = [
				<IntermediateState key="ref-drawer-1"></IntermediateState>
			];
		} else {
			children = [
				<span key="ref-drawer-2" className="reference-text"
					dangerouslySetInnerHTML={{ __html: this.state.text }}></span>
			];
		}
		// FIXME: references class name should not be necessary and is only added for consistency
		// with MobileFrontend output
		return (
			<Overlay className="references-drawer references">
				{children}
			</Overlay>
		);
	}
}

export default ReferenceDrawer;
