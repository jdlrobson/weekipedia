import React, { Component } from 'react';

import { Icon, Header, Overlay } from 'wikipedia-react-components';

import './styles.less';

// Main component

class WOverlay extends Component {
	render() {
		var headerProps, header;
		var props = this.props;
		var headerChildren = [];
		var closeIcon = <Icon glyph='close'
			className="close" onClick={props.onExit}/>;

		if ( !props.isDrawer && !props.isLightBox ) {
			headerProps = {
				fixed: true,
				primaryIcon: props.primaryIcon,
				secondaryIcons: props.secondaryIcon ? [ props.secondaryIcon ] : [],
				className: props.chromeHeader ? 'chrome-header' : ''
			};
			if ( props.chromeHeader ) {
				headerProps.secondaryIcons = [ closeIcon ];
				headerChildren.push( props.search );
			}
			headerChildren.push( props.header );
			header = (
				<Header {...headerProps} key="overlay-header">
					{headerChildren}
				</Header>
			);
		}

		return (
			<Overlay className={props.className}
				onExit={props.onExit} isLightBox={props.isLightBox}>
				{header}
				{this.props.children}
			</Overlay>
		);
	}
}

WOverlay.defaultProps = {
	isLightbox: false,
	isDrawer: false
};

export default WOverlay;
