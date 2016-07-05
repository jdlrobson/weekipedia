import React, { Component } from 'react'
import './styles.css'

// Main component
class App extends Component {
  render(){
    return (
      <div className="container">
        <a href="/">home</a>
        <h2 className="page-header">{this.props.title}</h2>
        <div className="row">
          { this.props.children }
        </div>
      </div>
    )
  }
}
export default App
