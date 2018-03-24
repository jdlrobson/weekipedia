import React from 'react';
import { observer, inject } from 'mobx-react';

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

		if ( this.state.isEmpty ) {
			return (
				<div className="container-read-more empty"></div>
			);
		} else {
			return (
				<div className="container-read-more">
					<h2>Read more</h2>
					<CardList unordered="1"
						onEmpty={this.onEmpty}
						infiniteScroll={false}
						apiEndpoint={props.apiEndpoint}
						onCardClick={props.onCardClick} />
				</div>
			);
		}
	}
}

export default inject( ( { api }, props ) => {
	const apiEndpoint = api.getEndpoint( 'page/related/' +
		encodeURIComponent( props.title.replace( / /g, '_' ) ), true );
	return {
		apiEndpoint
	};
} )(
	observer( ReadMore )
);
