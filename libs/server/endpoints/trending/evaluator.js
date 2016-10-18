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
    return this.mightTrend( item ) && item.contributors.length >= this.options.minContributors &&
      item.edits > this.options.minEdits &&
      item.editsPerMinute() > this.options.minSpeed && item.getBias() <= this.options.maxBias;
  }
};

export default TrendEvaluator
