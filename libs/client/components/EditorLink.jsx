import React from 'react'

const EditorLink = (props) => {
  var url = "#/editor/" + props.section;
  if ( props.wikitext ) {  // see http://stackoverflow.com/questions/23223718/failed-to-execute-btoa-on-window-the-string-to-be-encoded-contains-characte
    url += '/' + btoa(unescape(encodeURIComponent(props.wikitext)));
  }
  var label = props.label || 'Edit original source';

  return props.session ? <a className="editor-link" href={url}>{label}</a> : <span />;
}

export default EditorLink;
