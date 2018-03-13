import subscriber from 'web-push-subscriber';

import collections from './collection';
import Evaluator from './evaluator';

import addProps from './../prop-enricher';
import cachedResponse from './../../cached-response.js';

import { DEFAULT_PROJECT, LANGUAGE_CODE } from './../../config';

const EDITS_PER_MIN = process.env.TREND_EDITS_PER_MIN || 20 / 60;
const BIAS = process.env.TREND_BIAS || 0.55;
const MIN_AGE = process.env.TREND_MIN_AGE || 5;
const MAX_AGE = process.env.TREND_MAX_AGE || 300;
const MIN_EDITS = process.env.TREND_MIN_TOTAL_EDITS || 20;
const MIN_CONTRIBUTORS = process.env.TREND_MIN_CONTRIBUTORS || 2;
const TREND_MIN_ANON_EDITS = process.env.TREND_MIN_ANON_EDITS || 1;
const PROJECT = `${LANGUAGE_CODE}.${DEFAULT_PROJECT}.org`;
const ANON_EDIT_RATIO = process.env.TREND_MAX_ANON_EDIT_RATIO || 0.51;

var evaluator = new Evaluator( {
	id: 'trending.wmflabs.org',
	project: PROJECT,
	minEdits: MIN_EDITS,
	minContributors: MIN_CONTRIBUTORS,
	minSpeed: EDITS_PER_MIN,
	maxBias: BIAS,
	minAnonEdits: TREND_MIN_ANON_EDITS,
	maxAnonEditRatio: ANON_EDIT_RATIO,
	minAge: MIN_AGE,
	maxAge: MAX_AGE
} );

let hadFirstEvent = false;
let collection = collections.en;

if ( collection ) {
	console.log( `# Trending setup:', edits/m=${EDITS_PER_MIN}, bias=${BIAS}, minAge=${MIN_AGE}, maxage=${MAX_AGE}, minedits=${MIN_EDITS}, mincontributors=${MIN_CONTRIBUTORS}, maxAnonEditRatio=${ANON_EDIT_RATIO} minAnonEdits=${TREND_MIN_ANON_EDITS}, project=${PROJECT}` );

	collection.on( 'edit', function ( item, collection ) {
		var numContributors = item.contributors.length;
		if ( evaluator.isTrending( item ) ) {
			collection.markSafe( item.id );
			if ( !item.trendedAt ) {
				// tell meTrended Fort Collins, Colorado 1 1 0.00005 [ 'Omygoshogolly' ]
				console.log( 'Trended', item.title, item.editsPerMinute(),
					item.getBias(), item.age(), item.contributors );
				item.trendedAt = new Date();
				cachedResponse.invalidate( '/api/web-push/service/trending/' );
				// ping people
				subscriber.broadcast( 'trending' );
			}
		} else if ( evaluator.mightTrend( item ) ) {
			if ( numContributors > MIN_CONTRIBUTORS - 2 ) {
				console.log( `${item.title} may trend with ${numContributors} contrs, age=${item.age()} and bias ${item.getBias()} and speed ${item.editsPerMinute()} and ${item.edits} edits.` );
			}
			collection.markSafe( item.id );
		} else if ( !hadFirstEvent ) {
			console.log( 'Received first event for an edit to ', item.title );
			hadFirstEvent = true;
		}
	} );
}

function trend() {
	function trendSort( pages ) {
		return pages.sort( function ( a, b ) {
			return a.trendedAt > b.trendedAt ? -1 : 1;
		} );
	}

	return new Promise( function ( resolve, reject ) {
		var pages, trended;
		if ( !collection ) {
			reject( 'Trending is disabled. A site admin should enable it via TREND_ENABLED.' );
			return;
		}

		pages = collection.getPages();
		trended = [];
		pages.forEach( function ( page ) {
			if ( page.trendedAt ) {
				if ( typeof page.trendedAt === 'string' ) {
					page.trendedAt = new Date( page.trendedAt );
				}
				trended.push( Object.assign( {}, page, { trendIndex: undefined } ) );
			}
		} );
		trended = trendSort( trended ).slice( 0, 50 );

		// It's always getting less interesting as it gets older so assume the best and last position was 1.
		trended.forEach( function ( trend, i ) {
			trend.lastIndex = i === 0 ? 2 : 1;
			trend.index = i + 1;
		} );

		if ( trended.length ) {
			addProps( trended, [ 'pageimages', 'pageterms', 'categories' ] ).then( function ( pages ) {
				pages = trendSort( pages );
				resolve( {
					pages: pages,
					ts: new Date()
				} );
			} );
		} else {
			reject();
		}
	} );
}

export default trend;
