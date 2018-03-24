import React from 'react';

import CardListPage from './CardListPage';

// Pages
export default class Search extends React.Component {
	getTerm() {
		var props = this.props;
		return props.query.search ? props.query.search : props.params;
	}
	getTabs() {
		var props = this.props;
		var store = props.store;
		var proj = store.project;
		var term = this.getTerm();
		return store.isFeatureEnabled( 'allowForeignProjects' ) ?
			store.projects.map( function ( project, i ) {
				return <a key={'search-tab' + i}
					onClick={props.onClickLink}
					className={proj === project ? 'active' : ''}
					title={'Search ' + project + ' for ' + term}
					href={store.getLocalUrl('Special:Search/' + term)}>{project}</a>;
			} ) : [];
	}
	render() {
		var emptyProps = {
			msg: 'No pages matched your search query for this project. Why not try one of our other projects?'
		};
		var props = this.props;
		var api = props.api;
		var store = props.store;
		var term = this.getTerm();
		var endpoint = api.getEndpoint( 'search-full/' + encodeURIComponent( term ) );
		var suffix = store.isFeatureEnabled( 'allowForeignProjects' ) ?
			[ ' on ', <strong key="search-strong-project">{props.project}</strong> ] : '';
		var termUrl = store.getLocalUrl( term );
		var tagline = <p>Showing you all search results for <strong><a href={termUrl}>{decodeURIComponent( term )}</a></strong>{suffix}</p>;

		// mw-search-results class added for consistency with MediaWiki
		return (
			<CardListPage {...this.props} apiEndpoint={endpoint}
				className="mw-search-results"
				emptyProps={emptyProps}
				tabs={this.getTabs()}
				tagline={tagline}
				title='Search' />
		);
	}
}
