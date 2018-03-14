import React from 'react';

import CardListPage from './CardListPage';

// Pages
const MostRead = ( props ) => {
	return (
		<CardListPage {...props} apiEndpoint={'/api/visits/' + props.lang}
			title='Most read' tagline="Pages that others are reading" />
	);
};

export default MostRead;
