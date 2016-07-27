import React from 'react'
import { render } from 'react-dom'
import 'reset-css/reset.css'
import './main.css'
import App from './containers/App'
import router from './router.js'

function renderCurrentRoute() {
  render( React.createElement( App,
    router.matchRoute( window.location.pathname, window.location.hash ) ),
    document.getElementById( 'app' )
  )
}

if ( 'onhashchange' in window ) {
  window.onhashchange = renderCurrentRoute;
}
renderCurrentRoute();
