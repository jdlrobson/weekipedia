import React from 'react'

import Overlay from './../../containers/Overlay'
import Content from './../../containers/Content'
import Panel from './../../containers/Panel'
import TruncatedText from './../../containers/TruncatedText'
import LinkList from './../../containers/LinkList'

import SectionContent from './../../components/SectionContent'
import IntermediateState from './../../components/IntermediateState'
import Icon from './../../components/Icon'
import ErrorBox from './../../components/ErrorBox'

import './styles.less'

export default React.createClass({
  getInitialState() {
    return {
      isLoading: true
    }
  },
  getTalkPageTitle() {
    if ( this.props.title.indexOf( ':' ) === -1 ) {
      return 'Talk:' + this.props.title;
    } else {
      return this.props.title.replace( ':', ' talk:' );
    }
  },
  componentDidMount() {
    this.loadTopics();
    window.scrollTo( 0, 0 );
  },
  loadTopics(){
    var self = this;
    var props = this.props;

    props.api.getPage( this.getTalkPageTitle(), props.language_project ).then( function ( data ) {
      self.setState( {
        isLoading: false,
        lead: data.lead,
        sections: data.remaining.sections
      } );
    } ).catch( function () {
      self.setState( { isLoading: false } );
    } );
  },
  goBack() {
    window.history.back();
  },
  render(){
    var overlayProps, content, primaryIcon, section,
      heading = 'Talk',
      props = this.props,
      sections = this.state.sections,
      state = this.state,
      backBtn = <Icon glyph='back'
        onClick={this.goBack} />;

    if ( state.isLoading ) {
      content = <IntermediateState />;
    } else if ( props.section ) {
      // Look up the section (since the sections do not include the lead we subtract 1)
      section = sections && sections.length >= parseInt( props.section, 10 ) ?
        sections[parseInt( props.section, 10 )-1] : null;

      if ( section ) {
        primaryIcon = backBtn;
        heading = section.line;
        content = (
          <div className="scrollable">
            <Panel>
              <SectionContent {...props} text={section.text} />
            </Panel>
          </div>
        );
      } else {
        content = <ErrorBox msg="Unable to load discussion" />;
      }
    } else {
      content = [
        <Panel isHeading={true}>
          The following conversations are currently active
        </Panel>
      ].concat(
        <LinkList>
          {
            sections.map( function ( section, i ) {
              return <a href={"#/talk/" + ( i + 1 ) }>{section.line}</a>
            } )
          }
        </LinkList>
      );
    }

    overlayProps = {
      header: <h2><TruncatedText><strong>{heading}</strong></TruncatedText></h2>,
      router: props.router,
      className: 'component-editor-overlay'
    };
    if ( primaryIcon ) {
      overlayProps.primaryIcon = primaryIcon;
    }

    return (
      <Overlay {...overlayProps} className="component-talk-overlay">
        <Content className="overlay-content">
          {content}
        </Content>
      </Overlay>
    )
  }
} );
