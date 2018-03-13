import fs from 'fs';
import { EN_MESSAGE_PATH, SITE_TITLE } from './config';

function getMessages( language ) {
	var i, messages, jsonPath, enMessages,
		qqx = language === 'qqx';

	if ( qqx ) {
		jsonPath = EN_MESSAGE_PATH;
	} else {
		jsonPath = './i18n/' + language + '.json';
	}

	try {
		messages = JSON.parse( fs.readFileSync( jsonPath, 'utf8' ) );
	} catch ( e ) {
		messages = {};
	}

	enMessages = JSON.parse( fs.readFileSync( EN_MESSAGE_PATH, 'utf8' ) );
	messages = Object.assign( {}, enMessages, messages );

	for ( i in messages ) {
		if ( messages.hasOwnProperty( i ) ) {
			if ( qqx ) {
				messages[ i ] = '{' + i + '}';
			} else {
				messages[ i ] = messages[ i ].replace( '{{SITENAME}}', SITE_TITLE );
			}
		}
	}
	return messages;
}

export default getMessages;
