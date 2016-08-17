import React from 'react'

import CardListPage from './CardListPage'

// Pages
export default React.createClass({
  render(){
    var title, tagline,
      username = this.props.params;

    if ( username ) {
      title = 'User Contributions';
      tagline = <a href={'/' + this.props.lang + '/wiki/User:' + username}>{username}</a>;
    } else {
      title = 'Recent Changes';
      tagline = 'This is a list of recent changes to Wikipedia';
    }

    return (
      <CardListPage {...this.props} apiEndpoint={'/api/contributions/' + this.props.lang + '/' + username}
        title={title} tagline={tagline} />
    )
  }
})

