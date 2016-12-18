import React from 'react'

import Overlay from './../Overlay'
import { Button, IntermediateState, ErrorBox } from 'wikipedia-react-components'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {};
  },
  download() {
    var pages = this.state.collection && this.state.collection.pages;
    var props = this.props;
    var proj = props.language_project;
    var errors = 0;
    var pending = pages.length;
    var self = this;
    this.setState( { isDownloading: true, pending: pending, errors: errors, total: pages.length } );
    function reportBack( err ) {
      if ( err ) {
        errors++;
      }
      pending--;
      self.setState( { pending: pending, errors: errors, isDownloading: pending > 0 } );
    }
    pages.forEach( function ( page ) {
      props.api.getPage( page.title, proj )
        .then(()=>reportBack(false))
        .catch(()=>reportBack(true));
    } );
  },
  fetch( query ) {
    var props = this.props;
    var url = '/api/' + props.lang + '/collection/by/' + props.username + '/' + props.id;
    return props.api.fetch( url, { query: query } );
  },
  fetchAllPagesInCollection() {
    var self = this;
    var collection = this.state.collection;

    this.fetch()
      .then(
        ( newCollection ) => {
          if ( collection ) {
            collection.pages = collection.pages.concat( newCollection.pages );
          } else {
            collection = newCollection;
          }
          self.setState( { collection: collection } );
          if ( collection.continue ) {
            self.fetchAllPagesInCollection( { continue: collection.continue } );
          }
        }
      );
  },
  componentDidMount() {
    this.fetchAllPagesInCollection();
  },
  render(){
    var props = this.props;
    var state = this.state;
    var collection = state.collection;
    var content = <IntermediateState key="collection-download-loading"/>;

    if ( state.isDownloading ) {
      content = (
        <div>
          Downloading... ({state.total-state.pending}/{state.total})
        </div>
      );
    } else if ( state.pending === 0 ) {
      if ( state.errors )  {
        content = (
          <div>
            <ErrorBox msg="Sorry!" />
             It was not possible to download {state.errors}/{state.total} of the pages in this collection.
            <Button label="Got it." onClick={props.closeOverlay} />
          </div>
        );
      } else {
        content = (
          <div>
            All the pages in this collection will now be available offline. Please set your phone to airplane mode and hit refresh to make sure!
            <Button label="Got it." onClick={props.closeOverlay} />
          </div>
        );
      }
    } else if ( collection ) {
      content = (
        <div>
          <p>
             <strong>{collection.title}</strong> has <strong>{collection.pages.length}</strong> pages.
          </p>
          <p>We can make these available to you offline. Do you want to download them now?</p>
          <div className="collection-actions">
            <Button label="Yes please!" isPrimary={true} onClick={this.download}/>
            <Button label="No thanks." onClick={props.closeOverlay} />
          </div>
        </div>
      );
    }
    return (
      <Overlay {...props} className="collection-overlay" isDrawer={true}>
      <h2>{props.msg( 'collection-download' )}</h2>
      {content}
      </Overlay>
    );
  }
} )

