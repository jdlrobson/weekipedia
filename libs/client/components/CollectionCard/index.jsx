import React, { Component } from 'react';

import { Card, Icon } from 'wikipedia-react-components';

class CollectionCard extends Component {
	render() {
		var props = this.props;
		var owner = props.owner;
		var store = props.store;
		var base = 'Special:Collections';
		var userPage = 'by/' + props.owner + '/';
		var collectionPage = userPage + props.id;
		var extracts = [
			props.description
		];
		if ( owner ) {
			extracts.push( <Icon glyph="user" type="before" label={owner} className="mw-mf-user"
				href={store.getLocalUrl(base, userPage)} /> );
		}

		return <Card {...props} url={store.getLocalUrl(base, collectionPage)} extracts={extracts} />;
	}
}

export default CollectionCard;
