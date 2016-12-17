import React from 'react'
import { Button, Icon, Input, IntermediateState, Panel, TruncatedText } from 'wikipedia-react-components'

import Content from './../../components/Content'
import SectionContent from './../../components/SectionContent'

import Overlay from './../Overlay'

import './styles.less'
import './icons.less'

const EDIT_STEP = 0;
const PREVIEW_STEP = 1;
const SAVE_STEP = 2;

export default React.createClass({
  getInitialState() {
    return {
      step: EDIT_STEP,
      isLoading: true,
      summary: '',
      text: ''
    }
  },
  getDefaultProps() {
    return {
      wikitext: null,
      placeholder: 'A new page begins here. Start typing!',
      emptyMessage: '',
      loadingMessage: 'Searching',
      api: null,
      lang: 'en'
    }
  },
  componentDidMount() {
    if ( this.props.section !== 'new' ) {
      this.loadWikiText();
    } else {
      // allowing editing of new sections
      this.setState( { isLoading: false } );
    }
  },
  showEditor() {
    window.scrollTo(0,0);
    this.setState( { step: EDIT_STEP } );
  },
  showPreview() {
    window.scrollTo(0,0);
    this.setState( { step: PREVIEW_STEP } );
    if ( !this.state.preview ) {
      this.loadPreview();
    }
  },
  updateSummary( ev ) {
    this.setState( { summary: ev.currentTarget.value } );
  },
  updateText( ev ) {
    this.setState( { text: ev.currentTarget.value, preview: null } );
  },
  loadPreview() {
    var self = this,
      props = this.props,
      source = props.language_project || props.lang + '.' + props.project,
      title = props.title,
      endpoint = '/api/' + source + '.org/rest_v1/transform/wikitext/to/html/' + encodeURIComponent( title ),
      data = {
        body_only: true,
        title: title,
        wikitext: this.state.text || props.wikitext
      };

    this.props.api.post( endpoint, data ).then( function ( data ) {
      self.setState( { preview: data.text } );
    } );
  },
  save() {
    window.scrollTo(0,0);
    var
      self = this,
      props = this.props,
      state = this.state,
      wikitext = state.text || props.wikitext,
      source = props.language_project || props.lang,
      title = props.normalizedtitle || props.title;

    function escape( newrevid ) {
      var path = window.location.pathname;
      if ( newrevid ) {
        path += '?oldid=' + newrevid;
      }
      props.router.navigateTo( path );
    }
    this.setState( { step: SAVE_STEP } );
    if ( navigator.onLine  !== undefined && !navigator.onLine ) {
      props.storage.set( this.getStorageKey(),
        JSON.stringify( { text: wikitext, timestamp: state.timestamp } )
      );
      escape();
      props.showNotification( [
        'Your edit was cached to your device as you are currently offline.',
        'Be sure to attempt to save it again next time you are online.'
      ].join('') );
    } else {
      props.api.edit( source, title, props.section, wikitext,
        state.summary || props.editSummary ).then( function ( resp ) {
        escape( resp.edit.newrevid );
        props.showNotification( 'Your edit was successful!' );
      } ).catch( function () {
        self.showPreview();
      } );
    }
  },
  getStorageKey() {
    return 'edit/' + this.props.title;
  },
  loadWikiText(){
    var self = this,
      props = this.props,
      cached = props.storage.get( this.getStorageKey() ),
      source = this.props.language_project || this.props.lang,
      endpoint = '/api/wikitext/' + source + '/' + encodeURIComponent( this.props.title );

    if ( this.props.section ) {
      endpoint += '/' + this.props.section;
    }
    if ( cached ) {
      cached = JSON.parse( cached );
    }
    this.props.api.fetch( endpoint ).then( function ( data ) {
      var text, warning, rev,
        page = data.pages[0];

      if ( page.missing ) {
        text = cached ? cached.text : '';
      } else if ( page.revisions.length ) {
        rev = page.revisions[0];
        text = rev.content;
        if ( cached ) {
          text = cached.text;
          if ( !cached.timestamp || rev.timestamp !== cached.timestamp ) {
            warning = 'The content you are about to save has changed. You might want to look into that.';
          }
        }
      }

      self.setState( { isLoading: false,
        timestamp: rev && rev.timestamp,
        text: text, editWarning: warning } );
    } ).catch( () => {
      if ( navigator.onLine  !== undefined && !navigator.onLine ) {
        self.setState( {
          isLoading: false,
          text: cached ? cached.text : '<<< offline (saving may override default content)'
        } );
      }
    });
  },
  getDefaultText() {
    var w = this.props.wikitext;
    var cached = this.props.storage.get( this.getStorageKey() );
    var text = this.state.text;
    if ( cached ) {
      text = JSON.parse( cached ).text;
    } else if ( text && w ) {
      text = text.slice( 0, text.indexOf('==\n') + 3 ) + w + text.slice( text.indexOf('==\n') + 3 );
    } else if ( w ){
      text = w;
    }
    return text;
  },
  render(){
    var content, overlayProps, action, previewPane,
      editSummary, warnings,
      props = this.props,
      license = props.siteinfo.license,
      state = this.state,
      editWarning = state.editWarning || props.editWarning,
      backBtn = <Icon glyph='back' onClick={this.showEditor}
        className={state.step === SAVE_STEP ? 'disabled' : ''}/>,
      previewBtn = <Button label='Next' isPrimary="1" onClick={this.showPreview} />,
      saveBtn = <Button label="Save" isPrimary="1"
        className={state.step === SAVE_STEP ? 'disabled' : ''} onClick={this.save} />,
      summaryField = <Input placeholder="Example: Fixed typo, added content"
        key="edit-summary"
        textarea={true} onInput={this.updateSummary} />,
      editField = <Input defaultValue={this.getDefaultText()}
        textarea={true} className="editor"
        placeholder={props.placeholder}
        onInput={this.updateText }/>,
      secondaryIcon = state.step === EDIT_STEP ? previewBtn : saveBtn;

    overlayProps = {
      router: props.router,
      secondaryIcon: secondaryIcon,
      className: 'component-editor-overlay'
    };

    this.editField = editField;
    if ( state.isLoading ) {
      action = 'Loading';
      content = <IntermediateState />;
    } else {
      if ( state.step === EDIT_STEP ) {
        action = 'Editing';
        content = editField;
      } else if ( state.step === PREVIEW_STEP ) {
        action = 'Previewing';
        overlayProps.primaryIcon = backBtn;
        previewPane = state.preview ?
          <SectionContent text={state.preview} /> :
          <IntermediateState msg="Loading preview" />;

        if ( !props.editSummary ) {
          editSummary = [
            <p className="summary-request" key="edit-summary-prompt">How did you improve the page?</p>
          ];
          editSummary.push(summaryField);
        }
        if ( editWarning ) {
          warnings = (
            <div key="editor-warning"
              className="warning-box" dangerouslySetInnerHTML={{ __html: editWarning }} />
          );
        }
        content = [
          <Panel key="editor-summary">
            {warnings}
            {editSummary}
            <p className="license">Content will be saved under the following license: <br/>
              <a href={license.url}>{license.name}</a>
            </p>
          </Panel>,
          <Panel key="editor-preview">
            {previewPane}
          </Panel>
        ];
      } else {
        action = 'Saving';
        overlayProps.primaryIcon = backBtn;
        content = <IntermediateState msg='Saving your changes' />;
      }
    }
    overlayProps.header = <h2><TruncatedText><strong>{action}</strong> {props.displayTitle || props.title}</TruncatedText></h2>;

    return (
      <Overlay {...overlayProps}>
        <Content className="overlay-content">
          {content}
        </Content>
      </Overlay>
    )
  }
} );
