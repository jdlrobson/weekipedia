# Weekipedia [![Build status](https://travis-ci.org/jdlrobson/weekipedia.svg?branch=master&r=1)](https://travis-ci.org/jdlrobson/weekipedia)

Weekipedia is the Wikipedia mobile site reimagined in React.js. It is a 10% project and not officially supported by the Wikimedia Foundation.

The goals of this project include but are not limited to:

## End user goals
* Explore the concept of a webapp as an alternative to native apps
* Explore new ways to engage users to make Wikipedia a content destination (e.g. not somewhere people go from search engines)

## Engineering goals:
* Explore how complete our APIs are
* Improve mobile content service APIs for apps
* Provide an easy way for designers and engineers at the WMF to communicate with one another with a common language around components and explore redesigns
* Provide a consumer for code that currently lives inside MediaWiki to provide motivation to publish npm modules for useful functionality and for Wikimedia projects to become better open source citizens
* Explore how push notifications, service workers can fit into the MediaWiki ecosystem.
* Fun!

## Parity with MobileFrontend [![Parity status](https://travis-ci.org/jdlrobson/wikipedia-mobile-browser-tests.svg?branch=master&r=1)](https://travis-ci.org/jdlrobson/wikipedia-mobile-browser-tests)


Weekipedia is capable of everything that MobileFrontend does. All [anonymous MobileFrontend browser tests](https://github.com/jdlrobson/wikipedia-mobile-browser-tests) are run against Weekipedia.

Information on how to run browser tests is available [here](https://gist.github.com/jdlrobson/9e97205d232a70967f97675b8f2209a5). Where there is not parity please raise a Github issue.

## Contribute

> npm install
> npm run dev

Before commiting code please remember to run:
> npm test

## Development

	# You can spoof logged in state using this:
	export DEV_DUMMY_USER=Dummy
	# When you set the value to 0 the login link will show but it will act like it is possible for you to login
	export DEV_DUMMY_USER=0
	# And you can test against the Wikimedia beta cluster
	export HOST_SUFFIX=.beta.wmflabs.org

##Running in production

	# Any known Wikimedia site runs on the .org domain. No support for other mediawiki instances at time of writing.
	export HOST_SUFFIX=.org
	export PROJECT='wikipedia'
	export SITE_WORDMARK_PATH='/public/wordmark.png'
	export SITE_PRIVACY_URL=//wikimediafoundation.org/wiki/Privacy_policy
	export SITE_TERMS_OF_USE=//m.wikimediafoundation.org/wiki/Terms_of_Use
	export USE_HTTPS=true
	export DEFAULT_LANGUAGE=en

### OAuth login support
For access to user restricted features:
Register an OAUTH consumer @ https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose
Put callback url as https://yourdomain.com/auth/mediawiki/callback

	export MEDIAWIKI_CONSUMER_KEY=
	export MEDIAWIKI_CONSUMER_SECRET=

install memcached (https://memcached.org/downloads) and get it up and running

	memcached &
	npm run

### Server side rendering
Do you want server side rendering?

	export SERVER_SIDE_RENDERING=1

### Other project support
Do you want to handle all Wikimedia projects or just the value you defined in PROJECT ?

	export SITE_ALLOW_FOREIGN_PROJECTS=1
	export SITE_ALLOWED_PROJECTS='wikivoyage|wikipedia'

### Site customisations

Sections:

	#To expand articles by default
	export SITE_EXPAND_ARTICLE=1
	# To expand sections by default only on tablet. If true overrides SITE_EXPAND_ARTICLE.
	export SITE_EXPAND_SECTIONS_TABLET_=1
	# To expand sections by default. If true overrides SITE_EXPAND_ARTICLE and SITE_EXPAND_SECTIONS_TABLET
	export SITE_EXPAND_SECTIONS=1

To change the default home page

	export SITE_HOME='Special:Feed'

Setup site branding (logo in header)

	export SITE_INCLUDE_BRANDING=1

Replace the search input in the header with a search button

	export CHROME_HEADER_SEARCH_ICON=1

Enable table of contents

	export TABLE_OF_CONTENTS=1

Enable talk button for anonymous users

	export SHOW_TALK_ANONS=1

### Push notifications
Setup push notifications. You'll need a Google Cloud Messaging API key from https://console.developers.google.com/.

	export GCM_SENDER_ID=
	export GCM_API_KEY=
	export TREND_ENABLED=1
	export TREND_EDITS_PER_MIN=0
	export TREND_MIN_ANON_EDITS=0
	export TREND_MAX_ANON_EDIT_RATIO=1 (1 anon edit / 2 named edit = 0.5 ratio)
	export TREND_BIAS=1
	export TREND_MIN_AGE=5
	export TREND_MAX_AGE=100000
	export TREND_MIN_TOTAL_EDITS=2
	export TREND_MIN_CONTRIBUTORS=1

### Trending
If you want to collate trending topics over the course of a week period you'll need to setup a cronjob to occur every 12hrs.

	wget https://trending.wmflabs.org/api/edit-trends-week?

### Collections
Enable user public collections (as alternative to watchstar)

	export ENABLE_COLLECTIONS=1

If you want to include the watchlist in a users list of collections

	export COLLECTIONS_INCLUDE_WATCHLIST=1

### Nearby
Disable the nearby feature.

	export ENABLE_NEARBY=0

### Settings

Disable customisations to the experience.

	export DISABLE_SETTINGS=1

### Older browsers

Weekipedia by default uses Promises, Map, Object.assign and Function.prototype.bind
Support a larger set of browsers (including phantomjs for headless testing) by enabling polyfill mode.

	export USE_POLYFILLS=1

### Offline support

First you'll need to chose an offline strategy.

	export OFFLINE_STRATEGY=all # all pages when visited will be cached locally
	export OFFLINE_STRATEGY=shell # only shell will be cached


You'll need to set an offline version. Please bump this whenever you want to trigger updates to your users.
It's recommended you use the commit id if working with git.

	OFFLINE_VERSION=$(git log | head -n1 | awk '{print $2}')
	export OFFLINE_VERSION=$OFFLINE_VERSION
	npm run compile
