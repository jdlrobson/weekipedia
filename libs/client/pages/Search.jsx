import React from 'react';
import createReactClass from 'create-react-class';

import CardListPage from './CardListPage';

// Pages
export default createReactClass( {
	navigateTo( ev ) {
		var link = ev.currentTarget;
		var href = link.getAttribute( 'href' );
		var title = link.getAttribute( 'title' );
		if ( href ) {
			ev.preventDefault();
			this.props.router.navigateTo( { pathname: href }, title );
		}
	},
	getTerm() {
		var props = this.props;
		return props.query.search ? props.query.search : props.params;
	},
	getTabs() {
		var proj = this.props.project;
		var store = this.props.store;
		var term = this.getTerm();
		var self = this;
		var prefix = '/' + this.props.lang + '.';
		return store.isFeatureEnabled( 'allowForeignProjects' ) ?
			store.projects.map( function ( project, i ) {
				return <a key={'search-tab' + i}
					onClick={self.navigateTo}
					className={proj === project ? 'active' : ''}
					title={'Search ' + project + ' for ' + term}
					href={prefix + project + '/Special:Search/' + term}>{project}</a>;
			} ) : [];
	},
	render() {
		var emptyProps = {
			msg: 'No pages matched your search query for this project. Why not try one of our other projects?'
		};
		var props = this.props;
		var store = props.store;
		var term = this.getTerm();
		var endpoint = '/api/search-full/' + props.language_project + '/' + encodeURIComponent( term );
		var suffix = store.isFeatureEnabled( 'allowForeignProjects' ) ?
			[ ' on ', <strong key="search-strong-project">{props.project}</strong> ] : '';
		var termUrl = '/' + props.language_project + '/' + term;
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
} );
