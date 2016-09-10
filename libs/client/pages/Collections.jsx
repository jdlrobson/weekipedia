import React from 'react'
import ReactDOM from 'react-dom'

import CardList from './../components/CardList'
import CollectionCard from './../components/CollectionCard'
import IntermediateState from './../components/IntermediateState'
import ErrorBox from './../components/ErrorBox'
import Button from './../components/Button'

import Article from './../containers/Article'

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
          <a href="/wiki/Special:UserLogin">Sign in</a> to use collections.
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
    var tagline, userUrl, actions, label, suffix;
    if ( this.state.username ) {
      if ( this.props.session && this.state.username === this.props.session.username ) {
        label = this.state.id ? 'Edit' : 'Create';
        suffix = this.state.id ? '/' + this.state.id : '/';
        actions = <Button label={label} href={"#/edit-collection/" + this.state.username + suffix } isPrimary={true}/>;
      }
      userUrl = '/' + this.props.lang + '/wiki/Special:Collections/by/' + this.state.username;
      // The api request is cached at this point
      tagline = (
        <div>
          <div>by <a href={userUrl} onClick={this.navigateTo}>{this.state.username}</a></div>
          {this.state.description}
          <div>{actions}</div>
        </div>
      );
    }
    return (
      <Article {...this.props} isSpecialPage='yes'
        title={this.state.title || 'Collections'} tagline={tagline} body={this.getBody()}>
      </Article>
    )
  }
})

