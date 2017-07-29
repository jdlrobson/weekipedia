import React from 'react'
import createReactClass from 'create-react-class'

import CardListPage from './CardListPage'

// Pages
export default createReactClass({
  render(){
    var props = this.props;
    var username = props.params;
    var endpoint = '/api/uploads/' + props.language_project + '/' + username;

    var tagline = (
      <p>
        Files uploaded by <a href={'/' + props.language_project + '/User:' + username}
          onClick={props.onClickInternalLink}>{username}</a>
      </p>
    );

    return (
      <CardListPage {...props} apiEndpoint={endpoint}
        title='Uploads' tagline={tagline}/>
    );
  }
})

