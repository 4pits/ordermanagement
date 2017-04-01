Template.completedOrders.onCreated(function() {
    this.autorun(() => {
        this.subscribe("completedOrders");
    });

});

Template.completedOrders.helpers({
    allAddedOrders: function() {
        return Orders.find({
            done: false,
            $where: "this.rides === this.added"
        });
    },
    completOrders: function() {
        return Orders.find({
            done: true,
            $where: "this.rides === this.added"
        });
    },

    allAddedCount: function() {
        return Orders.find({
            done: false,
            $where: "this.rides === this.added"
        }).count();
    },
    markCompletedCount: function() {
        return Orders.find({
            done: true,
            $where: "this.rides === this.added"
        }).count();
    }
});

Template.completedOrders.events({
    'click .completed' () {
        if (!this.done) {
            Meteor.call('completeOrder', this._id, 1);
        }
    }
});

Template.completeOrder.helpers({
    pendingRides: function() {
        return this.rides - this.added;
    }
});
