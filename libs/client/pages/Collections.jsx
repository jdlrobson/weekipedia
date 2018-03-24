import React from 'react';

import CardList from './../components/CardList';
import CollectionCard from './../components/CollectionCard';
import { ErrorBox, Button, IntermediateState, TruncatedText } from 'wikipedia-react-components';

import Article from './Article';

const COLLECTIONS_ARE_NOT_ORDERED = true;

// Pages
export default class Collections extends React.Component {
	constructor() {
		super();
		this.state = {
			defaultView: false,
			error: false,
			endpoint: null,
			description: null,
			title: null,
			username: null,
			id: null
		};
	}
	load( props ) {
		var self = this;
		var args = props.params ? props.params.split( '/' ) : [];
		var endpoint, username, id,
			api = props.api,
			endpointPrefix = api.getEndpoint( 'collection' );

		// reset
		this.setState( { description: null, title: null, error: false, id: null,
			defaultView: null, collections: null,
			endpoint: null, username: null } );
		if ( args.length === 3 ) {
			username = args[ 1 ];
			id = args[ 2 ];

			endpoint = endpointPrefix + '/by/' + username + '/' + id;
			this.setState( { endpoint: endpoint, username: username, id: id, defaultView: false } );
			props.api.fetch( endpoint ).then( function ( collection ) {
				self.setState( { title: collection.title, description: collection.description } );
			} ).catch( function () {
				self.setState( { error: true } );
			} );
		} else if ( args.length === 2 && args[ 1 ] ) {
			username = args[ 1 ];
			endpoint = '/api/' + props.lang + '/collection/by/' + username;
			this.setState( { endpoint: endpoint, username: username, id: id } );
			props.api.fetch( endpoint ).then( function ( state ) {
				self.setState( state );
			} ).catch( function () {
				self.setState( { error: true } );
			} );
			this.setState( { description: 'All collections by ' + username } );
		} else if ( args.length === 0 || !args[ 0 ] ) {
			this.setState( { defaultView: true, username: false, endpoint: endpointPrefix } );
		} else {
			throw new Error( 'Collections error state. What happened?' );
		}
	}
	componentWillMount() {
		this.load( this.props );
	}
	componentWillReceiveProps( props ) {
		this.load( props );
	}
	getBody() {
		var props = this.props;
		var store = props.store;
		var session = store.session;
		var collections = props.collections || this.state.collections;
		var id = props.id || this.state.id;
		var msg = session ? <p><a href={'#/edit-collection/' + session.username + '/'}>Create your own collection</a></p> :
			<p><a href="/wiki/Special:UserLogin">Sign in</a> to use collections.</p>;

		if ( id ) {
			return <CardList key="collection-list" {...this.props} unordered={COLLECTIONS_ARE_NOT_ORDERED}
				collection={id}
				apiEndpoint={this.state.endpoint} pages={props.pages} />;
		} else if ( collections ) {
			return <CardList key="collections-list"
				emptyMessage="There are no collections by this user." unordered={COLLECTIONS_ARE_NOT_ORDERED}
				{...this.props} pages={collections} CardClass={CollectionCard} />;
		} else if ( this.state.error ) {
			return <ErrorBox msg="Unable to show page." key="article-error" />;
		} else if ( this.state.defaultView ) {
			return (
				<div>
					<CardList key="collection-list" {...this.props} unordered={COLLECTIONS_ARE_NOT_ORDERED}
						CardClass={CollectionCard}
						emptyMessage="There are no collections."
						apiEndpoint={this.state.endpoint} />
					{msg}
				</div>
			);
		} else {
			return <IntermediateState />;
		}
	}
	render() {
		var tagline, actions, label, suffix, tabs,
			props = this.props,
			store = props.store,
			lang = this.props.lang,
			desc = this.state.description || props.description,
			username = this.state.username || props.owner,
			id = this.state.id || props.id,
			title = this.state.title || props.title,
			session = store.session;

		if ( username ) {
			if ( session && username === session.username ) {
				label = id ? 'Edit' : 'Create';
				suffix = id ? '/' + id : '/';
				actions = <Button label={label} href={'#/edit-collection/' + username + suffix } isPrimary={true}/>;
			}
			// The api request is cached at this point
			tagline = (
				<div>
					<div>by <a href={store.getLocalUrl( 'Special:Collections', 'by/' + username )}
						onClick={props.onClickInternalLink}>{username}</a></div>
					{desc}&nbsp;
					<div>{actions}</div>
				</div>
			);
		} else if ( session ) {
			username = session.username;
		}

		tabs = [
			<a key="collection-tab-1" href={store.getLocalUrl( 'Special:Collections' )}
				onClick={props.onClickInternalLink}
				className={!username ? 'active' : ''}>All</a>
		];
		if ( username ) {
			tabs.push(
				<a key="collection-tab-2" href={store.getLocalUrl( 'Special:Collections', 'by/' + username )}
					onClick={props.onClickInternalLink}
					className={!id ? 'active' : ''}>{username}</a>
			);

			if ( id ) {
				tabs.push(
					<span key="collection-tab-3"
						className={title ? 'active' : ''}><TruncatedText>{title}</TruncatedText></span>
				);
			}
		} else {
			tabs.push(
				<a key="collection-tab-2" href={store.getLocalUrl( 'Special:Collections', 'by/~anonymous' )}
					onClick={props.onClickInternalLink}
					className={username === '~anonymous' && !title ? 'active' : ''}>By you</a>
			);

			tagline = (
				<div>
					<div>by everyone</div>
					{props.msg( 'collections-all' )}
				</div>
			);
		}
		return (
			<Article {...this.props} isSpecialPage='yes'
				tabs={tabs}
				title={this.state.title || props.msg( 'menu-collections' )} tagline={tagline} body={this.getBody()}>
			</Article>
		);
	}
}
