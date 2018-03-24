import React from 'react';
import { observer, inject } from 'mobx-react';

import { Icon, Button } from 'wikipedia-react-components';

import WikiPage from './../WikiPage';

const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

import './icons.less';
import './styles.less';

class UserPage extends React.Component {
	getTabs() {
		var props = this.props;

		return [
			<a href={props.userTalkUrl}
				onClick={props.onClickLink}
				key="page-talk-tab">Talk</a>,
			<a href={props.userCollectionUrl}
				onClick={props.onClickLink}
				key="page-collections-tab">{props.msg( 'menu-collections' )}</a>,
			<a href={props.userContributionsUrl}
				onClick={props.onClickLink}
				key="page-contrib-tab">Contributions</a>,
			<a href={props.userUploadsUrl}
				onClick={props.onClickLink}
				key="page-upload-tab">Uploads</a>
		];
	}
	render() {
		var registered,
			body = [],
			props = this.props,
			lead = props.lead || {},
			leadHtml = lead.sections && lead.sections.length ? lead.sections[ 0 ].text : undefined;

		var user = props.title;
		var editUrl = '#/editor/0';
		var isReaderOwner = props.isUserPageOwner;
		var msg = isReaderOwner ? 'You don\'t have a user page yet' : 'No user page for ' + props.user;
		var pText = isReaderOwner ? 'You can describe yourself to fellow editors on your user page' :
			'This page should be created and edited by ' + user;
		var btn = isReaderOwner ? <Button label="Create your own" href={editUrl} isPrimary="1" /> :
			<a href={editUrl} className="mw-ui-progressive ">Create a page called User:{user}</a>;

		if ( !leadHtml ) {
			body.push(
				<div className="component-user-page-cta" key="page-user-cta">
					<Icon glyph="user-page" large={true} />
					<h3>{msg}</h3>
					<p>{pText}</p>
					{btn}
				</div>
			);
		} else {
			body = props.body;
		}

		// workaround for T156830
		if ( lead.userinfo && lead.userinfo.missing === undefined ) {
			registered = new Date( lead.userinfo.registration );
			// FIXME: Translate
			lead.description = 'Member since ' + MONTHS[ registered.getMonth() ] + ', ' + registered.getFullYear();
		}

		return (
			<WikiPage {...props} body={body} tabs={this.getTabs()} />
		);
	}
}

export default inject( ( { store }, { titleSansPrefix } ) => (
	{
		userUploadsUrl: store.getLocalUrl( 'Special:Uploads', titleSansPrefix ),
		userContributionsUrl: store.getLocalUrl( 'Special:Contributions', titleSansPrefix ),
		userCollectionUrl: store.getLocalUrl( 'Special:Collections', 'by/' + titleSansPrefix ),
		userTalkUrl: store.getLocalUrl( 'User talk:' + titleSansPrefix ),
		isUserPageOwner: store.session && store.session.username === titleSansPrefix
	}
) )( observer( UserPage ) );
