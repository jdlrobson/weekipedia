import React, { Component } from 'react'
import './styles.css'

import MainMenu from './../../components/MainMenu'
import Header from './../../components/Header'
import Icon from './../../components/Icon'
import TransparentShield from './../../components/TransparentShield'
import SearchForm from './../../components/SearchForm'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      isMenuOpen: false
    }
  },
  getDefaultProps() {
    return {
      lang: 'en'
    };
  },
  closePrimaryNav( ev ){
    this.setState({ isMenuOpen: false });
  },
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    ev.preventDefault();
    ev.stopPropagation();
  },
  onClickSearch(ev){
    this.props.router.navigateTo( '#/search' );
  },
  render(){
    var searchForm = (<SearchForm
      onClickSearch={this.onClickSearch}></SearchForm>);

    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';

    var icon = <Icon glyph="mainmenu" href="/" label="Home"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    if ( this.props.overlay ) {
      navigationClasses += 'overlay-enabled';
    }

    return (
      <div id="mw-mf-viewport" className={navigationClasses}>
        <nav id="mw-mf-page-left">
          <MainMenu lang={this.props.lang}/>
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <Header key="header-bar" primaryIcon={icon}
            main={searchForm}></Header>
          { this.props.children }
          {shield}
        </div>
        { this.props.overlay }
      </div>
    )
  }
} );
