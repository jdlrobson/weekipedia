import React from 'react'

import CardListPage from './CardListPage'

import CardDiff from './../components/CardDiff'
import Icon from './../components/Icon'

// Pages
export default React.createClass({
  render(){
    var title, lead, tagline,
      source = this.props.language_project || this.props.lang,
      endpoint = '/api/contributions/' + source + '/0/',
      username = this.props.params;

    if ( username ) {
      title = 'User Contributions';
      tagline = (
        <h2>
          <Icon glyph='user'
            href={'/' + this.props.lang + '/wiki/User:' + username}
            type="before"
            onClick={this.props.onClickInternalLink} label={username} />
        </h2>
      );
      endpoint += username;
    } else {
      title = 'Recent Changes';
      lead = {
        paragraph: 'This is a list of recent changes to Wikipedia'
      };
    }

    return (
      <CardListPage {...this.props} apiEndpoint={endpoint} isDiffCardList={true}
        title={title} tagline={tagline} CardClass={CardDiff} lead={lead} />
    )
  }
})

