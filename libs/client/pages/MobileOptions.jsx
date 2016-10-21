import React from 'react'

import mwStorage from './../mediawiki-storage'

import Article from './../containers/Article'

import { IntermediateState } from 'wikipedia-react-components'

// Pages
export default React.createClass({
  getConfig() {
    var config = mwStorage.get( 'mobile-options' );
    if ( !config ) {
      return this.props.siteoptions;
    } else {
      return JSON.parse( config );
    }
  },
  updateSetting( ev ) {
    var el = ev.currentTarget;
    var config = this.state.mobileOptions;
    config[el.getAttribute( 'name' )] = el.checked;
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
      [ 'includeSiteBranding', 'Include site branding' ],
      [ 'allowForeignProjects', 'Load other wikimedia projects inside app (experimental)' ],
      [ 'includeTableOfContents', 'Show the table of contents to tablet users' ]
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
              <div key={"mobile-option-" + i}>
                <input type="checkbox" name={name}
                  checked={state.mobileOptions[name]}
                  onChange={self.updateSetting} />
                <label>{desc}</label>
              </div>
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

