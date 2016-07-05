import React from 'react'
import { render } from 'react-dom'
import './mediawiki-bootstrap.css'
import './main.css'
import IntermediateState from './components/IntermediateState/index.jsx'

render( React.createElement(IntermediateState), document.getElementById('app'))
