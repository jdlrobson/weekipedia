import React, { Component } from 'react'

import LanguageIcon from './../../components/LanguageIcon'
import EditIcon from './../../components/EditIcon'
import WatchIcon from './../../components/WatchIcon'

import HorizontalList from './../HorizontalList'

class PageActions extends Component {
  render(){
    var props = this.props;
    var actions = [
      <LanguageIcon key="article-page-action-language"
        showNotification={props.showNotification}
        disabled={props.disableLanguages} />
    ];

    if ( props.canAuthenticate ) {
      actions.push(<EditIcon {...props} key="page-action-edit" section={0}/>);
      actions.push(<WatchIcon {...props} key="page-action-watch"/>);
    }

    return (
      <HorizontalList className="page-actions" id={props.id}>
        {actions}
      </HorizontalList>
    )
  }
}
PageActions.defaultProps = {
  disableLanguages: true,
  canAuthenticate: false
};

export default PageActions
