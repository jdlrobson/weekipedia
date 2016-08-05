import React from 'react'

import './styles.less'

export default React.createClass({
   render: function() {
     return (
       <ul className="link-list">
         {
           this.props.children.map( function( child, i ){
             return <li key={'link-list-' + i}>{child}</li>;
           } )
         }
       </ul>
     )
   }
 });
