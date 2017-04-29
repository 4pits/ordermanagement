Template.oneOrder.onCreated(function() {
    var self = this;
    self.searchQuery = new ReactiveVar();
    self.searching = new ReactiveVar(false);
    self.autorun(() => {
        var orderId = FlowRouter.getParam('id');
        self.subscribe("oneOrder", orderId);
        self.subscribe("orderJobs", orderId);
        self.subscribe("jobAdders", orderId);
        self.subscribe("allBuyers", self.searchQuery.get(), () => {
            setTimeout(() => {
                self.searching.set(false);
            }, 300);
        });

    });
});
Template.oneOrder.helpers({
    searching: function() {
        if (this.searching) {
            return this.searching.get();
        }
        return false;
    },
    query: function() {
        if (this.searchQuery.get()) {

        }
        return '';
    },
    order: function() {
        return Orders.findOne({});
    },
    jobs: function() {
        return Jobs.find({}).count();
    },
    rideAdded: function() {
        return Orders.findOne({}).added > 0;
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
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    email() {
        return this.emails[0].address;
    },
    fname() {
        if (this.profile) {
            return this.profile.firstName;
        }
        return '';
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
        //    console.log(userId);
        if (order.added < order.rides)
            Meteor.call('jobs.insert', order._id, order.code, order.premium, 1, userId, (error, result) => {
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
        //  console.log(order.deleted);
        Meteor.call('deleteOrderToggle', order._id, !order.deleted);
    },
    'keyup [name="search"]' (event, template) {
        let value = event.target.value.trim();

        if (value !== '' && event.keyCode === 13) {
            template.searchQuery.set(value);
            template.searching.set(true);
        }

        if (value === '') {
            template.searchQuery.set(value);
        }
    }
});
