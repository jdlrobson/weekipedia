import React from 'react'
import { render } from 'react-dom'
import './mediawiki-bootstrap.css'
import './main.css'
import App from './containers/App'
import matchRoute from './router.js'

render(React.createElement(App,matchRoute(window.location.pathname)), document.getElementById('app'))
