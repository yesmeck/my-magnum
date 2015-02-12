/*globals Service, TravisAPI */

var UpdaterService = o.Class({
  extend: Service,

  exec: function (callback) {
    var that = this,
    tokens = Prefs.getTokens();

    var fetchProject = function(tokens, projects) {
      if (tokens.length > 0) {
        token = tokens.shift();
        MagnumAPI.project(token, function(project) {
          projects.push(project)
          fetchProject(tokens, projects)
        })
      } else {
        console.log(projects)
        Projs.set(projects)
        console.log('Request done!');
        that.client.pub('request-done');
        if (callback) {
          callback(projects);
        }
      }
    };

    fetchProject(tokens, []);
  },

  init: function () {
    this.client = new LiteMQ.Client();
    this._addBusListeners();
  },

  restart: function () {
    var that = this;

    this.stop();

    // Do a request right away!
    this.exec(function () {
      // Then begin the polling again
      that.start();
    });
  },

  start: function () {
    var tokens = Prefs.getTokens(),
        interval = parseInt(Prefs.get('intervalMin'), 10) || 1;

    if (tokens.length > 0) {
      this._createAlarm(interval);
    }
  },

  stop: function () {
    this._clearAlarm();
  },

  // private

  _addBusListeners: function () {
    var that = this;

    this.client.sub('background-document-ready', function () {
      that._addAlarmListeners();
      that.restart();
    })
    .sub('update-requested', function () {
      console.log(new Date());
      console.log('Requesting...');

      that.exec();
    })
    .sub(['form-prefs-submitted', 'form-token-submitted'], function () {
      that.restart();
      this.pub('form-submit-done');
    });
  },

  _addAlarmListeners: function () {
    var that = this;

    chrome.alarms.onAlarm.addListener(function (alarm) {
      if (alarm && alarm.name === 'magumapi') {
        console.log(new Date());
        console.log('Requesting...');

        that.exec();
      }
    });
  },

  _clearAlarm: function () {
    console.log('Updater stopped.');
    chrome.alarms.clear('magumapi');
  },

  _createAlarm: function (interval) {
    console.log('Updater started. Polling interval: '+interval+'min');
    chrome.alarms.create('magumapi', {periodInMinutes:interval});
  }
});

new UpdaterService();
