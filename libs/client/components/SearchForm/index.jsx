import React, { Component } from 'react'

import SearchInput from './../SearchInput'

import './styles.css'

export default (props) => (
  <form className="search-form">
    <SearchInput onClick={props.onClickSearch} onSearch={props.onSearch}
      placeholder="Search Weekipedia"
      focusOnRender={props.focusOnRender} />
  </form>
);
