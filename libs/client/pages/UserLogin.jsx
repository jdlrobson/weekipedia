import React from 'react'
import ReactDOM from 'react-dom'

import CardList from './../components/CardList'
import CollectionCard from './../components/CollectionCard'
import IntermediateState from './../components/IntermediateState'
import ErrorBox from './../components/ErrorBox'
import Button from './../components/Button'

import Article from './../containers/Article'

// Pages
export default React.createClass({
  render() {
    var btn = <div style={{ textAlign: 'center' }}>
      <Button label="Sign in via MediaWiki" href="/auth/mediawiki" isPrimary={true} />
    </div>;

    return (
      <Article {...this.props} isSpecialPage='yes' title={'Sign in'} body={btn}>
      </Article>
    )
  }
})

