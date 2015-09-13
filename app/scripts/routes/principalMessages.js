App.PrincipalMessagesRoute = App.MessagePagingRoute.extend({
    messagePageLimit: 25,

    baseUrl: function() {
        return "/#/principal/" + this.modelFor('principal').id  + "/messages";
    }.property(),

    activate: function() {
        setTimeout(function() { $('#principalMessagesTab').addClass('active'); }, 0);
    },

    deactivate: function() {
        setTimeout(function() { $('#principalMessagesTab').removeClass('active'); }, 0);
    },

    filter: function() {
        var principal = this.modelFor("principal");

        return {
            tags: 'involves:' + principal.id
            // $or: {
            //     from: principal.id,
            //     to: principal.id
            // }
        };
    },

    model: function(params) {
        if (!params.sort)
            params.sort = 'ts';

        if (!params.skip)
            params.skip = 0;

        if (!params.direction)
            params.direction = -1;

        this.set('params', params);

        return this.query(params);
    },

    query: function(params) {
        var sort = {};
        sort[params.sort] = parseInt(params.direction);

        return App.Message.find(this.filter(), {
            skip: parseInt(params.skip),
            limit: parseInt(this.get('messagePageLimit')),
            sort: sort
        });
    },

    /*,

    serialize: function() {
        var params = this.get('params');

        if (!params) {
            params = {
                skip: '0',
                sort: 'ts',
                direction: '1'
            }
        }

        return params;
    },
*/

    setupController: function(controller, model) {
        this._super(controller, model);

        var self = this;

        this.subscription = App.session.onMessage(this.filter(), function(nitrogenMessage) {
            self.query(self.get('params')).then(function(messages) {
                if (!self.isDestroyed) self.controller.set('content', messages);
            });
        });
    },

    actions: {
        willTransition: function(transition) {
            if (this.subscription) {
                var session = App.get('session');

                if (session) session.disconnectSubscription(this.subscription);
                this.subscription = null;
            }
        }
    }
});