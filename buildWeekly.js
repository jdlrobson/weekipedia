const disabledExtension = function () { return null };
// Allow use of ES2015 transpiler e.g. import/const etc..
require('babel-core/register')

var fetch = require('isomorphic-fetch');
var week = require( './libs/server/endpoints/trending/week' ).default;

var ids = {};

week.load().then((data) => {
	// create lookup table
	data.pages.forEach((page, i) => {
		ids[page.title] = i;
	});

	fetch('https://en.wikipedia.org/api/rest_v1/feed/trending/edits').then((newData) => {
		return newData.json();
	}).then((newData) => {
		newData.pages.forEach((page) => {
			if ( ids[page.title] === undefined ) {
				data.pages.push( page );
			} else {
				// update score
				var oldPage = data.pages[ids[page.title]];
				oldPage.trendiness += page.trendiness;
				oldPage.trendiness /= 2;
			}
		});
		week.save(data);
	})
})

