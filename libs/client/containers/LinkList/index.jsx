import React from 'react'

import './styles.less'

export default React.createClass({
   render: function() {
     var className = this.props.className ? this.props.className + ' ' : '';
     className += 'link-list';
     return (
       <ul className={className}>
         {
           this.props.children.map( function( child, i ){
             return <li key={'link-list-' + i}>{child}</li>;
           } )
         }
       </ul>
     )
   }
 });
