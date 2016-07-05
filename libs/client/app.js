import React from 'react'
import { render } from 'react-dom'
import './mediawiki-bootstrap.css'
import './main.css'
import App from './containers/App/index.jsx'
import IntermediateState from './components/IntermediateState/index.jsx'

var currentState = {
  title: 'Hot',
  children: [React.createElement(IntermediateState)]
};

render(React.createElement(App,currentState), document.getElementById('app'))
