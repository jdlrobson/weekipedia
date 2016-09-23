import React from 'react'

import Section from './components/Section'

function getSections( allSections, props ) {
  var sections = [];
  var topLevelSection = allSections.length ? allSections[0].toclevel : 2;
  var curSection;

  allSections.forEach( function ( sectionProps ) {
    var id = sectionProps.id;
    if ( sectionProps.toclevel === topLevelSection ) {
      if ( curSection ) {
        sections.push( React.createElement( Section, curSection ) );
      }
      curSection = Object.assign( {}, props, sectionProps, {
        key: id,
        subsections: []
      } );
    } else if ( curSection.text !== undefined ){
      curSection.subsections.push(
        React.createElement( Section,
          Object.assign( {}, props, sectionProps, {
            key: id,
            isCollapsible: false
          } )
        )
      );
    }
  } );
  if ( allSections.length ) {
    // If there is less than 2 sections do not make them collapsible.
    // This helps projects like Wiktionary
    if ( sections.length < 3 ) {
      curSection.isCollapsible = false;
    }
    // push the last one
    sections.push( React.createElement( Section, curSection ) );
  }
  return sections;
}

export { getSections };
