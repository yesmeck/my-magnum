/*globals ModelLocalStorage */

var PrefsModel = o.Class({
	extend: ModelLocalStorage,
	key: 'prefs',

	addUser: function (user) {
		var users = this.get('users');

		users = users || [];

		if (users.indexOf(user) > -1) {
			return;
		}

		// Add to the front
		users.unshift(user);

		this.set('users', users);
	},

	get: function (key) {
		var prefs = this._super() || {};

		return key? prefs[key]: prefs;
	},

	getUsers: function () {
		var users = this.get('users');

    return [];
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
