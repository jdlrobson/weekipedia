import React from 'react'
import createReactClass from 'create-react-class'

import { Icon } from 'wikipedia-react-components'

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

export default createReactClass({
  render() {
    // FIXME: class `toc-mobile` is only added for consistency with MobileFrontend
    return (
      <details className="component-table-of-contents toc-mobile" id="table-toc">
          <summary>
            <Icon glyph="toc"/>
            <Icon glyph="arrow" className="chevron"/>
            <span>Contents</span>
          </summary>
          <div>
          <ul>
            { getListItems( this.props.sections ) }
          </ul>
          </div>
      </details>
    );
  }
} );
