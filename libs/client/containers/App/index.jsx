import React, { Component } from 'react'
import './styles.css'

import MainMenu from './../../components/MainMenu'
import Header from './../../components/Header'
import Icon from './../../components/Icon'
import TransparentShield from './../../components/TransparentShield'

// Main component
export default React.createClass({
  getInitialState() {
    return {
      isMenuOpen: false
    }
  },
  closePrimaryNav( ev ){
    this.setState({ isMenuOpen: false });
  },
  openPrimaryNav( ev ){
    this.setState({ isMenuOpen: true });
    ev.preventDefault();
    ev.stopPropagation();
  },
  render(){
    var navigationClasses = this.state.isMenuOpen ?
      'primary-navigation-enabled navigation-enabled' : '';
    var icon = <Icon glyph="mainmenu" href="/" label="Home"
      onClick={this.openPrimaryNav}/>;
    var shield = this.state.isMenuOpen ? <TransparentShield /> : null;

    return (
      <div id="mw-mf-viewport" className={navigationClasses}>
        <nav id="mw-mf-page-left">
          <MainMenu />
        </nav>
        <div id="mw-mf-page-center" onClick={this.closePrimaryNav}>
          <Header key="header-bar" primaryIcon={icon}></Header>
          { this.props.children }
          {shield}
        </div>
      </div>
    )
  }
} );
