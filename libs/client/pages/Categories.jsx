import React from 'react'
import createReactClass from 'create-react-class'

import CardList from './../components/CardList'
import { IntermediateState } from 'wikipedia-react-components'

import Article from './Article'

// Pages
export default createReactClass({
  getInitialState() {
    return {
      endpoint: null
    };
  },
  componentDidMount() {
    this.load( this.props );
  },
  componentWillReceiveProps( props ) {
    this.load( props );
  },
  load( props ){
    var endpoint = '/api/categories/' + props.lang + '/';
    if ( props.params ) {
      endpoint += props.params;
    }
    this.setState( { endpoint: endpoint } );
  },
  render() {
    var props = this.props;
    var body = this.state.endpoint ? <CardList {...props} apiEndpoint={this.state.endpoint} /> :
      <IntermediateState/>;

    return (
      <Article {...props} isSpecialPage='yes'
        title={'Categories'}
        body={body}>
      </Article>
    )
  }
})

