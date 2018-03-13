import React, { Component } from 'react';

import { Icon } from 'wikipedia-react-components';

class LanguageIcon extends Component {
	render() {
		var props = this.props;
		var iconProps = {
			key: 'lang-view',
			glyph: 'language-switcher',
			// This is only needed for compatibility with MobileFrontend browser tests
			className: 'language-selector',
			label: 'Read in another language'
		};

		if ( props.disabled ) {
			iconProps.className += ' disabled';
			iconProps.onClick = function ( ev ) {
				ev.stopPropagation();
				props.store.setUserNotification( 'This page is not available in other languages.' );
			};
		} else {
			iconProps.href = '#/languages';
		}

		return (
			<Icon {...iconProps} />
		);
	}
}

export default LanguageIcon;
