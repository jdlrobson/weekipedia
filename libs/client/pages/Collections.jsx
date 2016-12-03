import React from 'react'
import ReactDOM from 'react-dom'

import CardList from './../components/CardList'
import CollectionCard from './../components/CollectionCard'
import { ErrorBox, Button, IntermediateState, TruncatedText } from 'wikipedia-react-components'

import Article from './Article'

const COLLECTIONS_ARE_NOT_ORDERED = true;

// Pages
export default React.createClass({
  getInitialState() {
    return {
      defaultView: false,
      error: false,
      endpoint: null,
      description: null,
      cards: null,
      title: null,
      username: null,
      id: null
    }
  },
  load( props ) {
    var self = this;
    var args = props.params ? props.params.split( '/' ) : [];
    var endpoint, username, id,
      endpointPrefix = '/api/' + props.lang + '/collection';

    this.setState( { description: null, title: null, error: false } );
    if ( args.length === 3 ) {
      username = args[1];
      id = args[2];

      endpoint = endpointPrefix + '/by/' + username + '/' + id;
      this.setState( { endpoint: endpoint, username: username, id: id, defaultView: false } );
      props.api.fetch( endpoint ).then( function ( collection ) {
        self.setState( { title: collection.title, description: collection.description } );
      } ).catch( function () {
        self.setState( { error: true } );
      })
    } else if ( args.length === 2 && args[1] ) {
      username = args[1];
      endpoint = '/api/' + props.lang + '/collection/by/' + username;
      this.setState( { endpoint: endpoint, username: username, id: id } );
      props.api.fetch( endpoint ).then( function ( state ) {
        self.setState( state );
      } ).catch( function () {
        self.setState( { error: true } );
      })
      this.setState( { description: 'All collections by ' + username})
    } else if ( args.length === 0 || !args[0] ) {
      this.setState( { defaultView: true, username: false, endpoint: endpointPrefix } );
    } else {
      props.router.navigateTo( '/' + props.lang + '/wiki/Special:Collections', null, true );
    }
  },
  componentWillMount() {
    this.load( this.props );
  },
  componentWillReceiveProps( props ) {
    this.load( props );
  },
  getBody(){
    var session = this.props.session;
    var msg = session ? <p><a href={'#/edit-collection/' + session.username + '/'}>Create your own collection</a></p>
      : <p><a href="/wiki/Special:UserLogin">Sign in</a> to use collections.</p>

    if ( this.state.title ) {
      return <CardList key="collection-list" {...this.props} unordered={COLLECTIONS_ARE_NOT_ORDERED} apiEndpoint={this.state.endpoint} />
    } else if ( this.state.collections ) {
      return <CardList key="collections-list"
        emptyMessage="There are no collections by this user."  unordered={COLLECTIONS_ARE_NOT_ORDERED}
        {...this.props} pages={this.state.collections} CardClass={CollectionCard} />;
    } else if ( this.state.error ) {
      return <ErrorBox msg="Unable to show page." key="article-error" />;
    } else if ( this.state.defaultView ) {
      return (
        <div>
          <CardList key="collection-list" {...this.props} unordered={COLLECTIONS_ARE_NOT_ORDERED}
             CardClass={CollectionCard}
             emptyMessage="There are no collections."
             apiEndpoint={this.state.endpoint} />
          {msg}
        </div>
      );
    } else {
      return <IntermediateState />
    }
  },
  navigateTo(ev) {
    var href = ReactDOM.findDOMNode( this ).querySelector( 'a' ).getAttribute( 'href' );
    if ( href ) {
      ev.preventDefault();
      this.props.router.navigateTo( href );
    }
  },
  render() {
    var username, tagline, userUrl, actions, label, suffix, tabs,
      props = this.props,
      lang = this.props.lang,
      session = this.props.session;

    if ( this.state.username ) {
      if ( session && this.state.username === session.username ) {
        label = this.state.id ? 'Edit' : 'Create';
        suffix = this.state.id ? '/' + this.state.id : '/';
        actions = <Button label={label} href={"#/edit-collection/" + this.state.username + suffix } isPrimary={true}/>;
      }
      userUrl = '/' + this.props.lang + '/wiki/Special:Collections/by/' + this.state.username;
      // The api request is cached at this point
      tagline = (
        <div>
          <div>by <a href={userUrl} onClick={this.navigateTo}>{this.state.username}</a></div>
          {this.state.description}&nbsp;
          <div>{actions}</div>
        </div>
      );
      username = this.state.username;
    } else if ( session ) {
      username = session.username;
    }

    tabs = [
      <a key="collection-tab-1" href={'/' + lang + '/wiki/Special:Collections/'}
        onClick={this.props.onClickInternalLink}
        className={!this.state.username ? 'active' : ''}>All</a>
    ];
    if ( username ) {
      tabs.push(
        <a key="collection-tab-2" href={'/' + lang + '/wiki/Special:Collections/by/' + username}
          onClick={this.props.onClickInternalLink}
          className={this.state.username === username && !this.state.title ? 'active' : ''}>{username}</a>
      );

      if ( this.state.id ) {
        tabs.push(
          <span key="collection-tab-3"
            className={this.state.title ? 'active' : ''}><TruncatedText>{this.state.title}</TruncatedText></span>
        )
      }
    } else {
      tagline = (
        <div>
          <div>by everyone</div>
          {props.msg( 'collections-all')}
        </div>
      );
    }
    return (
      <Article {...this.props} isSpecialPage='yes'
        tabs={tabs}
        title={this.state.title || props.msg( 'menu-collections' )} tagline={tagline} body={this.getBody()}>
      </Article>
    )
  }
})

