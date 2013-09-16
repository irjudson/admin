/*global Ember */

var App = window.App = Ember.Application.create({
    rootElement: window.TESTING ? '#mocha' : '#app',
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

App.config = {
//    Nitrogen uses the following by default to connect to the service.   Modify these as necessary to point elsewhere.
// 
//    host: 'api.nitrogen.io',
//    http_port: 443,
//    protocol: 'https'
};

App.config.store = new nitrogen.HTML5Store(App.config);
App.service = new nitrogen.Service(App.config);

App.deferReadiness();

App.resetSession = function(err) {
    if (App.get('session')) {
        App.get('session').close();
    }

    App.set('flash', err.message || null);
    App.set('session', null);
    App.set('user', null);

    App.set('attemptedNavigation', window.location.hash);
    window.location = "/#/login";
};

App.sessionHandler = function(err, session, user) {
    App.advanceReadiness();

    if (err || !session || !user) return App.resetSession(err);

    App.set('flash', null);

    // save away the session for use in the ember application.
    App.set('session', session);
    App.set('user', App.Principal.create(user));

    if (App.get('attemptedNavigation')) {
        console.log('successful auth, reloading attempedNavigation url: ' + App.get('attemptedNavigation'));
        window.location = App.get('attemptedNavigation');
    }

    session.onAuthFailure(App.resetSession);
};

var user = new nitrogen.User({ nickname: 'user' });

App.set('attemptedNavigation', window.location.hash);
App.service.resume(user, App.sessionHandler);
