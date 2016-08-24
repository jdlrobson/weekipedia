import React from 'react'

import Section from './components/Section'

function isSectionEmpty( section ) {
  return ( section.isEmpty && section.subsections.length === 0 ) && !section.vcards;
}

function getSections( allSections, props, fragment ) {
  var sections = [];
  var topLevelSection = allSections.length ? allSections[0].toclevel : 2;
  var curSection;

  allSections.forEach( function ( sectionProps ) {
    var id = sectionProps.id;
    if ( !sectionProps.subsections ) {
      sectionProps.subsections = [];
    }

    if ( sectionProps.toclevel === topLevelSection ) {
      if ( curSection && !isSectionEmpty( curSection ) ) {
        sections.push( React.createElement( Section, curSection ) );
      }
      curSection = Object.assign( {}, props, sectionProps, {
        key: id,
        subsections: []
      } );
    } else if ( curSection.text !== undefined && !isSectionEmpty( sectionProps ) ) {
      curSection.subsections.push(
        React.createElement( Section,
          Object.assign( {}, props, sectionProps, {
            key: id,
            isCollapsible: false
          } )
        )
      );
    }
    if ( sectionProps.anchor === fragment ) {
      curSection.isExpandedByDefault = true;
    }
  } );
  if ( allSections.length ) {
    // If there is only 1 section do not make it collapsible.
    // This helps projects like Wiktionary
    if ( sections.length === 0 ) {
      curSection.isCollapsible = false;
    }
    // push the last one
    if ( !isSectionEmpty( curSection ) ) {
      sections.push( React.createElement( Section, curSection ) );
    }
  }
  return sections;
}

export { getSections };
