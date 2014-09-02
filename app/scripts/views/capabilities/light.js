App.LightCapabilityView = Em.View.extend({
    templateName: 'capabilities/light',

    actions: {
        sendOn: function () {
            var self = this;
            var lightId = this.get('principal.id');

            var command = new nitrogen.Message({
                to: lightId,
                type: 'lightCommand',
                tags: [nitrogen.CommandManager.commandTag(lightId)],
                body: {
                    brightness: 1.0
                }
            });

            command.send(App.session, function (err, messages) {
                if (err) console.log('sending command failed: ' + err);
            });
        },

        sendOff: function () {
            var self = this;
            var lightId = this.get('principal.id');

            var command = new nitrogen.Message({
                to: lightId,
                type: 'lightCommand',
                tags: [nitrogen.CommandManager.commandTag(lightId)],
                body: {
                    brightness: 0.0
                }
            });

            command.send(App.session, function (err, messages) {
                if (err) console.log('sending command failed: ' + err);
            });
        },

        sendFlash: function () {
            var self = this;
            var lightId = this.get('principal.id');

            var command = new nitrogen.Message({
                to: lightId,
                type: 'lightCommand',
                tags: [nitrogen.CommandManager.commandTag(lightId)],
                body: {
                    brightness: 0.5,
                    frequency: 50
                }
            });

            command.send(App.session, function (err, messages) {
                if (err) console.log('sending command failed: ' + err);
            });
        },
    },

    commands: function() {

        var ret = Em.A();
        if (!this.LightManager) return Em.A([]);

        this.LightManager.messageQueue.forEach(function(message) {
            ret.pushObject(message);
        });

        return ret;
    }.property('invalidation'),

    invalidation: null,

    init: function() {
       // this.LightManager = new nitrogen.LightManager(this.get('principal'));
       // var self = this;

       // this.LightManager.start(App.session, function(err, message) {
        //    if (!self.isDestroyed) self.set('invalidation', new Date());
       // });
    }
});
