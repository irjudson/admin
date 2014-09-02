App.Principal = Ember.Object.extend(nitrogen.Principal.prototype);
App.Principal.reopen({
    hasTag: function(tag) {
        return this.get('tags').indexOf(tag) !== -1;
    },

    hasCamera: function() {
        return this.hasTag('executes:cameraCommand');
    }.property('tags'),

    hasSwitch: function() {
        return this.hasTag('executes:switchCommand');
    }.property('tags'),

    hasLight: function () {
        return this.hasTag('executes:lightCommand');
    }.property('tags'),

    isDevice: function() {
        return this.is('device');
    }.property('type'),

    isUser: function() {
        return this.is('user');
    }.property('type'),

    lastConnectionString: function() {
        var date = new Date(Date.parse(this.get('last_connection')));
        return date.toLocaleString();
    }.property('last_connection'),

    nameOrId: function() {
        return this.get('name') || this.get('id');
    }.property('id','name'),

    saveModel: function() {
        return App.saveWithDeferred(new nitrogen.Principal(this));
    }
});

App.Principal.reopenClass({
    find: function(query, options) {
        return App.findWithAdapter(query, options, nitrogen.Principal, App.Principal);
    },

    findById: function(id) {
        if (!id) return;

        return App.findByIdWithAdapter(id, nitrogen.Principal, App.Principal);
    }
});
