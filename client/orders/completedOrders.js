Template.completedOrders.onCreated(function() {
    this.autorun(() => {
        var id = FlowRouter.getParam('id');
        if (!id) id = Meteor.userId();
        this.subscribe("completedOrders", id);
    });

});

Template.completedOrders.helpers({
    completOrders: function() {
        return Orders.find({
            done: true
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    markCompletedCount: function() {
        return Orders.find({
            done: true
        }).count();
    }
});

Template.completedOrders.events({
    'click .completed' () {
        if (!this.done) {
            Meteor.call('completeOrder', this._id);
        }
    }
});

Template.completeOrder.helpers({
    pendingRides: function() {
        return this.rides - this.added;
    }
});
