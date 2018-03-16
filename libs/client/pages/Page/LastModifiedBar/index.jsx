import React from 'react';
import timeago from 'timeago';
import { Icon, TruncatedText, Content } from 'wikipedia-react-components';

import './styles.less';
import './icons.less';

export default ( { editor, language_project, lang, title, timestamp, onClickLink } ) => {
	const isAnon = !( editor && editor.user );
	const source = language_project || lang + '/wiki';
	const historyUrl = '/' + source + '/Special:History/' + title;
	const prefix = '/wiki/User:';
	const now = Math.round( new Date().getTime() / 1000 );

	var editorElement, text = '', editorLabel, tsAsDate, historyText,
		timeDelta,
		iconVariant = '-gray',
		key = 'last-modified-bar',
		className = 'last-modified-bar';

	if ( timestamp ) {
		tsAsDate = new Date( timestamp );
		historyText = 'Last edited ' + timeago( tsAsDate );
		// calculate delta in seconds
		timeDelta = now - ( tsAsDate.getTime() / 1000 );

		// check if fresh (< 1hr)
		if ( timeDelta < 60 * 60 ) {
			className += ' active';
			iconVariant = '-invert';
		}
	}

	// Cached pages may not have this available.
	if ( editor ) {
		editorLabel = isAnon ? 'an anonymous user' : editor.user;
		editorElement = isAnon ? <span key={key + '-editor'}>{editorLabel}</span> :
			<a href={prefix + editor.user} onClick={onClickLink}
				key={key + '-editor'}>{editorLabel}</a>;
		text = ' by ';
	}

	var modifierTagline = (
		<TruncatedText>
			<a href={historyUrl} key={key + '-link'}
				onClick={onClickLink}>{historyText}</a> {text} {editorElement}
			<Icon key={key + '-label'}
				small={true} glyph={'arrow' + iconVariant} className='indicator' />
		</TruncatedText>
	);

	return (
		<div className={className}>
			<Content>
				<Icon glyph={'clock' + iconVariant} type="before" small={true}
					label={modifierTagline} className="last-modifier-tagline" />
			</Content>
		</div>
	);
};
