import React from 'react';

import { CardWithLocation } from 'wikipedia-react-components';

import EmptyList from './EmptyList';

import CardList from './../../components/CardList';

import Article from './../Article';

import './styles.less';

// Pages
class CardListPage extends React.Component {
	onEmpty() {
		this.setState( { isEmpty: true } );
	}
	constructor() {
		super();
		this.state = {
			isEmpty: false
		};
	}
	componentWillReceiveProps() {
		this.setState( { isEmpty: false } );
	}
	render() {
		var props = this.props;
		// api endpoint may change...
		var key = 'card-list-page-card-list-' + props.apiEndpoint;
		var body = [];
		if ( props.preamble ) {
			body.push( props.preamble );
		}
		body.push( <CardList key={key} {...props}
			title={undefined}
			onCardClick={props.onCardClick}
			onEmpty={this.onEmpty}/> );
		body = body.concat( props.children );

		if ( this.state.isEmpty ) {
			body = <EmptyList {...props} {...props.emptyProps} />;
		}
		return (
			<Article {...this.props} isSpecialPage="1" body={body} />
		);
	}
}

CardListPage.defaultProps = {
	CardClass: CardWithLocation,
	api: null,
	apiEndpoint: null,
	title: null,
	tagline: null,
	lang: 'en'
};

export default CardListPage;
