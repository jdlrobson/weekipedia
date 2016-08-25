import React from 'react'

import Icon from './../Icon'

import './styles.less'
import './icons.less'

function getListItems( sections, suffix ) {
  suffix = suffix || '';

  return sections.map( function( section, i ) {
    var childListItems, children,
      subSections = section.props.subsections;

    if ( subSections.length ) {
      childListItems = getListItems( subSections, '-c' );
      children = <ul key={'toc-list-' + i + '-child'}>{childListItems}</ul>;
    }
    return (
      <li key={'toc-list-' + i + suffix}>
        <a href={'#' + section.props.anchor}>{section.props.line}</a>
        {children}
      </li>
    )
  } )
}

export default React.createClass({
  render() {
    return (
      <div className="component-table-of-contents" id="table-toc">
        <h2><Icon glyph="toc" small={true}/><span>Contents</span></h2>
        <div>
          <ul>
            { getListItems( this.props.sections ) }
          </ul>
        </div>
      </div>
    );
  }
} );
