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
> export USE_HTTPS=true
> export GCM_SENDER_ID=
> export OFFLINE_VERSION=1
> export GCM_API_KEY=
> npm run
