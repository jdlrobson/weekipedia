import React from 'react';

import CardListPage from './CardListPage';

// Pages
const MostRead = ( props ) => {
	return (
		<CardListPage {...props} apiEndpoint={props.api.getEndpoint('visits')}
			title='Most read' tagline="Pages that others are reading" />
	);
};

export default MostRead;
