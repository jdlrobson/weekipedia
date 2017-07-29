import React from 'react'
import createReactClass from 'create-react-class'

import mwStorage from './../mediawiki-storage'

import Article from './Article'

import { IntermediateState, Checkbox } from 'wikipedia-react-components'

// Pages
export default createReactClass({
  getConfig() {
    var config = mwStorage.get( 'mobile-options' );
    if ( !config ) {
      return this.props.siteoptions;
    } else {
      return JSON.parse( config );
    }
  },
  updateSetting( name, value ) {
    var config = this.state.mobileOptions;
    config[name] = value;
    this.setState( { mobileOptions: config } );
    this.save( config );
    this.props.showNotification( 'Setting saved. You will need to refresh your browser for the changes to go into effect.' );
  },
  componentDidMount() {
    this.save( this.getConfig() );
  },
  save( config ) {
    this.setState( {
      mobileOptions: config
    } );
    mwStorage.set( 'mobile-options', JSON.stringify( config ) );
  },
  render(){
    var self = this;
    var state = this.state;
    var options = [
      [ 'expandArticlesByDefault', 'Expand all articles by default' ],
      [ 'expandSectionsByDefault', 'Expand all sections by default' ],
      [ 'allowForeignProjects', 'Load other wikimedia projects inside app (experimental)' ],
      [ 'includeTableOfContents', 'Show the table of contents to tablet users' ],
      [ 'collectionsEnabled', 'Enable collections feature' ]
    ];
    var form = state && state.mobileOptions ? (
      <form>
        <p>Adjust your <strong>{this.props.siteinfo.title}</strong> experience with the following configuration options</p>
        <hr/>
        {
          options.map( function ( args, i ) {
            var name = args[0];
            var desc = args[1];

            return (
              <Checkbox key={"mobile-option-" + i}
                name={name}
                checked={state.mobileOptions[name]}
                onToggle={self.updateSetting}
                label={desc} />
            );
          } )
        }
      </form>
    ) : <IntermediateState />;

    return (
      <Article {...this.props} isSpecialPage='yes' title={'Settings'} body={form} />
    );
  }
})

