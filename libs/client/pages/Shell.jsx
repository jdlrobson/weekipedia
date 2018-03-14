import React from 'react';

import WikiPage from './WikiPage';

import { IntermediateState } from 'wikipedia-react-components';

export default class Thing extends React.Component {
	render() {
		return (
			<WikiPage body={<IntermediateState />} />
		);
	}
}
