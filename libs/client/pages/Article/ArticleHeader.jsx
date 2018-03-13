import React, { Component } from 'react';

import { HorizontalList, Content } from 'wikipedia-react-components';
import SectionContent from './../../components/SectionContent';
import Infobox from './../../components/Infobox';
import PageActions from './../../components/PageActions';

import withInterAppLinks from './../withInterAppLinks';

// Main component
class ArticleHeader extends Component {
	render() {
		var ii,
			props = this.props,
			InfoboxWithInterAppLinks = withInterAppLinks(
				Infobox, props
			),
			SectionContentWithInterAppLinks = withInterAppLinks(
				SectionContent, props
			),
			content = [],
			header = [],
			additionalClasses = [],
			lead = this.props.lead || {};

		additionalClasses.push( this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading' );

		if ( typeof lead === 'string' ) {
			lead = { text: lead };
		}
		if ( this.props.tagline ) {
			lead.description = this.props.tagline;
		}
		if ( !lead.displaytitle && this.props.title ) {
			lead.displaytitle = this.props.title;
		}

		if ( this.props.isWikiPage && lead && lead.text ) {
			header.push( <PageActions {...this.props}
				key="page-actions"
				id="page-actions"
				disableLanguages={lead.languagecount === 0} /> );
		}

		if ( lead.displaytitle ) {
			header.push(
				<h1 key="article-title"
					id="section_0" dangerouslySetInnerHTML={{ __html: lead.displaytitle }}></h1>
			);
		}
		if ( !lead.mainpage ) {
			header.push( <div className="tagline" key="article-tagline">{lead.description}</div> );
		}
		if ( lead.issues ) {
			header.push( <a href="#/issues" className="mw-mf-cleanup" key="article-issues">Page issues</a> );
		}
		if ( lead.hatnote ) {
			header.push( <p key="article-header-hatnote"
				className="hatnote" dangerouslySetInnerHTML={{ __html: lead.hatnote }} /> );
		}

		if ( this.props.tabs.length ) {
			header.push( <HorizontalList isSeparated="1" className="tabs"
				key="article-header-tabs">{this.props.tabs}</HorizontalList> );
		}

		if ( lead.imageinfo ) {
			ii = lead.imageinfo;
			header.push(
				<div className="main-image">
					<img src={ii.thumburl} width={ii.thumbwidth} height={ii.thumbheight}/>
					<div>
						<a href={ii.url}>Original file</a>
					</div>
				</div>
			);
		}

		if ( lead.infobox ) {
			additionalClasses.push( 'article-feature-infobox' );
		}

		if ( !lead.mainpage ) {
			content.push( <div className="heading-holder"
				key="article-header-heading">{header}</div> );
		}

		if ( lead.paragraph ) {
			content.push( <SectionContentWithInterAppLinks {...this.props}
				key="article-header-paragraph"
				className="lead-paragraph" text={lead.paragraph} /> );
		}

		if ( lead.infobox ) {
			content.push( <InfoboxWithInterAppLinks {...this.props} text={lead.infobox}
				key="article-header-infobox" /> );
		}
		return (
			<Content key="article-row-0" className={'pre-content ' + additionalClasses.join( ' ' )}>
				{content}
				<SectionContentWithInterAppLinks {...this.props} className="lead-section" text={lead.text} />
			</Content>
		);
	}
}

ArticleHeader.defaultProps = {
	tabs: []
};

export default ArticleHeader;
