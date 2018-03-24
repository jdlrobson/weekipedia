import React from 'react';
import { observer, inject } from 'mobx-react';

import CardListPage from './CardListPage';

class Search extends React.Component {
	render() {
		var emptyProps = {
			msg: 'No pages matched your search query for this project. Why not try one of our other projects?'
		};

		// mw-search-results class added for consistency with MediaWiki
		return (
			<CardListPage {...this.props}
				className="mw-search-results"
				emptyProps={emptyProps}
				title='Search' />
		);
	}
}

Search.defaultProps = {
	otherProjects: []
};

export default inject( ( { api, store }, props ) => {
	const term = props.query.search ? props.query.search : props.params;
	const proj = store.project;
	const enabled = store.isFeatureEnabled( 'allowForeignProjects' );

	let tabs = [];

	if ( enabled ) {
		tabs = store.projects.map( function ( project, i ) {
			return <a key={'search-tab' + i}
				onClick={props.onClickLink}
				className={proj === project ? 'active' : ''}
				title={'Search ' + project + ' for ' + term}
				href={store.getForeignUrl( 'Special:Search/' + term, store.lang, project )}>{project}</a>;
		} );
	}

	const apiEndpoint = api.getEndpoint( 'search-full/' + encodeURIComponent( term ) );
	const termUrl = store.getLocalUrl( term );
	const suffix = enabled ?
		[ ' on ', <strong key="search-strong-project">{props.project}</strong> ] : '';
	const tagline = <p>Showing you all search results for <strong>
		<a href={termUrl}>{decodeURIComponent( term )}</a></strong>{suffix}</p>;

	return {
		tagline,
		tabs,
		apiEndpoint
	};
} )(
	observer( Search )
);
