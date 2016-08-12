import React from 'react'

import './styles.less'

export default React.createClass({
  getDefaultProps: function () {
    return {
      emptyMessage: 'The list is disappointedly empty.'
    };
  },
  render: function () {
    var props = this.props;
    return props.cards.length ? (
        <div className={"card-list" + ( props.unordered ? ' card-list-unordered' : '' ) }>{props.cards}</div>
      ) : <div>{props.emptyMessage}</div>;
  }
} );