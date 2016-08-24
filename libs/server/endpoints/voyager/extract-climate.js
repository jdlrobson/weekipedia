import { extractElements } from './domino-utils'

function extractFloat( str ) {
  str = str.replace( '−', '-' );
  return parseFloat( str, 10 )
}

function fix( num ) {
  return parseFloat( num.toFixed( 1 ), 10 );
}

function climateExtraction( section ) {
  var rows, table,
    imperial = false,
    highRowNum = 0,
    climateData = [];
  var ext = extractElements( section.text, 'table.climate-table' );

  if ( ext.extracted.length === 1 ) {
    table = ext.extracted[0];
    rows = table.querySelectorAll( 'tr' );
    // get headings
    Array.prototype.forEach.call( table.querySelectorAll( 'th' ), function ( col, j ) {
      if ( j > 0 ) {
        climateData.push( { heading: col.textContent } );
      }
    } );

    Array.prototype.forEach.call( rows, function ( row, i ) {
      // get data.
      var cols = row.querySelectorAll( 'td' );
      if ( cols.length === 13 ) {
        Array.prototype.forEach.call( cols, function ( col, j ) {
          if ( j > 0 ) {
            if ( i === highRowNum ) {
              // highs
              climateData[j - 1].imperial = imperial;
              climateData[j - 1].high = extractFloat( col.textContent, imperial );
            } else if ( i === highRowNum + 1 ) {
              // lows
              climateData[j - 1].low = extractFloat( col.textContent );
            } else if ( i === highRowNum + 2 ) {
              // precipitation
              climateData[j - 1].precipitation = extractFloat( col.textContent );
            }
          } else {
            if ( i === highRowNum ) {
              imperial = col.textContent.indexOf( '(°F)' ) > -1;
            }
          }
        } );
      } else {
        highRowNum += 1;
      }
    } );
    climateData.forEach( function ( mo ) {
      if ( mo.imperial ) {
        delete mo.imperial;
        mo.high = fix( ( mo.high - 32 ) * 5 / 9 );
        mo.low = fix( ( mo.low - 32 ) * 5 / 9 );
        mo.precipitation = fix( mo.precipitation / 0.0393700787402 );
      }
    } );
    section.climate = climateData;
    section.text = ext.html;
  }
  return section;
}

export default climateExtraction
