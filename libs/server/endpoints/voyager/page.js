import domino from 'domino'

import page from './../page'
import mwApi from './../mwApi';
import addProps from './../prop-enricher'

import { extractElements, isNodeEmpty, cleanupScrubbedLists } from './domino-utils'
import extractDestinations from './extract-destinations'
import extractImages from './extract-images'
import climateExtraction from './extract-climate'
import extractBoldItems from './extract-bold-items'

import thumbnailFromTitle from './../collection/thumbnail-from-title'

const ITEMS_TO_DELETE = [
  '.mw-kartographer-maplink',
  '.pp_infobox',
  // otherwise you'll have destination links from the outline box.
  // e.g. https://en.wikivoyage.org/wiki/Dudinka
  '.article-status',
  '.noprint',
  '.ambox',
  '.mbox-image',
  '.mbox-text',
  '.scribunto-error',
  '.mw-kartographer-container'
];

// Haven't worked out what to do with these yet.
const sectionBlacklist = [ 'Learn', 'Work', 'Stay safe', 'Stay healthy',
  'Cope', 'Respect', 'Connect' ];

export default function ( title, lang, project ) {
  project = 'wikivoyage';
  // FIXME: This can be done in mobile content service
  function addBannerAndCoords( data ) {
    var width;
    var params = {
      redirects: '',
      prop: 'coordinates|pageprops|pageassessments',
      pageprops: 'wpb_banner',
      titles: title
    };
    return mwApi( lang, params, data.lead.project_source || project ).then( function ( propData ) {
      var page = propData.pages[0];
      var title;

      if ( page && page.coordinates ) {
        data.lead.coordinates = page.coordinates.length ? page.coordinates[0] : page.coordinates;
      }
      data.lead.images = [];
      if ( page && page.pageprops ) {
        title = page.pageprops.wpb_banner;
        width = 300;
        if ( title ) {
          data.lead.images = [{
            caption: '',
            href: '/wiki/File:' + title,
            width: width,
            height: width / 7,
            src: thumbnailFromTitle( title, width )
          }];
          data.lead.media.unshift( title );
        }
      }
      return data;
    } );
  }

  function addSights( data ) {
    var props = [ 'pageimages', 'pageterms', 'pageprops' ];
    if ( data.lead.sights ) {
      return addProps( data.lead.sights.slice( 0, 50 ), props, 'en', 'wikipedia', {
        ppprop: 'disambiguation'
      } )
        .then((sightPages) => {
          data.lead.sights = sightPages.filter(
            (page)=> {
              var isDisambiguation = page.pageprops && page.pageprops.disambiguation !== undefined;
              return !page.missing && !isDisambiguation;
            }
          );
          return data;
        } );
    } else {
      return data;
    }
  }

  function addNextCards( data, pages, isRegion ) {
    var props = [ 'pageimages', 'pageterms' ];
    if ( !isRegion ) {
      props.push( 'coordinates' );
    }
    return addProps( pages.slice( 0, 50 ), props,
      lang, project,
      { codistancefrompage: data.lead.normalizedtitle || data.lead.displaytitle || title }
    ).then( function () {
        var destinations = [];
        data.remaining.sections.forEach( function ( section ) {
          if ( section.destinations && section.destinations.length ) {
            destinations.push( Object.assign( {}, section, { text: '' } ) );
          }
          delete section.destinations;
        } );
        data.lead.destinations = destinations;
        return data;
      } );
  }

  function extractWarningsAndInfobox( section ) {
    var ext = extractElements( section.text, '.pp_warningbox' );
    if ( ext.extracted.length ) {
      section.warnings = '<table> ' + ext.extracted[0].innerHTML + '</table>';
    }
    ext = extractElements( ext.html, 'table' );
    if ( ext.extracted.length ) {
      section.infobox = '<table> ' + ext.extracted[0].innerHTML + '</table>';
    }
    section.text = ext.html;
    return section;
  }

  function isSectionEmpty( section ) {
    var window = domino.createWindow( '<div>' + section.text + '</div>' ),
      document = window.document;

    return isNodeEmpty( document.body );
  }

  function extractMaps( section ) {
    var map;
    var ext = extractElements( section.text, '.mw-kartographer-map' );
    if ( ext.extracted[0] ) {
      map = ext.extracted[0];
      section.text = ext.html;
      section.map = {
        lat: map.getAttribute( 'data-lat' ),
        lon: map.getAttribute( 'data-lon' ),
        overlays: map.getAttribute( 'data-overlays' )
      };
    }

    return section;
  }

  function isEmptySectionArray( sections ) {
    var isEmpty = true;
    sections.forEach( function ( section ) {
      if ( !section.isEmpty ) {
        isEmpty = false;
      }
    } );
    return isEmpty;
  }

  function cleanup( section ) {
    var ext = extractElements( section.text, ITEMS_TO_DELETE.join( ',' ) );
    section.text = cleanupScrubbedLists( ext.html );
    return section;
  }

  function voyager( data ) {
    return addBannerAndCoords( data ).then( function ( data ) {
      var newSection, climate;
      var isRegion = false;
      var isCountry = false;
      var sections = [];
      var isSubPage = data.lead.displaytitle.indexOf('/') > -1;
      var cardSectionTocLevel;
      var blacklist = [ 'Talk' ];
      var allImages = [];
      var logistics = [];
      var sights = [];
      var allDestinations = [];
      var allMaps = [];
      var curSectionLine;
      var orientation = [];
      var itineraries = [];
      const SIGHT_HEADINGS = [ 'See', 'See & Do' ];
      const DESTINATION_BLACKLIST = [ 'Understand' ];
      const EXPLORE_HEADINGS = [ 'Regions', 'Districts', 'Countries', 'Get around', 'Listen',
        'Eat and drink', 'Counties', 'Prefectures', 'Fees/Permits', 'See',
        'Buy', 'Eat', 'Drink', 'Do' ];
      const COUNTRY_SECTION_HEADINGS = [ 'regions' ];
      const REGION_SECTION_HEADINGS = [ 'cities', 'other destinations', 'cities and towns',
        'towns & villages', 'towns &amp; villages', 'the islands',
        'cities / villages', 'nearby islands',
        'destinations', 'towns', 'countries and territories' ];

      var p = { text: data.lead.paragraph };
      cleanup( p );
      data.lead.paragraph = p.text;
      newSection = cleanup( data.lead.sections[0] );
      newSection = extractImages( newSection );
      newSection = extractMaps( newSection );
      newSection = extractWarningsAndInfobox( newSection );
      allImages = allImages.concat( newSection.images );
      allMaps = allMaps.concat( newSection.maps );
      // promote infobox upwards
      data.lead.warnings = newSection.warnings;
      if ( !data.lead.infobox ) {
        data.lead.infobox = newSection.infobox;
      }
      delete newSection.infobox;
      delete newSection.warnings;
      delete newSection.images;
      delete newSection.maps;

      data.remaining.sections.forEach( function ( section ) {
        // reset Go next section
        if ( cardSectionTocLevel !== undefined && section.toclevel <= cardSectionTocLevel ) {
          cardSectionTocLevel = undefined;
        }
        if ( section.toclevel === 1 ) {
          curSectionLine = section.line;
        }

        if ( [ 'Itineraries' ].indexOf( section.line ) > -1 ) {
          itineraries = section;
          return;
        }

        var lcLine = section.line.toLowerCase();
        if ( SIGHT_HEADINGS.indexOf( curSectionLine ) > -1 && !isRegion && !isCountry ) {
          sights = sights.concat( extractBoldItems( section.text ) );
        }

        if ( REGION_SECTION_HEADINGS.indexOf( lcLine ) > -1 ) {
          isRegion = true;
        }
        if ( COUNTRY_SECTION_HEADINGS.indexOf( lcLine ) > -1 ) {
          isCountry = true;
        }
        if (
          ( isRegion || lcLine === 'go next' ) &&
          ( section.toclevel === 1 || section.toclevel === 2 )
        ) {
          data.lead.destinations_id = section.id;
          cardSectionTocLevel = section.toclevel;
        }

        if ( blacklist.indexOf( section.line ) === -1 ) {
          section = cleanup( section );

          // Images are vital in these sections so do not pull them out
          if ( [ 'Regions', 'Districts' ].indexOf( section.line ) === -1 ) {
            section = extractImages( section );
            allImages = allImages.concat( section.images );
            section = extractMaps( section );
            allMaps = allMaps.concat( section.maps );
            delete section.images;
            delete section.maps;
          }

          section = climateExtraction( section );
          if ( section.climate ) {
            climate = section.climate;
            delete section.climate;
          }

          if ( cardSectionTocLevel !== undefined && !isSubPage ) {
            if ( DESTINATION_BLACKLIST.indexOf( curSectionLine ) === -1 ) {
              section = extractDestinations( section );
              if ( section.destinations ) {
                allDestinations = allDestinations.concat( section.destinations );
              }
            }
          }

          section.isEmpty = isSectionEmpty( section );
          if ( section.isEmpty ) {
            section.text = '';
          }

          if ( EXPLORE_HEADINGS.indexOf( curSectionLine ) > -1 ) {
            orientation.push( section );
          } else if ( [
            'Get in', 'Sleep' ].indexOf( curSectionLine ) > -1
          ) {
            logistics.push( section );
          } else if ( sectionBlacklist.indexOf( curSectionLine ) === -1 ) {
            sections.push( section );
          }
        }
      } );
      data.remaining.sections = sections;
      data.lead.images = data.lead.images.concat( allImages );
      data.lead.maps = allMaps;
      data.lead.climate = climate;
      data.lead.isRegion = isRegion;
      data.lead.isCountry = isCountry;
      data.itineraries = itineraries;
      if ( !isRegion && !isCountry ) {
        data.lead.sights = sights;
      }
      data.lead.isSubPage = isSubPage;

      if ( !isEmptySectionArray( logistics ) ) {
        data.logistics = logistics;
      }

      // this is inferior and provided by mcs
      delete data.lead.geo;

      if ( !isEmptySectionArray( orientation ) ) {
        data.orientation = orientation;
      }

      if ( allDestinations.length || sights.length ) {
        return addNextCards( data, allDestinations, isRegion )
          .then( ( data ) => {
            return addSights( data )
          } );
      } else {
        return data;
      }
    } );
  }

  function transform( json ) {
    if ( json.code ) {
      return json;
    } else if ( json.lead && json.lead.ns > 0 ) {
      return json;
    } else {
      return voyager( json );
    }
  }
  return page( title, lang, project ).then( transform ).catch( function () {
    return page( title, lang, 'wikipedia' ).then( function ( json ) {
      json.remaining = { sections: [] };
      if ( json.lead ) {
        json.lead.project_source = 'wikipedia';
      }
      return transform( json );
    } );
  } );
}
