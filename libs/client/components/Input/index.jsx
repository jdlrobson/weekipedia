import React from 'react'

import './mediawiki-ui-input.css'

const Input = (props) => {
  var suffix = props.className ? ' ' + props.className : '';
  var inputProps = {
    className: 'mw-ui-input' + suffix,
    placeholder: props.placeholder,
    onInput: props.onInput,
    disabled: props.disabled,
    defaultValue: props.defaultValue
  };

  if ( props.textarea ) {
    return <textarea {...inputProps} />;
  } else {
    return <input {...inputProps} />
  }
}

export default Input
