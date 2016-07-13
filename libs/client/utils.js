var utils = {
  getAbsoluteUrl: function ( title, lang, project ) {
    lang = lang || 'en';
    project = project || 'm.wikipedia.org';
    return '//' + lang + '.' + project + '/wiki/' + title;
  }
};

export default utils