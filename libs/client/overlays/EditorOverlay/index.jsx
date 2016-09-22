import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import TruncatedText from './../../containers/TruncatedText'

import Button from './../../components/Button'
import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState'
import Panel from './../../components/Panel'
import Input from './../../components/Input'
import Icon from './../../components/Icon'

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
    this.setState( { step: EDIT_STEP } );
  },
  showPreview() {
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
      source = this.props.language_project || this.props.lang + '.' + this.props.project,
      endpoint = '/api/' + source + '/parse/',
      data = {
        title: this.props.title,
        wikitext: this.state.text
      };

    if ( this.props.section ) {
      endpoint += this.props.section;
    }
    this.props.api.post( endpoint, data ).then( function ( data ) {
      self.setState( { preview: data.text } );
    } );
  },
  save() {
    var data,
      self = this,
      props = this.props,
      source = props.language_project || props.lang,
      endpoint = '/api/private/edit/' + source + '/' + encodeURIComponent( this.props.title );

    if ( this.props.section ) {
      endpoint += '/' + this.props.section;
    }
    data = {
      text: this.state.text,
      summary: this.state.summary
    };
    this.setState( { step: SAVE_STEP } );
    this.props.api.post( endpoint, data ).then( function () {
      self.props.api.invalidatePage( props.title, source );
      // wait 2s before doing this to give cache time to warm.
      setTimeout( function () {
        self.props.router.navigateTo( window.location.pathname + '?referer=editor&cachebuster=' + Math.random() );
        self.props.showNotification( 'Your edit was successful!' );
      }, 2000 );
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
      props = this.props,
      license = props.siteinfo.license,
      state = this.state,
      backBtn = <Icon glyph='back' onClick={this.showEditor}
        className={state.step === SAVE_STEP ? 'disabled' : ''}/>,
      previewBtn = <Button label='Next' isPrimary="1" onClick={this.showPreview} />,
      saveBtn = <Button label="Save" isPrimary="1"
        className={state.step === SAVE_STEP ? 'disabled' : ''} onClick={this.save} />,
      summary = <Input placeholder="Example: Fixed typo, added content"
        textarea={true} onInput={this.updateSummary} />,
      editField = <Input defaultValue={state.text} textarea={true} className="editor"
        placeholder="A new page begins here. Start typing!"
        onInput={this.updateText }/>,
      secondaryIcon = state.step === EDIT_STEP ? previewBtn : saveBtn;

    overlayProps = {
      router: props.router,
      secondaryIcon: secondaryIcon,
      className: 'component-editor-overlay'
    };

    this.summary = summary;
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

        content = [
          <Panel key="editor-summary">
            <p className="summary-request">How did you improve the page?</p>
            {summary}
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
