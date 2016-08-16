import React from 'react'

import SearchInput from './../SearchInput'

import './styles.less'

export default React.createClass({
  onDoSearch( ev ){
    this.props.onSearchSubmit( ev.currentTarget.querySelector( 'input' ).value );
  },
  render() {
    var props = this.props;
    return (
      <form className="search-form" onSubmit={this.onDoSearch}>
        <SearchInput onClick={props.onClickSearch} onSearch={props.onSearch}
          placeholder={props.msg( 'search' )}
          focusOnRender={props.focusOnRender} />
      </form>
    )
  }
});
