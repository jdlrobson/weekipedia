import React, { Component } from 'react'

import { HorizontalList } from 'wikipedia-react-components'
import SectionContent from './../../components/SectionContent'
import PageBanner from './../../components/PageBanner'

import MakeNote from './../../components/MakeNote'
import WatchIcon from './../../components/WatchIcon'
import EditorLink from './../../components/EditorLink'

import Content from './../../components/Content'

function mapo( coords, zoom, w, h ) {
  var lat = coords.lat,
    lon = coords.lon,
    src = 'https://maps.wikimedia.org/img/osm-intl,' + zoom + ',' + lat + ',' + lon + ',' + w + 'x' + h  + '.png';

  return src;
}

// Main component
class ArticleHeader extends Component {
  render(){
    var ii,
      content = [],
      heading, tabs,
      contentProps = Object.assign( {}, this.props, { id: undefined, className: undefined } ),
      header = [],
      props = this.props,
      banner = lead ? lead.banner : null,
      additionalClasses = [],
      lead = this.props.lead || {};

    additionalClasses.push( this.props.isSpecialPage ? ' special-page-heading' : ' standard-page-heading' );
    if ( this.props.className  ){
      additionalClasses.push( this.props.className );
    }

    if ( typeof lead === 'string' ) {
      lead = { text: lead };
    }
    if ( this.props.tagline ) {
      lead.description = this.props.tagline;
    }
    if ( !lead.displaytitle && this.props.title ) {
      lead.displaytitle = this.props.title;
    }

    if ( lead.displaytitle ) {
      heading = (
        <h1 key="article-title"
        id="section_0" dangerouslySetInnerHTML={{ __html: lead.displaytitle }}></h1>
      );
    }

    if ( lead && lead.coordinates ) {
      var desc = lead.description || '',
        zoom = lead.infobox ? 4 : 12,
        coords = lead.coordinates;

      if ( coords.zoom ) {
        zoom = coords.zoom;
      } else if ( typeof desc === 'string' ) {
        if ( desc.indexOf( 'continent' ) > -1 || desc.indexOf( 'region' ) > -1 ) {
          zoom = 2;
        } else if ( desc.indexOf( 'autonomous community' ) > -1 ) {
          zoom = 6;
        } else if ( desc.indexOf( 'archipelago' ) > -1 ) {
          zoom = 10;
        } else if ( desc.indexOf( 'city' ) > -1 ) {
          zoom = 12;
        }
      }

      if ( coords.lat !== undefined && coords.lon !== undefined ) {
        banner = {
          url: mapo( coords, zoom, 1000, 200 ),
          link: lead.maplink || '#/map/' + coords.lat + '/' + coords.lon + '/' + zoom + '/'
        };
      }
    }

    if ( this.props.isBannerEnabled ) {
      banner = (
        <PageBanner {...this.props} banner={banner} key="article-page-banner">
          {heading}
        </PageBanner>
      );
    } else {
      header.push( heading );
    }

    // without this watch hidden on pages without description
    if ( !lead.description ) {
      lead.description = '\u00a0';
    }

    if ( !lead.mainpage ) {
      header.push(<div className="tagline" key="article-tagline">{lead.description}</div>)
    }
    var isWatchablePage = props.isWikiPage && lead && lead.text;
    if ( isWatchablePage ) {
      header.push( <WatchIcon {...contentProps} key="article-watch" /> );
    }
    if ( lead.note || isWatchablePage ) {
      header.push( <MakeNote {...contentProps}
        session={props.session} key="article-make-note" /> );
    }

    if ( this.props.tabs.length ) {
      tabs = ( <HorizontalList isSeparated="1" className="tabs"
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

    if ( tabs ) {
      content.push( tabs );
    }

    if ( lead.paragraph ) {
      content.push( <SectionContent {...this.props}
        key="article-header-paragraph"
        className="lead-paragraph" text={lead.paragraph} /> );
    }

    var col3, col2Class = '';
    if ( this.props.column_three ) {
      col2Class = 'col-2';
      col3 = <div className="col-3">{this.props.column_three}</div>;
    }
    var editLink;
    if ( lead.text ) {
      editLink = <EditorLink key="header-lead-edit" section={0} session={props.session} />
    }

    return (
      <div key="article-row-0" className={"pre-content " + additionalClasses.join( ' ' )}>
        <Content key="content-area">
          <div className={col2Class} key="article-col-2">
          {banner}
          {content}
          <SectionContent {...this.props} className="lead-section" text={lead.text} key="header-lead" />
          {editLink}
          </div>
          {col3}
          <div className={col2Class}>
          {this.props.body}
          </div>
        </Content>
      </div>
    )
  }
}

ArticleHeader.defaultProps = {
  tabs: [],
  isBannerEnabled: true
};

export default ArticleHeader
