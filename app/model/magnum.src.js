var MagnumAPISource = o.Class({
  extend: JSONSource,

  endpoint: 'https://magnum-ci.com/api/v1',

  get: function (path, token, onComplete) {
    url = this.endpoint + path + '?api_key=' + token;
    this._super(url, onComplete);
  },

  profile: function (token, onComplete) {
    this.get('/profile', token, onComplete)
  }
})

var MagnumAPI = new MagnumAPISource();
