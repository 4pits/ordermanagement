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
    orderDetailsId: function() {
        return Session.get('orderDetailsId');
    },
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

    }
});
