import React from 'react'

import Article from './Article'

// Pages
export default React.createClass({
  getDefaultProps: function () {
    return {
      api: null,
      lang: 'en'
    };
  },
  getInitialState() {
    return {
      error: false,
      cards: null
    };
  },
  componentDidMount() {
    this.setState( { jsEnabled: true } );
  },
  render(){
    var quote = "Twenty years from now you will be more disappointed by the things that you didn't do than by the ones you did do. So throw off the bowlines. Sail away from the safe harbor. Catch the trade winds in your sails. Explore. Dream. Discover.";
    var lang = this.props.lang;
    var body = [
      <blockquote key="home-quote">{quote} <span className="author">Mark Twain</span></blockquote>
    ];
    var searchUrl, exploreUrl;
    if ( this.state.jsEnabled ) {
      searchUrl = "#/search";
      exploreUrl = "#/explore/";
    }
    var tagline = (<span>Where do you want to go today? <a href={searchUrl}>Search</a>, click the <a href={exploreUrl}>map</a> or get some <a href={'/' + lang + '/wiki/Special:Random'}>random inspiration</a>.</span>)

    var lead = {
      maplink: exploreUrl,
      coordinates: { zoom: 1, lat: 0, lon: 0 }
    };
    return (
      <Article {...this.props} body={body} isBannerEnabled={true}
        lead={lead}
        title='Nomad' tagline={tagline} />
    )
  }
})

