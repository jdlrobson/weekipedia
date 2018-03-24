import React from 'react';

import CardList from './../../../components/CardList';

import './styles.less';

class ReadMore extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {};
	}
	onEmpty() {
		this.setState( { isEmpty: true } );
	}
	render() {
		var props = this.props;
		var endpoint = props.api.getEndpoint( 'page/related/' +
			encodeURIComponent( props.title.replace( / /g, '_' ) ), true );

		if ( this.state.isEmpty ) {
			return (
				<div className="container-read-more empty"></div>
			);
		} else {
			return (
				<div className="container-read-more">
					<h2>Read more</h2>
					<CardList unordered="1" apiEndpoint={endpoint} api={this.props.api}
						onEmpty={this.onEmpty}
						infiniteScroll={false}
						onCardClick={props.onCardClick}
						store={props.store} />
				</div>
			);
		}
	}
}

export default ReadMore;
