import React from 'react'

import Content from './../Content'

import './styles.less'

export default React.createClass({
  navigateTo: function ( ev ) {
    var props = this.props;
    if ( props.banner.link ) {
      props.router.navigateTo( props.banner.link )
      ev.preventDefault();
    }
  },
  render: function () {
    var props = this.props;
    var url = props.banner ? props.banner.url || props.banner.source : null;
    var leadBannerStyles = {
      backgroundImage: props.banner ? 'url("' + url + '")' : 'none'
    };

    return (
      <div className="component-page-banner" onClick={this.navigateTo}>
        <div style={leadBannerStyles}>
          <Content>{props.children}</Content>
        </div>
      </div>
    );
  }
} );

