import React from 'react'

import Button from './../components/Button'

import Article from './../containers/Article'
import Content from './../containers/Content'

// Pages
export default React.createClass({
  render() {
    var createAccountUrl = "https://meta.wikimedia.org/wiki/Special:CreateAccount?campaign=weekipedia";
    var body = (
      <Content className="content">
        <p>Logged in users enjoy the additional benefits of <strong>managing lists of articles via collections</strong> and
      the ability to <strong>edit</strong> article content.</p>
        <p>To login you'll need a Wikimedia account that allows editing to projects owned by the Wikimedia Foundation.<br/>If you use <strong>Wikipedia</strong> you already have one.</p>
        <div style={{ textAlign: 'center' }}>
          <p>
            <Button label="Sign in via Wikimedia" href="/auth/mediawiki" isPrimary={true} />
          </p>
          <p>
            <Button label="Create a Wikimedia account" href={createAccountUrl} />
          </p>
        </div>
      </Content>
    );

    return (
      <Article {...this.props} isSpecialPage='yes' title={'Sign in'} body={body}>
      </Article>
    )
  }
})

