#Weekipedia

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

## Contribute

> npm install
> npm run dev

Before commiting code please remember to run:
> npm test

##Running in production

> export PROJECT='wikipedia'

> export SITE_WORDMARK_PATH='/public/wordmark.png'

> export SITE_PRIVACY_URL=//wikimediafoundation.org/wiki/Privacy_policy

> export SITE_TERMS_OF_USE=//m.wikimediafoundation.org/wiki/Terms_of_Use

> export USE_HTTPS=true

> export GCM_SENDER_ID=

> export GCM_API_KEY=

> export DEFAULT_LANGUAGE=en

For access to user restricted features:
Register an OAUTH consumer @ https://meta.wikimedia.org/wiki/Special:OAuthConsumerRegistration/propose
Put callback url as https://yourdomain.com/auth/mediawiki/callback

> export MEDIAWIKI_CONSUMER_KEY=

> export MEDIAWIKI_CONSUMER_SECRET=

install memcached (https://memcached.org/downloads) and get it up and running

> memcached &

> npm run

To expand articles by default

> export SITE_EXPAND_ARTICLE=1

To expand sections by default. If true overrides SITE_EXPAND_ARTICLE.
> export SITE_EXPAND_SECTIONS=1

To change the default home page

> export HOME_PAGE_PATH='/wiki/Special:Feed'

Setup push notifications
> export TREND_ENABLED=1

> export TREND_EDITS_PER_MIN=0

> export TREND_BIAS=1

> export TREND_MIN_AGE=5

> export TREND_MAX_AGE=100000

> export TREND_MIN_TOTAL_EDITS=2

> export TREND_MIN_CONTRIBUTORS=1

Add offline support

> OFFLINE_VERSION=$(git log | head -n1 | awk '{print $2}')

> export OFFLINE_VERSION=$OFFLINE_VERSION

> npm run compile

Enable server side rendering

> export SERVER_SIDE_RENDERING=1

Multi projects

> export SITE_ALLOW_FOREIGN_PROJECTS=1

> export SITE_ALLOWED_PROJECTS='wikivoyage|wikipedia'

Setup site branding (logo in header)

> export SITE_INCLUDE_BRANDING=1
