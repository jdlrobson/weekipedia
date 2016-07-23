import React from 'react'

import './styles.css'

export default React.createClass({
   render: function() {
     return (
       <ul className={'hlist' + ( this.props.isSeparated ? ' separated' : '')}>
         { this.props.children.map( function( child, i ){
           return <li key={'hlist-' + i}>{child}</li>;
         } ) }
       </ul>
     )
   }
 });
