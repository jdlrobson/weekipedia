import React from 'react';
import { observer, inject } from 'mobx-react';
import { IntermediateState, LinkList, Panel, SearchInput, Content } from 'wikipedia-react-components';

import Overlay from './../Overlay';

import './styles.less';

class LanguageOverlay extends React.Component {
	constructor() {
		super();
		this.state = {
			term: null,
			isLoading: true,
			preferred: {},
			languages: []
		};
	}
	componentWillMount() {
		var prefs = this.props.storage.get( 'languages-preferred' );
		if ( prefs ) {
			this.setState( { preferred: JSON.parse( prefs ) } );
		}
	}
	componentDidMount() {
		this.props.getAsyncState().then( ( state ) => this.setState( state ) );
	}
	navigateTo( ev ) {
		var link = ev.currentTarget;
		var href = link.getAttribute( 'href' ) || '';
		var pref = this.state.preferred;
		var code = link.getAttribute( 'lang' );
		if ( code && pref[ code ] ) {
			pref[ code ] += 1;
		} else if ( code ) {
			pref[ code ] = 1;
		}

		if ( this.props.onChooseLanguage ) {
			this.props.onChooseLanguage( ev, code, href );
		}
		this.props.storage.set( 'languages-preferred', JSON.stringify( pref ) );
		this.setState( { preferred: pref } );
	}
	filterLanguages( value ) {
		this.setState( { term: value } );
	}
	getLanguagesForDisplay( preferredOnly ) {
		var langs = [];
		var term = this.state.term || '';
		var prefs = this.state.preferred;
		// filter
		this.state.languages.forEach( function ( lang ) {
			if (
				Boolean( prefs[ lang.lang ] ) === Boolean( preferredOnly ) && (
					( lang.langname && lang.langname.indexOf( term ) > -1 ) ||
					( lang.autonym && lang.autonym.indexOf( term ) > -1 )
				)
			) {
				langs.push( lang );
			}
		} );

		var sortFn = function ( a, b ) {
			return a.autonym < b.autonym ? -1 : 1;
		};
		if ( preferredOnly ) {
			sortFn = function ( a, b ) {
				return prefs[ a.lang ] > prefs[ b.lang ] ? -1 : 1;
			};
		}
		// search
		return langs.sort( sortFn );
	}
	render() {
		var self = this;
		var state = this.state;
		var props = this.props;
		var content, prefLang, preferredLangs, otherLangs;

		function mapLanguage( language ) {
			var code = language.lang;
			return (
				<a href={props.getLanguageUrl( language.title.replace( /\//gi, '%2F' ), code )}
					key={'lang-item-' + code}
					onClick={self.navigateTo.bind( self )}
					hrefLang={code} lang={code}>
					<strong className="autonym">{language.autonym}</strong>
					<span className="title">{language.title}</span>
				</a>
			);
		}

		if ( state.isLoading ) {
			content = <IntermediateState msg="Loading languages" />;
		} else {
			preferredLangs = this.getLanguagesForDisplay( true );
			otherLangs = this.getLanguagesForDisplay();

			prefLang = preferredLangs.length ? <LinkList>{preferredLangs.map( mapLanguage )}</LinkList> : null;
			content = <LinkList className="all-languages">{otherLangs.map( mapLanguage )}</LinkList>;
		}

		var count = this.state.isLoading ? null : otherLangs.length;
		var prefHeader = preferredLangs && preferredLangs.length ?
			<h3 className="list-header">Preferred languages <span>{preferredLangs ? preferredLangs.length : ''}</span></h3> : null;
		var listHeader = this.state.term ? null : <h3 className="list-header">All languages <span>{count}</span></h3>;

		return (
			<Overlay className="language-overlay" onExit={props.onExit}
				header={<h2><strong>Languages</strong></h2>}>
				<Panel>
					<Content>
						<SearchInput value={this.state.term}
							onSearch={this.filterLanguages.bind( this )} placeholder="Search for a language" />
					</Content>
				</Panel>
				<Content>
					{prefHeader}
					{prefLang}
					{listHeader}
					{content}
				</Content>
			</Overlay>
		);
	}
}

LanguageOverlay.defaultProps = {
	storage: null,
	lang: 'en'
};

export default inject( ( { api, store }, { title } ) => {
	return {
		getLanguageUrl: function ( title, langCode ) {
			return store.getForeignUrl( title, langCode );
		},
		getAsyncState: function () {
			return api.fetch( api.getEndpoint( 'page-languages/' + title ) ).then( function ( languages ) {
				return { isLoading: false, languages };
			} );
		}
	};
} )(
	observer( LanguageOverlay )
);
