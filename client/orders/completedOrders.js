Template.completedOrders.onCreated(function() {
    this.autorun(() => {
        this.subscribe("completedOrders");
    });

});

Template.completedOrders.helpers({
    completOrders: function() {
        return Orders.find({
            done: true
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
