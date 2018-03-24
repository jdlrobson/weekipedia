import React from 'react';

import CardListPage from './CardListPage';

import { Icon, CardDiff } from 'wikipedia-react-components';

// Pages
export default class Contributions extends React.Component {
	render() {
		var title, lead, tagline,
			api = this.props.api,
			store = this.props.store,
			path = 'contributions/0/',
			username = this.props.params;

		if ( username ) {
			title = 'User Contributions';
			tagline = (
				<h2>
					<Icon glyph='user'
						href={store.getLocalUrl('User:' + username)}
						type="before"
						onClick={this.props.onClickInternalLink} label={username} />
				</h2>
			);
			path += username;
		} else {
			title = 'Recent Changes';
			lead = {
				paragraph: 'This is a list of recent changes to Wikipedia'
			};
		}

		return (
			<CardListPage {...this.props} apiEndpoint={api.getEndpoint(path)} isDiffCardList={true}
				title={title} tagline={tagline} CardClass={CardDiff} lead={lead} />
		);
	}
}
