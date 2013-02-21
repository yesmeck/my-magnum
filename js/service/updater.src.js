UpdaterService = o.Class({
	extend: Service,
	
	url: 'https://api.travis-ci.org/repos',

	getUrl: function (users) {
		users = '?owner_name[]='+users.join('&owner_name[]=');

		return this.url+users;
	},

	request: function (options) {
		var req, that = this;

		if (options.users.length) {
			$.getJSON(this.getUrl(options.users), function (projs) {
				projs = Projs.store(projs);
				
				Badge.update(projs);
				Notification.update(projs);

				updaterController.render();

				if (options.onComplete) {
					options.onComplete(projs);
				}
			});
		}
	},

	restart: function () {
		this.stop();
		this.start();
	},

	start: function () {
		var that = this,
			users = Prefs.getUsers(),
			interval = parseInt(Prefs.get('interval'), 10);

		if (users.length) {
			console.log( 'Updater started. Polling interval: '+interval+'s' );

			this.timer = setInterval(function () {
				that.request({users:Prefs.getUsers()});
			}, interval*1000); 
		}
	},

	stop: function () {
		console.log( 'Updater stopped.' );

		clearInterval(this.timer);
	}
});

Updater = new UpdaterService();