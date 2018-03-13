import React from 'react';

import Overlay from './../Overlay';

import './styles.less';

const Toast = ( props ) => {
	return (
		<Overlay router={props.router} isDrawer="1" className="mw-notification">
			<div className="content">
				{props.children}
			</div>
		</Overlay>
	);
};

export default Toast;
