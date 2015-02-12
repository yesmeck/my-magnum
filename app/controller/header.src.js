/*globals DOMController */

var HeaderController = o.Class({
  extend: DOMController,
  dom: 'header',

  init: function (opt) {
    this._super(opt);
    this.client = new LiteMQ.Client({name: 'HeaderController'});
    this._addBusListeners();
  },

  // private

  _addBusListeners: function () {
    var that = this;

    this.client.sub('popup-window-load', function () {
      that._addListeners();
    })
    .sub('form-prefs-submitted', function () {
      that.el('button#open-prefs').focus();
    })
    .sub('form-token-submitted', function () {
      that.el('button#open-projects').focus();
    });
  },

  _addListeners: function () {
    var that = this;

    this.el().on('click', 'button#open-projects', function () {
      that.client.pub('button-open-projects-pressed');
    })
    .on('click', 'button#open-prefs', function () {
      that.client.pub('button-open-prefs-pressed');
    });
  }
});

new HeaderController();
