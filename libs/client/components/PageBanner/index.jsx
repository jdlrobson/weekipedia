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
    var leadBannerStyles = {
      backgroundImage: props.banner ? 'url("' + props.banner.url + '")' : 'none'
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

