var $, Contacts;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
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
Contacts = (function() {
  __extends(Contacts, Spine.Controller);
  Contacts.prototype.elements = {
    ".show": "showEl",
    ".edit": "editEl",
    ".show .content": "showContent",
    ".edit .content": "editContent",
    "#views": "views",
    ".draggable": "draggable",
    '.showEditor': 'editorBtn',
    '.showAlbum': 'albumBtn',
    '.showUpload': 'uploadBtn',
    '.showGrid': 'gridBtn'
  };
  Contacts.prototype.events = {
    "click .optEdit": "edit",
    "click .optEmail": "email",
    "click .showEditor": "toggleEditor",
    "click .showAlbum": "toggleAlbum",
    "click .showUpload": "toggleUpload",
    "click .showGrid": "toggleGrid",
    "click .optDestroy": "destroy",
    "click .optSave": "save",
    "keydown": "saveOnEnter",
    'dblclick .draghandle': 'toggleDraghandle'
  };
  function Contacts() {
    this.saveOnEnter = __bind(this.saveOnEnter, this);    Contacts.__super__.constructor.apply(this, arguments);
    this.editEl.hide();
    Contact.bind("change", this.proxy(this.change));
    Spine.bind('save', this.proxy(this.save));
    Spine.bind("change", this.proxy(this.change));
    this.bind("toggle:view", this.proxy(this.toggleView));
    this.create = this.edit;
    $(this.views).queue("fx");
  }
  Contacts.prototype.change = function(item, mode) {
    if (!item.destroyed) {
      this.current = item;
      this.render();
      return typeof this[mode] === "function" ? this[mode](item) : void 0;
    }
  };
  Contacts.prototype.render = function() {
    this.showContent.html($("#contactTemplate").tmpl(this.current));
    this.editContent.html($("#editContactTemplate").tmpl(this.current));
    this.focusFirstInput(this.editEl);
    return this;
  };
  Contacts.prototype.focusFirstInput = function(el) {
    if (!el) {
      return;
    }
    if (el.is(':visible')) {
      $('input', el).first().focus().select();
    }
    return el;
  };
  Contacts.prototype.show = function(item) {
    return this.showEl.show(0, this.proxy(function() {
      return this.editEl.hide();
    }));
  };
  Contacts.prototype.edit = function(item) {
    return this.editEl.show(0, this.proxy(function() {
      this.showEl.hide();
      return this.focusFirstInput(this.editEl);
    }));
  };
  Contacts.prototype.destroy = function() {
    return this.current.destroy();
  };
  Contacts.prototype.email = function() {
    if (!this.current.email) {
      return;
    }
    return window.location = "mailto:" + this.current.email;
  };
  Contacts.prototype.renderViewControl = function(controller, controlEl) {
    var active;
    active = controller.isActive();
    return $(".options .view").each(function() {
      if (this === controlEl) {
        return $(this).toggleClass("active", active);
      } else {
        return $(this).removeClass("active");
      }
    });
  };
  Contacts.prototype.animateView = function() {
    var hasActive, height;
    hasActive = function() {
      var controller, _i, _len, _ref;
      _ref = App.hmanager.controllers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        controller = _ref[_i];
        if (controller.isActive()) {
          return App.hmanager.enableDrag();
        }
      }
      return App.hmanager.disableDrag();
    };
    height = function() {
      if (hasActive()) {
        return App.hmanager.currentDim + "px";
      } else {
        return "7px";
      }
    };
    return $(this.views).animate({
      height: height()
    }, 400);
  };
  Contacts.prototype.toggleEditor = function(e) {
    return this.trigger("toggle:view", App.editor, e.target);
  };
  Contacts.prototype.toggleAlbum = function(e) {
    return this.trigger("toggle:view", App.album, e.target);
  };
  Contacts.prototype.toggleUpload = function(e) {
    return this.trigger("toggle:view", App.upload, e.target);
  };
  Contacts.prototype.toggleGrid = function(e) {
    return this.trigger("toggle:view", App.grid, e.target);
  };
  Contacts.prototype.toggleView = function(controller, control) {
    var isActive;
    isActive = controller.isActive();
    if (isActive) {
      App.hmanager.trigger("change", false);
    } else {
      this.activeControl = $(control);
      App.hmanager.trigger("change", controller);
    }
    this.renderViewControl(controller, control);
    return this.animateView();
  };
  Contacts.prototype.toggleDraghandle = function() {
    return this.activeControl.click();
  };
  Contacts.prototype.save = function(el) {
    var atts;
    atts = (typeof el.serializeForm === "function" ? el.serializeForm() : void 0) || this.editEl.serializeForm();
    this.current.updateChangedAttributes(atts);
    return this.show();
  };
  Contacts.prototype.saveOnEnter = function(e) {
    if (e.keyCode !== 13) {
      return;
    }
    return Spine.trigger('save', this.editEl);
  };
  return Contacts;
})();
if (typeof module !== "undefined" && module !== null) {
  module.exports = Contacts;
}