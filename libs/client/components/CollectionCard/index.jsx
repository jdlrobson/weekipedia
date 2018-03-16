import React, { Component } from 'react';

import { Card, Icon } from 'wikipedia-react-components';

class CollectionCard extends Component {
	render() {
		var props = this.props;
		var owner = props.owner;
		var base = '/' + props.language_project + '/Special:Collections/by/' + props.owner + '/';
		var url = base + props.id;
		var extracts = [
			props.description
		];
		if ( owner ) {
			extracts.push( <Icon glyph="user" type="before" label={owner} className="mw-mf-user"
				href={base} /> );
		}

		return <Card {...props} url={url} extracts={extracts} />;
	}
}

export default CollectionCard;
