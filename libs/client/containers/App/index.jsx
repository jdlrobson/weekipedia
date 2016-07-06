import React, { Component } from 'react'
import './styles.css'
import Header from './../../components/Header'

// Main component
class App extends Component {
  render(){
    return (
      <div id="mw-mf-viewport">
        <div id="mw-mf-page-center">
          <Header key="header-bar"></Header>
          { this.props.children }
        </div>
      </div>
    )
  }
}
export default App
