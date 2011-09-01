var $, Details;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
if (typeof Spine !== "undefined" && Spine !== null) {
  Spine;
} else {
  Spine = require("spine");
};
$ = Spine.$;
Details = (function() {
  __extends(Details, Spine.Controller);
  Details.prototype.events = {
    "click .item": "click"
  };
  function Details() {
    Details.__super__.constructor.apply(this, arguments);
    this.bind("change", this.change);
  }
  return Details;
})();
if (typeof module !== "undefined" && module !== null) {
  module.exports = Details;
}