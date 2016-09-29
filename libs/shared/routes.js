import Content from './../client/containers/Content'
import ErrorBox from './../client/components/ErrorBox'

var routes = [
  // 404
  [
    /(.*)/,
    function ( info, props ) {
      return Object.assign( {}, props, {
        title: '404 - Page Not Found',
        children: Content( { children:
          ErrorBox( { msg: 'The path ' + info[1] + ' is not the path you are looking for.' } )
        } )
      } )
    }
  ],
  // no fragment
  [
    /^#(.*)/,
    function () {
      return {}
    }
  ]
];

export default routes;
