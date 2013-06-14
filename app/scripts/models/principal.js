App.Principal = Ember.Object.extend({
    lastConnectionString: function() {
        var date = new Date(Date.parse(this.get('last_connection')));
        return date.toLocaleString();
    }.property('last_connection'),

    save: function() {
        return App.saveWithDeferred(new nitrogen.Principal(this));
    }
});

App.Principal.reopenClass({
    find: function(query, options) {
        return App.findWithAdapter(query, options, nitrogen.Principal, App.Principal);
    },
    findById: function(id) {
        return App.findByIdWithAdapter(id, nitrogen.Principal, App.Principal);
    }
});
