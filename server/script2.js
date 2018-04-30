var FB = require('fb'),
    FB = new FB.Facebook();
    FB.extend({appId: '190967484850064', appSecret: '80c7f70ef7a8e482a75dae4db3a875cf'})
    FB.setAccessToken('EAACtrxUZAH5ABAJpvwr4IgHlaGDNE4anfhs6ZB2fZApWE99eNClvfBLV95Ow37SS0na1ju6tq0lq0uIWyZAH7sZCEqjXL3dFoyhjVYVZChIJFf0W73ZCIzirDu90X1hRcxjk3CQWy6N5Vlq91bdNhBZCODHeIAchkCiLm4Ry2SGXaQZDZD');

var body = 'oslac';
FB.api('me/feed', 'post', { message: body }, function (res) {
  if(!res || res.error) {
    console.log(!res ? 'error occurred' : res.error);
    return;
  }
  console.log('Post Id: ' + res.id);
});
