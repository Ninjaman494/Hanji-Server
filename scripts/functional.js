if (!Array.prototype.forEach)
  Array.prototype.forEach = function(callback) {return _.each(this, callback)};
if (!Array.prototype.reduce)
  Array.prototype.reduce = function(callback) {return _.reduce(this, callback)};
