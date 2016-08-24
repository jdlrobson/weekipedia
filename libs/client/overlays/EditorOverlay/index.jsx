import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import TruncatedText from './../../containers/TruncatedText'

import Button from './../../components/Button'
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
  },
  updateSummary( ev ) {
    this.setState( { summary: ev.currentTarget.value } );
  },
  updateText( ev ) {
    this.setState( { text: ev.currentTarget.value } );
  },
  save() {
    var data,
      self = this,
      endpoint = '/api/private/edit/' + this.props.lang + '/' + this.props.title;

    if ( this.props.section ) {
      endpoint += '/' + this.props.section;
    }
    data = {
      text: this.state.text,
      summary: this.state.summary
    };
    this.setState( { step: SAVE_STEP } );
    this.props.api.post( endpoint, data ).then( function () {
      self.props.api.invalidatePage( self.props.title, self.props.lang );
      self.props.router.navigateTo( window.location.pathname + '?referer=editor&cachebuster=' + Math.random() );
      self.props.showNotification( 'Your edit was successful!' );
    } ).catch( function () {
      self.showPreview();
    } );
  },
  loadWikiText(){
    var self = this;
    var endpoint = '/api/wikitext/' + this.props.lang + '/' + this.props.title;
    if ( this.props.section ) {
      endpoint += '/' + this.props.section;
    }
    this.props.api.fetch( endpoint ).then( function ( data ) {
      var page = data.pages[0];
      if ( page.revisions.length ) {
        self.setState( { text: page.revisions[0].content } );
      }

      self.setState( { isLoading: false } );
    } );
  },
  render(){
    var content, overlayProps, action,
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
        content = (
          <Panel>
            <p className="summary-request">How did you improve the page?</p>
            {summary}
            <p className="license">Content will be saved under the following license: <br/>
              <a href={license.url}>{license.name}</a>
            </p>
          </Panel>
        );
      } else {
        action = 'Saving';
        overlayProps.primaryIcon = backBtn;
        content = <IntermediateState label='Please wait' />;
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
