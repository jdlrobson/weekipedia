#Weekipedia [![Build status](https://travis-ci.org/jdlrobson/weekipedia.svg?branch=master&r=1)](https://travis-ci.org/jdlrobson/weekipedia)

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

## Parity with MobileFrontend

Weekipedia should be capable of everything that MobileFrontend does. This can be shown by cloning
the [MobileFrontend repo](https://github.com/wikimedia/mediawiki-extensions-MobileFrontend) and running [the browser tests](https://github.com/wikimedia/mediawiki-extensions-MobileFrontend/tree/master/tests/browser) against Weekipedia like so:

Configure your instance of Weekipedia like so:

	export DEV_DUMMY_USER=
	export HOST_SUFFIX=.beta.wmflabs.org
	export SERVER_SIDE_RENDERING=1
	export SITE_PRIVACY_URL=//wikimediafoundation.org/wiki/Privacy_policy
	export SITE_EXPAND_ARTICLE=1
	export SITE_EXPAND_SECTIONS=0
	export SITE_EXPAND_SECTIONS_TABLET=1
	export NODE_ENV=testing
	export DEV_DUMMY_USER=0
	export TABLE_OF_CONTENTS=1

Configure MobileFrontend browser tests:

	export MEDIAWIKI_URL= https://weekipediatest.herokuapp.com/wiki/
	export MEDIAWIKI_API_URL=https://en.wikipedia.beta.wmflabs.org/w/api.php
	export MEDIAWIKI_ENVIRONMENT=beta
	export MEDIAWIKI_USER=<must exist on https://en.wikipedia.beta.wmflabs.org>
	export MEDIAWIKI_PASSWORD=<password for account on https://en.wikipedia.beta.wmflabs.org>
	bundle exec cucumber features/ --tags ~@login --tags ~@feature-anon-editing-support --tags ~@adminuser --tags @chrome

Where there is not parity please raise a Github issue.

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

For access to user restricted features:
Register an OAUTH consumer @ https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose
Put callback url as https://yourdomain.com/auth/mediawiki/callback

	export MEDIAWIKI_CONSUMER_KEY=
	export MEDIAWIKI_CONSUMER_SECRET=

install memcached (https://memcached.org/downloads) and get it up and running

	memcached &
	npm run

Do you want server side rendering?

	export SERVER_SIDE_RENDERING=1

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

Enable table of contents

	export TABLE_OF_CONTENTS=1

### Push notifications
Setup push notifications

	export GCM_SENDER_ID=
	export GCM_API_KEY=
	export TREND_ENABLED=1
	export TREND_EDITS_PER_MIN=0
	export TREND_BIAS=1
	export TREND_MIN_AGE=5
	export TREND_MAX_AGE=100000
	export TREND_MIN_TOTAL_EDITS=2
	export TREND_MIN_CONTRIBUTORS=1

### Offline support

	OFFLINE_VERSION=$(git log | head -n1 | awk '{print $2}')
	export OFFLINE_VERSION=$OFFLINE_VERSION
	npm run compile
