"use strict";

var request   = require("request");
var qstring   = require("qs");
var twit      = {};

twit.signInUser = function(req, res, callback){
  var url = "https://api.twitter.com/oauth/request_token";
  var oauth = {
    callback:         process.env.t_callback_url,
    consumer_key:     process.env.t_consumer_key,
    consumer_secret:  process.env.t_consumer_secret
  }
  request.post({url: url, oauth: oauth}, function(e, response){
    var url       = "https://api.twitter.com/oauth/authenticate?";
    var auth_data = qstring.parse(response.body);
    req.session.t_oauth_token         = auth_data.oauth_token;
    req.session.t_oauth_token_secret  = auth_data.oauth_token_secret;
    callback(url + qstring.stringify({oauth_token: auth_data.oauth_token}));
  });
}

twit.whenSignedIn = function(req, res, callback){
  var auth_data = qstring.parse(req.body);
  var url = "https://api.twitter.com/oauth/access_token";
  var oauth = {
    consumer_key:     process.env.t_consumer_key,
    consumer_secret:  process.env.t_consumer_secret,
    token:            req.session.t_oauth_token,
    token_secret:     req.session.t_oauth_token_secret,
    verifier:         req.query.oauth_verifier
  }
  request.post({url: url, oauth: oauth}, function(e, response){
    var auth_data = qstring.parse(response.body);
    req.session.t_oauth_token = auth_data.oauth_token;
    req.session.t_oauth_token_secret = auth_data.oauth_token_secret;
    req.session.t_user_id = auth_data.user_id;
    req.session.t_screen_name = auth_data.screen_name;
    callback();
  });
}

twit.getAuthData = function(req, res, callback){
  var oauth = {
    consumer_key:     process.env.t_consumer_key,
    consumer_secret:  process.env.t_consumer_secret,
    token:            req.session.t_oauth_token,
    token_secret:     req.session.t_oauth_token_secret
  }
  callback(oauth);
}

module.exports = twit;
