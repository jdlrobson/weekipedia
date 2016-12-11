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
    this.loadWikiText();
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
      endpoint = '/api/' + source + '/parse/',
      data = {
        title: this.props.title,
        wikitext: this.state.text || props.wikitext
      };

    if ( this.props.section ) {
      endpoint += this.props.section;
    }
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
      source = props.language_project || props.lang,
      title = props.normalizedtitle || props.title;

    this.setState( { step: SAVE_STEP } );
    props.api.edit( source, title, props.section, state.text || props.wikitext,
      state.summary || props.editSummary ).then( function () {
      props.router.navigateTo( window.location.pathname + '?referer=editor&cachebuster=' + Math.random() );
      props.showNotification( 'Your edit was successful!' );
    } ).catch( function () {
      self.showPreview();
    } );
  },
  loadWikiText(){
    var self = this,
      source = this.props.language_project || this.props.lang,
      endpoint = '/api/wikitext/' + source + '/' + encodeURIComponent( this.props.title );

    if ( this.props.section ) {
      endpoint += '/' + this.props.section;
    }
    this.props.api.fetch( endpoint ).then( function ( data ) {
      var text,
        page = data.pages[0];

      if ( page.missing ) {
        text = '';
      } else if ( page.revisions.length ) {
        text = page.revisions[0].content;
      }

      self.setState( { isLoading: false, text: text } );
    } );
  },
  render(){
    var content, overlayProps, action, previewPane,
      editSummary, warnings,
      props = this.props,
      license = props.siteinfo.license,
      state = this.state,
      backBtn = <Icon glyph='back' onClick={this.showEditor}
        className={state.step === SAVE_STEP ? 'disabled' : ''}/>,
      previewBtn = <Button label='Next' isPrimary="1" onClick={this.showPreview} />,
      saveBtn = <Button label="Save" isPrimary="1"
        className={state.step === SAVE_STEP ? 'disabled' : ''} onClick={this.save} />,
      summaryField = <Input placeholder="Example: Fixed typo, added content"
        key="edit-summary"
        textarea={true} onInput={this.updateSummary} />,
      editField = <Input defaultValue={state.text || props.wikitext}
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
        if ( props.editWarning ) {
          warnings = (
            <div key="editor-warning"
              className="warning-box" dangerouslySetInnerHTML={{ __html: props.editWarning }} />
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
    overlayProps.header = <h2><TruncatedText><strong>{action}</strong> {props.title}</TruncatedText></h2>;

    return (
      <Overlay {...overlayProps}>
        <Content className="overlay-content">
          {content}
        </Content>
      </Overlay>
    )
  }
} );
