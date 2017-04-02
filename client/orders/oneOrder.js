Template.oneOrder.onCreated(function() {

    var self = this;
    self.autorun(() => {
        var orderId = FlowRouter.getParam('id');
        self.subscribe("oneOrder", orderId);
        self.subscribe("orderJobs", orderId);
        self.subscribe("allUsers");
    });
});
Template.oneOrder.helpers({
    order: function() {
        return Orders.findOne({});
    },
    jobs: function() {
        return Jobs.find({}).count();
    },
    id: function() {
        return FlowRouter.getParam('id');
    },
    jobsList: function() {
        return Jobs.find({}, {
            sort: {
                createdAt: 1
            }
        });
    },
    addedBy: function() {

        return Meteor.users.findOne({
            _id: this.adderId
        }).emails[0].address;
    },
    buyers: function() {
        return Meteor.users.find({
            roles: 'buyer'
        });
    },
    email() {
        return this.emails[0].address;
    },
    fname() {
        return this.profile.firstName;
    },
    user(id) {
        return Meteor.users.findOne({
            _id: id
        }).emails[0].address;
        //  return user.emails[0].address + ' / ' + user.profile.firstName;
    }
});

Template.oneOrder.events({
    'click .assign-buyer': function() {
        var f = document.getElementById("buyer");
        var buyerId = "";
        if (f == null) return;
        else {
            buyerId = f.options[f.selectedIndex].value;
        }
        var orderId = Orders.findOne({})._id;
        Meteor.call('reassignOrderBuyer', buyerId, orderId, (error, result) => {});

    },
    'click .mark-completed': function() {
        var orderId = Orders.findOne({})._id;
        Meteor.call('completeOrder', orderId);
    },
    'click .remove-job' () {
        var orderId = Orders.findOne({})._id;
        Meteor.call('removeJob', this._id);
        if (this.done) {
            Meteor.call('updateRide', orderId, -1, (error) => {
                if (error) {
                    alert(error.error);
                }
            });
        }
    },
    'click .add-ride' () {
        var order = Orders.findOne({});
        var userId = Meteor.userId();
        console.log(userId);
        if (order.added < order.rides)
            Meteor.call('jobs.insert', order._id, order.code, 1, userId, (error, result) => {
                if (error) {
                    console.log('e ' + error);
                }
                if (result) {
                    Meteor.call('jobDone', result);
                    Meteor.call('updateRide', order._id, 1, (error) => {
                        if (error) {
                            alert(error.error);
                        }
                    });
                }
            });
    },
    'click .pause-toggle' () {
        var order = Orders.findOne({});
        Meteor.call('pauseOrderToggle', order._id, !order.pause);
    },
    'click .reset-ride' () {
        Meteor.call('resetOrder', this._id);
    },
    'click .delete-toggle' () {
        var order = Orders.findOne({});
        console.log(order.deleted);
        Meteor.call('deleteOrderToggle', order._id, !order.deleted);
    }
});
