import addProps from './../prop-enricher'

export default function ( lang, project ) {
  return addProps(
    [
      { title: 'Antarctica' },
      { title: 'Asia' },
      { title: 'Africa' },
      { title: 'Caribbean' },
      { title: 'Europe' },
      { title: 'Central America' },
      { title: 'Middle East' },
      { title: 'North America' },
      { title: 'South America' },
      { title: 'Oceania' }
    ], [ 'pageimages', 'pageterms' ], lang, project
  ).then( function ( pages ) {
    return {
      pages: pages
    };
  } );
}
