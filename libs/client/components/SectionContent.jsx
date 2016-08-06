import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class SectionContent extends Component {
  componentDidMount() {
    this.props.hijackLinks();
  }
  render(){
    return (
      <div dangerouslySetInnerHTML={{ __html: this.props.text}}></div>
    )
  }
}

export default SectionContent
