/*globals ModelLocalStorage */

var PrefsModel = o.Class({
  extend: ModelLocalStorage,
  key: 'prefs',

  addToken: function (token) {
    var tokens = this.get('tokens');

		tokens = tokens || []

		if (tokens.indexOf(token) > -1) {
			return;
		}

		// Add to the front
		tokens.unshift(token.trim());

		this.set('tokens', tokens);
  },

  get: function (key) {
    var prefs = this._super() || {};

    return key? prefs[key]: prefs;
  },

  getTokens: function () {
    var tokens = this.get('tokens');

    return tokens || [];
  },

  removeUser: function (user) {
    var users = this.getUsers();

    users = users.filter(function (element) {
      return (element !== user);
    });

    this.set('users', users.join(','));
  },

  set: function (attrKey, attrValue) {
    var prefs = this.get();

    prefs[attrKey] = attrValue;

    this._super(prefs);
  }
});

var Prefs = new PrefsModel();
