import React from 'react';
import { observer, inject } from 'mobx-react';
import CardListPage from './CardListPage';

const MostRead = ( props ) => {
	return (
		<CardListPage {...props}
			title='Most read' tagline="Pages that others are reading" />
	);
};

export default inject( ( { api } ) => {
	return {
		apiEndpoint: api.getEndpoint( 'visits' )
	};
} )(
	observer( MostRead )
);
