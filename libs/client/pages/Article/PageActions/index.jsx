import React, { Component } from 'react';

import LanguageIcon from './LanguageIcon';
import EditIcon from './../../../components/EditIcon';
import WatchIcon from './../../../components/WatchIcon';

import { HorizontalList, Icon } from 'wikipedia-react-components';
import './icons.less';

class PageActions extends Component {
	share() {
		window.navigator.share( {
			url: window.location.href
		} );
	}
	render() {
		var props = this.props;
		var actions = [
			<LanguageIcon key="article-page-action-language"
				store={props.store}
				disabled={props.disableLanguages} />
		];

		if ( props.canAuthenticate ) {
			actions.push( <EditIcon {...props} key="page-action-edit" section={0}/> );
			actions.push( <WatchIcon {...props} key="page-action-watch"/> );
		}
		// If available add the share icon
		if ( typeof window !== 'undefined' && window.navigator && window.navigator.share ) {
			actions.push( <Icon {...props} key="page-action-share" glyph='share'
				onClick={this.share} /> );
		}

		return (
			<HorizontalList className="page-actions" id={props.id}>
				{actions}
			</HorizontalList>
		);
	}
}
PageActions.defaultProps = {
	disableLanguages: true,
	canAuthenticate: false
};

export default PageActions;
