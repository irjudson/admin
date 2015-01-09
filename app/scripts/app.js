/*global Ember */

var App = window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

/* Order and include as you please. */
require('scripts/controllers/*');
require('scripts/controllers/user/*');
require('scripts/helpers/*');
require('scripts/models/*');
require('scripts/routes/*');
require('scripts/views/agents/*');
require('scripts/views/capabilities/*');
require('scripts/views/messages/*');
require('scripts/views/principals/*');

App.set('config', {
    host: 'localhost',
    http_port: 3030,
    protocol: 'http',

    api_key: 'admin',
    force_https: false,

    log_levels: ['info', 'warn', 'error']
});

request.log = {
    debug: function() {},
    info: function() {},
    error: function() {}
};

function getParam(name) {

    var queryIdx = window.location.href.lastIndexOf("?");
    if (queryIdx > -1) {
        var queryString = location.href.substr(queryIdx+1);
        var params = queryString.split('&');
        for (var idx=0; idx < params.length; idx++) {
            var components = params[idx].split('=');
            if (decodeURIComponent(components[0]) === name) {
                var value = "";
                for (var vidx=1; vidx < components.length; vidx++) {
                    if (vidx !== 1)
                        value += "=";
                    value += decodeURIComponent(components[vidx]);
                }
                return value;
            }
        }
    }

    return null;
}

function cleanUrl() {
    var queryIdx = window.location.hash.indexOf('?');
    var cleanedHash = window.location.hash.substr(0, queryIdx);

    window.history.pushState("", "Nitrogen", "/" + cleanedHash);
}

App.resetSession = function() {
    if (App.get('session')) {
        App.get('session').stop();
    }

    App.set('session', null);
    App.get('service').configure(App.get('user'), function(err, config) {
        if (err) return App.resetSession(err);

        App.set('config', config);

        var principal = getParam('principal');
        var accessToken = getParam('accessToken');

        if (!principal || !accessToken) {
            var redirectUrl = document.URL;
            if (App.get('config').force_https)
                redirectUrl = redirectUrl.replace('http://', 'https://');

            var impersonateRedirect = config.endpoints.users + "/impersonate" +
                "?redirect_uri=" + encodeURIComponent(redirectUrl) +
                "&api_key=" + encodeURIComponent(App.get('config').api_key);

            return window.location.replace(impersonateRedirect);
        }

        principal = JSON.parse(principal);
        principal.accessToken = accessToken = JSON.parse(accessToken);

        cleanUrl();

        App.set('user', new nitrogen.User(principal));

        App.set('service', new nitrogen.Service(App.get('config')));
        App.set('session', nitrogen.Session.startSession(App.get('service'), App.get('user'), accessToken));
        App.get('session').onAuthFailure(App.resetSession);

        App.advanceReadiness();
    });
};

App.set('service', new nitrogen.Service(App.get('config')));

// wait for user login and impersonation to complete
App.deferReadiness();

App.resetSession();
