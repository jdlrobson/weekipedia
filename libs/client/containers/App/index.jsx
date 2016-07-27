import React, { Component } from 'react'
import ReactDOM from 'react-dom'

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
      isMenuOpen: false,
      isOverlayEnabled: false
    }
  },
  getDefaultProps() {
    return {
      lang: 'en',
      isOverlayFullScreen: true,
      isOverlayEnabled: false
    };
  },
  componentWillReceiveProps( nextProps ) {
    this.setState( { isOverlayEnabled: nextProps.overlay } );
  },
  componentWillMount() {
    this.setState( { isOverlayEnabled: this.props.overlay } );
  },
  closeOverlay() {
    var node;
    // If an overlay is open
    if ( this.state.isOverlayEnabled ) {
      this.setState( { isOverlayEnabled: false } );
    }
  },
  closePrimaryNav( ev ){
    this.setState({ isMenuOpen: false });
    this.closeOverlay();
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

    var overlay;

    if ( this.state.isOverlayEnabled ) {
      if ( this.props.overlayProps ) {
        overlay = React.createElement( this.props.overlay,
          this.props.isOverlayFullScreen ? this.props.overlayProps :
          Object.assign( {}, this.props.overlayProps, {
            onExit: this.closeOverlay
          } )
        );
      } else {
        overlay = this.props.overlay;
      }
    }

    if ( overlay ) {
      navigationClasses += this.props.isOverlayFullScreen ? 'overlay-enabled' : '';
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
        { overlay }
      </div>
    )
  }
} );
