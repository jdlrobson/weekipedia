import React, { Component } from 'react';
import { Button, Panel } from 'wikipedia-react-components';

import './styles.less';

class EmptyCardList extends Component {
	render() {
		var img, cta,
			props = this.props,
			store = props.store,
			path = props.image;

		if ( path ) {
			path = store.isRTL ? path.replace( 'ltr', 'rtl' ) : path;
			img = <img src={path} />;
		}
		if ( props.ctaMessage ) {
			cta = <Button label={props.ctaMessage} href={props.ctaLink} />;
		}

		return (
			<Panel className="info empty-page">
				<p>{props.msg}</p>
				{img}
				{cta}
			</Panel>
		);
	}
}

EmptyCardList.defaultProps = {
	image: '/images/sadsad.svg',
	ctaLink: '/',
	ctaMessage: false
};

export default EmptyCardList;
