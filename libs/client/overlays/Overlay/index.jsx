import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import './styles.less';

import { Icon, Header } from 'wikipedia-react-components';
import ChromeHeader from './../../components/ChromeHeader';

// Main component

class Overlay extends Component {
	onClose( ev ) {
		if ( this.props.onExit ) {
			this.props.onExit( ev );
		} else {
			this.props.router.back();
		}
	}
	componentDidMount() {
		var node = ReactDOM.findDOMNode( this );
		setTimeout( function () {
			node.className += ' visible';
		}, 0 );
	}
	render() {
		var header, icon, secondaryIcons;
		var headerProps = {};
		var props = this.props;
		var baseClass = this.props.isDrawer ? 'drawer' : 'overlay visible';
		var overlayClass = baseClass +
      ( this.props.className ? ' ' + this.props.className : '' );
		var closeIconGray = <Icon glyph='close-gray'
			className="close" onClick={this.onClose.bind( this )}/>;

		if ( this.props.isDrawer ) {
			header = null;
		} else if ( this.props.isLightBox ) {
			header = (
				<div className="lightbox-header">
					{closeIconGray}
				</div> );
			overlayClass += ' lightbox';
		} else {
			icon = ( <Icon glyph='close' onClick={this.onClose.bind( this )} className="cancel" /> );
			secondaryIcons = props.secondaryIcon ? [ props.secondaryIcon ] : [];
			if ( !secondaryIcons && !props.primaryIcon && props.primaryIcon !== undefined ) {
				secondaryIcons = [ icon ];
			}
			headerProps = {
				fixed: true,
				primaryIcon: props.primaryIcon !== undefined ? props.primaryIcon : icon,
				router: props.router,
				siteoptions: props.siteoptions,
				siteinfo: props.siteinfo,
				search: props.search,
				includeSiteBranding: false,
				secondaryIcons: secondaryIcons,
				main: props.header
			};
			if ( props.chromeHeader ) {
				header = <ChromeHeader {...headerProps} />;
			} else {
				header = <Header {...headerProps} />;
			}
		}

		return (
			<div className={overlayClass}>
				{header}
				{this.props.children}
			</div>
		);
	}
}
Overlay.defaultProps = {
	isLightBox: false,
	isDrawer: false
};

export default Overlay;
