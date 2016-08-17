import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  render(){
    var title, tagline,
      endpoint = '/api/contributions/' + this.props.lang + '/0/',
      username = this.props.params;

    if ( username ) {
      title = 'User Contributions';
      tagline = <a href={'/' + this.props.lang + '/wiki/User:' + username}>{username}</a>;
      endpoint += username;
    } else {
      title = 'Recent Changes';
      tagline = 'This is a list of recent changes to Wikipedia';
    }

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint}
        title={title} tagline={tagline} />
    )
  }
})

