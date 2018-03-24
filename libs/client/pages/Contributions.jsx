import React from 'react';
import { observer, inject } from 'mobx-react';

import CardListPage from './CardListPage';

import { Icon, CardDiff } from 'wikipedia-react-components';

class Contributions extends React.Component {
	render() {
		var title, lead, tagline,
			props = this.props,
			username = this.props.params;

		if ( username ) {
			title = 'User Contributions';
			tagline = (
				<h2>
					<Icon glyph='user'
						href={props.userUrl}
						type="before"
						onClick={this.props.onClickInternalLink} label={username} />
				</h2>
			);
		} else {
			title = 'Recent Changes';
			lead = {
				paragraph: 'This is a list of recent changes to Wikipedia'
			};
		}

		return (
			<CardListPage {...this.props} isDiffCardList={true}
				title={title} tagline={tagline} CardClass={CardDiff} lead={lead} />
		);
	}
}

export default inject( ( { api, store, onClickInternalLink }, props ) => {
	const username = props.params;
	let path = 'contributions/0/';
	if ( username ) {
		path += username;
	}
	return {
		onClickInternalLink,
		apiEndpoint: api.getEndpoint( path ),
		userUrl: store.getLocalUrl( 'User:' + username )
	};
} )(
	observer( Contributions )
);
