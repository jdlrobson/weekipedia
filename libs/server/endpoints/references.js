import page from './page'

export default function ( lang, title, project ) {
  return page( lang, title, project, true ).then( function ( data ) {
    var sections = data.remaining ? data.remaining.sections : [];
    var references = [];

    sections.forEach( function ( section ) {
      if ( section.isReferenceSection ) {
        references.push( section );
      }
    } );
    return {
      references: {
        sections: references
      }
    };
  } );
}
