import React from 'react'

import './styles.css'

export default React.createClass({
   render: function() {
     var cl = this.props.className ? this.props.className + ' hlist' : 'hlist';
     return (
       <ul className={ cl + ( this.props.isSeparated ? ' separated' : '')}>
         { this.props.children.map( function( child, i ){
           return <li key={'hlist-' + i}>{child}</li>;
         } ) }
       </ul>
     )
   }
 });
