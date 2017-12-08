function TrendEvaluator( options ) {
  this.options = options;
}

TrendEvaluator.prototype = {
  mightTrend: function ( item ) {
    var age = item.age();
    return age > this.options.minAge && item.edits > ( this.options.minEdits / 2 ) &&
      age < this.options.maxAge;
  },
  isTrending: function ( item ) {
    return !item.views && !item.volatileFlags && this.mightTrend( item ) && item.contributors.length >= this.options.minContributors && item.anonEdits >= this.options.minAnonEdits &&
      item.edits > this.options.minEdits &&
      ( item.anonEdits === 0 || ( item.anonEdits / item.edits ) < this.options.maxAnonEditRatio ) &&
      item.editsPerMinute() > this.options.minSpeed && item.getBias() <= this.options.maxBias;
  }
};

export default TrendEvaluator
