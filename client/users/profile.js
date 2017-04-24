Template.profile.onCreated(function() {
    this.autorun(() => {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        this.subscribe("profile", userId);
        this.subscribe("jobsRunning", userId);
    });

});

Template.profile.helpers({
    loggedInUserIsAdmin: function() {
        var userId = Meteor.userId();
        return Roles.userIsInRole(userId, 'admin');
    },
    isAdmin: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, 'admin');
    },
    isSeller: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, ['admin', 'seller']);
    },
    isBuyer: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, ['admin', 'buyer']);
    },
    id: function() {
        return FlowRouter.getParam('id');
    },
    name: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Meteor.users.findOne({
            _id: userId
        }).profile.firstName;
    },
    email: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Meteor.users.findOne({
            _id: userId
        }).emails[0].address;
    },
    jobCount: function() {
        var total = 0;
        Jobs.find({
            done: false
        }).map(function(doc) {
            total += doc.count;
        });
        return total;
    },
    userCode: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        console.log('id :' + userId);
        var user = Meteor.users.findOne({
            _id: userId
        });
        console.log(user);
        return user.userCode;
    },
    users: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Meteor.users.find({
            _id: {
                $ne: userId
            }
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    availableCredits: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        var count = Meteor.users.find({
            _id: {
                $ne: userId
            },
            firstOrder: 2
        }).count();
        return count * 2;
    },
    upcomingCredits: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        var count = Meteor.users.find({
            _id: {
                $ne: userId
            },
            firstOrder: {
                $lt: 2
            }
        }).count();
        return count * 2;
    }

});

Template.profile.events({
    'submit .form-inline-seller-details' (event) {
        event.preventDefault();
        const target = event.target;
        const limit = target.limit.value;
        const perdaylimit = target.perdaylimit.value;
        const rate = target.rate.value;
        console.log(limit);
        console.log(perdaylimit);
        console.log(rate);
        const id = FlowRouter.getParam('id');
        console.log(id);
        if (limit > 1 && perdaylimit > 5 && rate > 20 && rate < 60) {
            Meteor.call('seller.insert.update', id, limit, perdaylimit, rate, (error, result) => {
                //  if (error) console.error(error);
                //  if (result) console.log(result);
            });
        } else {
            console.warn("Input incorrect");
        }

    }
});

Template.refUser.helpers({
    userEmail: function() {
        return this.emails[0].address;
    },
    admin: function() {
        return Roles.userIsInRole(this._id, 'admin');
    },
    firstOrderStatus: function() {
        var user = Meteor.users.findOne({
            _id: this._id
        });
        if (user.firstOrder === 0) {
            return 'panel-default';
        } else if (user.firstOrder === 1) {
            return 'panel-primary';
        } else if (user.firstOrder === 2) {
            return 'panel-success';
        } else {
            return 'panel-danger';
        }
    },
    firstOrderMsg: function() {
        var user = Meteor.users.findOne({
            _id: this._id
        });
        if (user.firstOrder === 0) {
            return 'User signed - up, yet to place their first order. ';
        } else if (user.firstOrder === 1) {
            return 'User placed first order, as soon as its completed you will get your credits.';
        } else if (user.firstOrder === 2) {
            return 'First order completed, you got your credits.';
        } else {
            return 'This should not happen, report it to admin';
        }
    }

});
