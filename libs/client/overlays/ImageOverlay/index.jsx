import React from 'react';
import { observer, inject } from 'mobx-react';
import { Button, HorizontalList, IntermediateState, TruncatedText, Icon,
	ErrorBox } from 'wikipedia-react-components';

import './styles.less';

import Overlay from './../Overlay';

class ImageOverlay extends React.Component {
	constructor() {
		super();
		this.state = {
			width: window.innerWidth,
			height: window.innerHeight,
			images: null,
			img: null
		};
	}
	componentDidMount() {
		var self = this;
		var w = this.state.width;
		var props = this.props;
		var api = props.api;
		if ( w > 600 ) {
			w = 600;
		}

		this.loadGallery().then( ( media ) => {
			self.setState( { media: media } );
			api.fetch( api.getMwEndpoint(), {
				query: {
					titles: media.join( '|' ),
					prop: 'imageinfo',
					iiprop: 'url|extmetadata',
					iiurlwidth: w
				}
			} ).then( function ( data ) {
				var images = {};
				data.pages.forEach( function ( page ) {
					images[ page.title ] = page;
				} );
				self.setState( { images: images } );
				self.loadCurrentImage( props.image );
			} );
		} );
	}
	componentWillReceiveProps( newProps ) {
		this.loadCurrentImage( newProps.image );
	}
	loadCurrentImage( image ) {
		var imgData,
			self = this,
			fileData = this.state.images[ 'File:' + image.replace( /_/gi, ' ' ) ] || {};

		var img = new Image();
		function updateState() {
			self.setState( { img: imgData } );
		}

		if ( fileData.imageinfo ) {
			imgData = fileData.imageinfo[ 0 ];
			this.setState( { img: null } );

			img.addEventListener( 'load', updateState );
			img.addEventListener( 'complete', updateState );
			img.src = imgData.thumburl;
		} else {
			// If bad image is given jump to first image.
			this.setState( { error: true } );
		}
	}
	loadGallery() {
		var props = this.props;
		return props.api.getPage( props.title ).then( function ( page ) {
			return page.lead.media || [];
		} );
	}
	findImage( image, offset ) {
		return this.loadGallery().then( function ( media ) {
			var index = media.indexOf( 'File:' + image );
			var newIndex = index + offset;
			if ( newIndex < 0 ) {
				newIndex = media.length - 1;
			}
			if ( newIndex >= media.length ) {
				newIndex = 0;
			}
			return media[ newIndex ].replace( 'File:', '' );
		} );
	}
	previousImage() {
		this.findImage( this.props.image, -1 )
			.then( ( path ) => this.props.onLoadImage( path ) );
	}
	nextImage() {
		this.findImage( this.props.image, 1 )
			.then( ( path ) => this.props.onLoadImage( path ) );
	}
	render() {
		var content, footer, meta,
			leftGutter, rightGutter,
			props = this.props,
			licenseUrl = '', licenseName = '',
			description = '', artist = '',
			img = this.state.img;
		if ( img ) {
			var imgStyle = {
				maxHeight: this.state.height,
				maxWidth: this.state.width,
				width: 'auto',
				height: 'auto'
			};
			content = <img src={img.thumburl} style={imgStyle} />;
			if ( img.extmetadata ) {
				meta = img.extmetadata;
				artist = meta.Artist ? meta.Artist.value : null;
				description = meta.ImageDescription ? meta.ImageDescription.value : null;
				licenseName = meta.LicenseShortName ? meta.LicenseShortName.value : null;
				licenseUrl = meta.LicenseUrl ? meta.LicenseUrl.value : null;
			}

			footer = (
				<div className="details">
					<Button isPrimary="1" label="Details" href={props.fileUrl}/>
					<TruncatedText><p dangerouslySetInnerHTML={{ __html: description }}></p></TruncatedText>
					<HorizontalList isSeparated="1" className="license">
						<span dangerouslySetInnerHTML= {{ __html: artist }}></span>
						<a href={licenseUrl}>{licenseName}</a>
					</HorizontalList>
				</div>
			);
		} else {
			content = <IntermediateState />;
		}

		if ( this.state.media ) {
			leftGutter = (
				<div className="gutter">
					<Icon glyph="arrow-invert" onClick={this.previousImage.bind( this )} />
				</div>
			);
			rightGutter = (
				<div className="gutter">
					<Icon glyph="arrow-invert" onClick={this.nextImage.bind( this )}/>
				</div>
			);
		}
		if ( this.state.error ) {
			content = <ErrorBox msg="There was a problem displaying the image." />;
		}
		return (
			<Overlay isLightBox={true} onExit={props.onExit}>
				{leftGutter}
				<div className="image-wrapper">
					<div>{content}</div>
				</div>
				{footer}
				{rightGutter}
			</Overlay>
		);
	}
}

export default inject( ( { api, store }, { image } ) => (
	{
		fileUrl: store.getLocalUrl( 'File:' + image ),
		api
	}
) )(
	observer( ImageOverlay )
);
