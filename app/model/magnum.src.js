var MagnumAPISource = o.Class({
  extend: JSONSource,

  endpoint: 'https://magnum-ci.com/api/v1',

  get: function (path, token, onComplete) {
    url = this.endpoint + path + '?token=' + token;
    this._super(url, onComplete);
  },

  project: function (token, onComplete) {
    this.get('/project', token, onComplete)
  }
})

var MagnumAPI = new MagnumAPISource();
