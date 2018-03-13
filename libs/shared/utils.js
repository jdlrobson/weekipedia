var utils = {
	getAbsoluteUrl: function ( title, lang, project, isMobileDomain ) {
		var prefix = isMobileDomain ? 'm.' : '';
		lang = lang || 'en';
		project = project || 'm.wikipedia.org';
		return [ 'wikispecies', 'commons', 'meta' ].indexOf( project ) === -1 ?
			'//' + lang + '.' + prefix + project + '.org/wiki/' + title :
			'//' + prefix + project + '.wikimedia.org/wiki/' + title;
	}
};

export default utils;
