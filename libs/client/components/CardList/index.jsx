import React from 'react';
import { ErrorBox, IntermediateState, ListHeader,
	CardWithLocation, CardList, Content } from 'wikipedia-react-components';

import WatchIcon from './../WatchIcon';

import './styles.less';

const OFFLINE_ERROR = 'You do not have an internet connection';
const MONTHS = [ 'January', 'February', 'March', 'April', 'May', 'June',
	'July', 'August', 'September', 'October', 'November', 'December' ];

function getCards( data, props, keyPrefix ) {
	var cards = [],
		store = props.store,
		CardClass = props.CardClass;

	if ( data.collections ) {
		data.pages = data.collections;
	}

	if ( data.pages && data.pages.length ) {
		data.pages.forEach( function ( item, i ) {
			var id = item.revid || item.pageid || item.id;
			item.key = keyPrefix + 'card-' + i + '-' + id;
			item.onClick = function ( ev ) {
				var node = ev.currentTarget;
				var link = node.tagName === 'A' ? node : node.querySelector( 'a' );
				var href = link.getAttribute( 'href' );
				var title = link.getAttribute( 'title' );
				if ( href ) {
					props.onCardClick( ev, { pathname: href }, title );
				}
			};
			if ( item.revid ) {
				item.url = store.getLocalUrl( 'Special:MobileDiff', item.revid );
			} else if ( !item.url && item.title ) {
				item.url = store.getLocalUrl( item.title );
			}
			// some endpoints e.g. related endpoint return titles with `_`
			if ( item.title ) {
				item.title = item.title.replace( /_/g, ' ' );
			}

			var session = props.store.session;
			if ( session && props.collection && data.owner === session.username && !props.unordered ) {
				item.indicator = <WatchIcon {...props}
					key={item.key + '-watch'}
					title={item.title} collection={props.collection} isWatched={true} />;
			}
			cards.push( React.createElement( CardClass, Object.assign( {}, props, item ) ) );
		} );
	}
	return cards;
}

class WeekipediaCardList extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			errorMsg: 'Something went wrong when trying to render the list. Please refresh and try again.',
			error: null,
			isPending: false,
			cards: null,
			'continue': null
		};
	}
	loadCards( props ) {
		if ( props.apiEndpoint ) {
			this.load( props.apiEndpoint );
		}
	}
	componentWillReceiveProps( props ) {
		this.loadCards( props );
	}
	load( apiEndpoint ) {
		var self = this;
		var api = this.props.api;
		var props = this.props;
		var onEmpty = props.onEmpty;
		var cardListProps = {
			lang: props.lang,
			msg: props.msg,
			collection: props.collection,
			unordered: props.unordered,
			store: props.store,
			CardClass: props.CardClass,
			onCardClick: props.onCardClick,
			isDiffCardList: props.isDiffCardList,
			emptyMessage: props.emptyMessage,
			api: api
		};
		this.fetchCardListProps( apiEndpoint, cardListProps ).then( function ( state ) {
			self.setState( state );
			if ( state.cards.length === 0 && props.onEmpty ) {
				onEmpty();
			}
		} ).catch( function ( error ) {
			if ( error.message.indexOf( 'Failed to fetch' ) > -1 ) {
				self.setState( { errorMsg: OFFLINE_ERROR } );
			}
			self.setState( { error: true } );
		} );
	}
	fetchCardListProps( url, props ) {
		return this.props.api.fetch( url ).then( function ( data ) {
			return {
				owner: data.owner,
				'continue': data.continue,
				cards: getCards( data, props, url + '-' )
			};
		} );
	}
	loadMore() {
		var url,
			continuer = this.state.continue,
			self = this;

		if ( !this.state.isPending && this.props.api && continuer ) {
			url = this.props.apiEndpoint + '?' + this.props.api.param( continuer );
			this.setState( { isPending: true } );
			this.fetchCardListProps( url, this.props ).then( function ( props ) {
				// this wont work again without the continue
				self.setState( { 'continue': props.continue, isPending: false,
					owner: props.owner,
					cards: self.state.cards.concat( props.cards ) } );
			} );
		}
	}
	onScroll() {
		var self = this;
		if ( document.body.scrollHeight >= ( document.body.scrollTop + window.innerHeight ) / 2 ) {
			self.loadMore();
		}
	}
	componentWillUnmount() {
		document.removeEventListener( 'scroll', this.onScroll.bind( this ) );
	}
	componentDidMount() {
		this.loadCards( this.props );
		// setup infinite scroll
		if ( this.props.infiniteScroll ) {
			document.addEventListener( 'scroll', this.onScroll.bind( this ) );
		}
	}
	render() {
		var lastTs;
		var props = this.props;
		var isDiffCardList = this.props.isDiffCardList;
		var isUnordered = props.unordered && !isDiffCardList;
		var cards = this.state.cards;
		var owner = this.state.owner || props.owner;
		if ( props.pages && !cards ) {
			cards = getCards( { pages: props.pages, owner: owner }, props );
		}
		if ( props.limit && cards ) {
			cards = cards.slice( 0, props.limit );
		}
		var cardsAndHeaders = [];
		var continuer = props.continue && props.endpoint ?
			<div className='gutter' /> : null;

		if ( this.state.error ) {
			cards = [
				<Content key="card-list-error">
					<ErrorBox msg={this.state.errorMsg}/>
				</Content>
			];
		} else if ( !cards ) {
			cards = [ <IntermediateState msg={this.props.loadingMessage} key="card-list-loading" /> ];
		} else if ( isDiffCardList ) {
			cards.forEach( function ( card, i ) {
				var ts, header;
				if ( card.props.timestamp ) {
					ts = new Date( card.props.timestamp );
					if ( !lastTs || ( ts.getDate() !== lastTs.getDate() ) ) {
						header = (
							<ListHeader key={'card-list-header-' + i}>
								{ts.getDate()} {MONTHS[ ts.getMonth() ]} {ts.getFullYear()}
							</ListHeader>
						);
						cardsAndHeaders.push( header );
					}
					lastTs = ts;
				}
				cardsAndHeaders.push( card );
			} );
			cards = cardsAndHeaders;
		}
		if ( continuer ) {
			cards.push( continuer );
		}
		return <CardList emptyMessage={props.emptyMessage}
			ordered={!isUnordered}
			className={ isDiffCardList ? ' diff-list side-list' : ''}>{cards}</CardList>;
	}
}

WeekipediaCardList.defaultProps = {
	CardClass: CardWithLocation,
	infiniteScroll: true,
	isDiffCardList: false,
	endpoint: null,
	'continue': null,
	emptyMessage: 'The list is disappointedly empty.'
};

export default WeekipediaCardList;
