import React, { Component } from 'react';
import { Icon, SearchForm, Panel } from 'wikipedia-react-components';

import CardList from './../../components/CardList';

import Overlay from './../Overlay';

import './styles.less';

class SearchOverlay extends Component {
	constructor() {
		super();
		this.state = {
			term: '',
			list: null
		};
	}
	showResults( endpoint, project ) {
		var self = this;
		var props = this.props;
		var language_proj = this.props.lang + '.' + project;
		clearTimeout( this._timeout );
		// account for fast key presses before firing off an api request
		this._timeout = setTimeout( function () {
			props.api.fetch( endpoint ).then( function ( data ) {
				self.setState( {
					noResults: data.pages.length === 0,
					list: <CardList {...props} language_project={language_proj}
						apiEndpoint={endpoint} infiniteScroll={false} />
				} );
			} );
		}, 200 );
	}
	onSearchWithinPages() {
		this.onSearchSubmit( this.state.term );
	}
	onSearchSubmit( term ) {
		var props = this.props;
		props.onSearchSubmit( term );
	}
	onSearch( term ) {
		var endpoint, lowerTerm;
		var lang = this.props.lang;
		var project = this.props.siteinfo.defaultProject;
		this.setState( { term: term } );

		if ( term ) {
			lowerTerm = term.toLowerCase();
			if ( lowerTerm.indexOf( 'define:' ) === 0 ) {
				project = 'wiktionary';
				term = lowerTerm.split( ':' )[ 1 ];
			}
			endpoint = '/api/search/' + lang + '.' + project + '/' + encodeURIComponent( term );
			this.showResults( endpoint, project );
			if ( this.props.onSearch ) {
				this.props.onSearch( term );
			}
		}
	}
	render() {
		var heading, panel, msg;
		var props = this.props;
		var search = <SearchForm
			key="search-overlay-form"
			placeholder={props.msg( 'search' )}
			defaultValue={props.defaultValue}
			onSearch={this.onSearch.bind( this )}
			onSearchSubmit={props.onSearchSubmit}
			focusOnRender="1" />;

		if ( this.state.term ) {
			msg = this.state.noResults ?
				<span>No page with this title. <strong>Search within pages</strong> to see if this phrase appears anywhere.</span> :
				'Search within pages';
			panel = (
				<Panel key="search-overlay-content-panel">
					<Icon glyph="search-content"
						onClick={props.onSearchSubmit}
						type="before" label={msg} className="without-results" />
				</Panel>
			);
		}

		// FIXME: search-overlay class is added only for consistency with MobileFrontend
		return (
			<Overlay header={heading} search={search}
				siteinfo={props.siteinfo}
				onExit={props.onExit}
				primaryIcon={false}
				chromeHeader={true}
				className="component-search-overlay search-overlay">
				{panel}
				{this.state.list}
			</Overlay>
		);
	}
}

SearchOverlay.defaultProps = {
	emptyMessage: '',
	loadingMessage: 'Searching',
	api: null,
	lang: 'en'
};

export default SearchOverlay;
