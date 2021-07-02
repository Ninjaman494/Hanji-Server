// (C) 2010 Dan Bravender - licensed under the AGPL 3.0
/*  Geulja is used to track modifications that have been made to
    characters. Currently, it keeps track of characters' original
    padchims (for ㄷ -> ㄹ irregulars) and if the character has
    no padchim but should be treated as if it does (for ㅅ
    irregulars). When substrings are extracted the Geulja class
    keeps these markers for the last character only.
*/
function Geulja(__value__) {
  this.length = (this.__value__ = __value__ || '').length;
  this.hidden_padchim = false;
  this.original_padchim = null;
  this.charAt = function () {
    let result = String.prototype.charAt.apply(this, arguments);
    if (arguments[0] == this.length - 1) {
      result = new Geulja(result);
      result.original_padchim = this.original_padchim;
      result.hidden_padchim = this.hidden_padchim;
    }
    return result;
  };
}

Geulja.prototype = new String();
Geulja.prototype.toString = function () {
  return this.__value__;
};

Geulja.prototype.valueOf = function () {
  return this.__value__;
};

exports.Geulja = Geulja;