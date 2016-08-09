import React from 'react'
import Article from './../../containers/Article'
import Content from './../../containers/Content'

import utils from './../../utils'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      title: null,
      lang: null,
      children: null
    };
  },
  render(){
    var url = utils.getAbsoluteUrl( 'Special:' + this.props.title, this.props.lang, 'm.' + this.props.project + '.org' );
    var children = this.props.children ?
      this.props.children : (
        <div>Special pages are currently not supported.
        <br/>In the meantime you can <a href={url}>use Wikipedia</a>.</div>
      );

    return (
      <Article title={this.props.title} isSpecialPage='yes'>
        <Content key="special-page-row-1" className="content">
          {children}
        </Content>
      </Article>
    )
  }
} );
