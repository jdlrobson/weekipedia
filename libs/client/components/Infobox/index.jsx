import React, { Component } from 'react';

import './styles.less';

class Infobox extends Component {
	render() {
		return (
			<div className="infobox-container" dangerouslySetInnerHTML={{ __html: this.props.text }} />
		);
	}
}

export default Infobox;
