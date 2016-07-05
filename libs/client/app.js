import React from 'react'
import { render } from 'react-dom'
import './mediawiki-bootstrap.css'
import './main.css'
import App from './containers/App/index.jsx'
import Home from './pages/Home.jsx'
import api from './api.js'


var currentState = {
  title: 'Hot',
  children: [React.createElement(Home, {
    api: api,
    key: 'hot'
  })]
};

render(React.createElement(App,currentState), document.getElementById('app'))
