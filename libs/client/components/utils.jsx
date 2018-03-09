export const withHijackedLinks = (WrapperComponents, hijackLinks) => {
  return class extends React.Component {
    componentDidMount(){
      hijackLinks( ReactDOM.findDOMNode( this ) );
    }
    componentDidUpdate(){
      hijackLinks( ReactDOM.findDOMNode( this ) );
    }
    render() {
      return <WrappedComponent {...this.props} />
    }
  };
};
