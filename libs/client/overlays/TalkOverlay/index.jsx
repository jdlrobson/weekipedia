import React from 'react';
import { Button, ErrorBox, Icon, Input, Content,
	IntermediateState, LinkList, Panel, TruncatedText } from 'wikipedia-react-components';

import SectionContent from './../../components/SectionContent';

import Overlay from './../Overlay';

import './styles.less';

import withInterAppLinks from './../../pages/withInterAppLinks';

export default class Thing extends React.Component {
	constructor() {
		super();
		this.state = {
			indent: 2,
			isLoading: true
		};
	}
	getTalkPageTitle() {
		if ( this.props.title.indexOf( ':' ) === -1 ) {
			return 'Talk:' + this.props.title;
		} else {
			return this.props.title.replace( ':', ' talk:' );
		}
	}
	componentWillReceiveProps() {
		this.loadTopics();
		window.scrollTo( 0, 0 );
	}
	componentDidMount() {
		this.loadTopics();
		window.scrollTo( 0, 0 );
	}
	loadTopics() {
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
	}
	goBack() {
		window.history.back();
	}
	saveReply() {
		var self = this;
		var props = this.props;
		var indent = this.state.indent;
		var hash = window.location.hash;
		this.setState( { isLoading: true, action: 'Saving reply' } );
		this.props.api.edit( props.language_project, this.getTalkPageTitle(),
			props.section, '\n\n' + Array( indent + 1 ).join( ':' ) + this.state.replyBody, 'reply to topic', true
		).then( function () {
			self.setState( {
				isLoading: true,
				action: undefined,
				lead: undefined,
				sections: undefined
			} );
			props.store.setUserNotification( 'Your reply was added!' );
			// hack to force a re-render
			history.back();
			setTimeout( function () {
				window.location.hash = hash;
			}, 0 );
		} );
	}
	saveTopic() {
		var self = this;
		var props = this.props;
		var text = '==' + this.state.subject + '==\n\n' + this.state.body;
		this.setState( { isLoading: true, action: 'Adding new topic' } );
		this.props.api.edit( props.language_project, this.getTalkPageTitle(),
			'new', text, 'Add topic'
		).then( function () {
			self.setState( {
				isLoading: true,
				action: undefined,
				lead: undefined,
				sections: undefined
			} );
			props.onSaveComplete();
		} );
	}
	setReplyBody( ev ) {
		this.setState( { replyBody: ev.currentTarget.value } );
	}
	setBody( ev ) {
		this.setState( { body: ev.currentTarget.value } );
	}
	setSubject( ev ) {
		this.setState( { subject: ev.currentTarget.value } );
	}
	render() {
		var overlayProps, content, licenseText, primaryIcon, secondaryIcon, section,
			heading = 'Talk',
			props = this.props,
			sections = this.state.sections,
			license = props.siteinfo.license,
			SectionContentWithInterAppLinks = withInterAppLinks(
				SectionContent, props
			),
			state = this.state,
			action = state && state.action,
			saveTopic = <Button label="Add" isPrimary="1" onClick={this.saveTopic.bind( this )}
				disabled={!state.body || !state.subject} />,
			saveReply = <Button label="Reply" isPrimary="1" onClick={this.saveReply.bind( this )}
				disabled={!state.replyBody} />,
			addDiscussionBtn = <Button label="Add discussion" isPrimary="1"
				href="#/talk/new" />,
			backBtn = <Icon glyph='back'
				onClick={this.goBack.bind( this )} />;

		if ( license ) {
			licenseText = (
				<Panel>
					<div className="license">By saving changes, you agree to the Terms of Use and agree to release your contribution under the <a href={license.url}>{license.name}</a> license.</div>
				</Panel>
			);
		}

		if ( state.isLoading ) {
			content = <IntermediateState msg={action} />;
			if ( action ) {
				heading = action;
			}
		} else if ( props.section === 'new' ) {
			heading = 'Add discussion';
			primaryIcon = backBtn;
			secondaryIcon = saveTopic;
			content = [
				licenseText,
				<Panel><Input placeholder="Subject"
					onInput={this.setSubject.bind( this )}/></Panel>,
				<Panel><Input placeholder="What is on your mind?" textarea={true}
					onInput={this.setBody.bind( this )}/></Panel>
			];
		} else if ( props.section ) {
			// Look up the section (since the sections do not include the lead we subtract 1)
			section = sections && sections.length >= parseInt( props.section, 10 ) ?
				sections[ parseInt( props.section, 10 ) - 1 ] : null;

			if ( section ) {
				primaryIcon = backBtn;
				heading = section.line;
				secondaryIcon = saveReply;
				content = (
					<div className="scrollable">
						<Panel>
							<SectionContentWithInterAppLinks {...props} text={section.text} />
						</Panel>
						<h3 className="list-header">Reply</h3>
						<Panel>
							<Input placeholder="What is your opinion?" textarea={true} key="reply"
								onInput={this.setReplyBody.bind( this )} />
						</Panel>
						{licenseText}
					</div>
				);
			} else {
				content = <ErrorBox msg="Unable to load discussion" />;
			}
		} else {
			secondaryIcon = addDiscussionBtn;
			content = [
				<Panel isHeading={true} key="active-header-panel">
          The following conversations are currently active
				</Panel>
			].concat(
				<LinkList className="scrollable" key="talk-topics-list">
					{
						sections.map( function ( section, i ) {
							return <a href={'#/talk/' + ( i + 1 ) }>{section.line}</a>;
						} )
					}
				</LinkList>
			);
		}

		overlayProps = {
			onExit: props.onExit,
			header: <h2><TruncatedText><strong>{heading}</strong></TruncatedText></h2>,
			secondaryIcon: secondaryIcon,
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
		);
	}
}
