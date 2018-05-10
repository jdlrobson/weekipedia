import React from 'react';
import timeago from 'timeago';
import { observer, inject } from 'mobx-react';
import { HorizontalList, Icon, IntermediateState, Content } from 'wikipedia-react-components';

import Article from './../Article';

import './styles.less';

const IGNORED_GROUPS = [ 'user', 'autoconfirmed', '*' ];

class MobileDiff extends React.Component {
	constructor() {
		super();
		this.state = {
			diff: null
		};
	}
	componentDidMount() {
		this.load( this.props.params );
	}
	componentWillReceiveProps( nextProps ) {
		this.load( nextProps.params );
	}
	load() {
		var self = this;
		var props = this.props;
		props.api.fetch( props.apiEndpoint ).then( function ( diff ) {
			self.setState( { diff: diff } );
			window.scrollTo( 0, 0 );
		} );
	}
	render() {
		var body, title, footer, link,
			userGroups, editorTagline,
			groups = [],
			links = [],
			props = this.props,
			store = props.store,
			diff = this.state.diff;

		if ( diff ) {
			title = diff.title;
			links = [
				<a href={store.getLocalUrl( 'Special:MobileDiff', diff.parent )}
					key="mobile-diff-prev-link"
					onClick={props.onClickInternalLink}>← Previous edit</a>
			];
			body = (
				<Content key="special-page-row-1" className="content">
					<div className="diff-header">
						<h2>
							<a href={store.getLocalUrl( title )}
								onClick={props.onClickInternalLink}>{title}</a>
						</h2>
						<div>edited {timeago( new Date( diff.timestamp ) )}</div>
					</div>
					<p className="diff-comment">{diff.comment}</p>
					<div className="diff-body" dangerouslySetInnerHTML={{ __html: diff.body }} />
					<HorizontalList className="diff-links">{links}</HorizontalList>
				</Content>
			);

			// anon edits do not have groups
			userGroups = diff.user.groups || [];
			userGroups.forEach( function ( group ) {
				if ( IGNORED_GROUPS.indexOf( group ) === -1 ) {
					groups.push( group );
				} else {
					return false;
				}
			} );

			if ( diff.anon ) {
				link = <span>Anonymous user</span>;
				editorTagline = <a href={store.getLocalUrl( 'Special:Contributions/' + diff.user.name )}>{diff.user.name}</a>;
			} else {
				link = <a href={store.getLocalUrl( 'User:' + diff.user.name )}
					onClick={props.onClickInternalLink}>{diff.user.name}</a>;
				editorTagline = <div className="edit-count"><div>{diff.user.editcount}</div> edits</div>;
			}

			footer = (
				<Content className="user-footer">
					<Icon type="before" glyph={diff.anon ? 'anonymous' : 'user'} label={link} />
					<HorizontalList className="user-roles">{groups}</HorizontalList>
					{editorTagline}
				</Content>
			);
		} else {
			body = <IntermediateState />;
		}

		return (
			<Article {...this.props} title="Changes"
				footer={footer}
				isSpecialPage='yes' body={body} />
		);
	}
}

export default inject( ( { api, store, onClickInternalLink }, { params } ) => {
	return {
		api,
		onClickInternalLink,
		apiEndpoint: api.getEndpoint( 'diff/' + params ),
		store
	};
} )(
	observer( MobileDiff )
);
