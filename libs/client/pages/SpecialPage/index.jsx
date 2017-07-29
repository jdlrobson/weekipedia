import React from 'react'
import createReactClass from 'create-react-class'

import Content from './../../components/Content'

import Article from './../Article'

// Pages
export default createReactClass({
  getDefaultProps: function () {
    return {
      title: null,
      lang: null,
      children: null
    };
  },
  render(){
    var url = this.props.mobileUrl;
    var children = (
        <div>This special page is not currently available in the web app.
        <br/>In the meantime you can <a href={url}>use Wikipedia</a>.</div>
      );
    var body = (
      <Content key="special-page-row-1" className="content">
        {children}
      </Content>
    );

    return (
      <Article {...this.props} title={this.props.title} isSpecialPage='yes' body={body} />
    )
  }
} );
