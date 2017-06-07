Template.dashboard.onCreated(function() {
    this.autorun(() => {
        var d = new Date();
        d.setHours(0);
        d.setMinutes(0);
        d.setSeconds(0);

        var yd = new Date();
        yd.setHours(0);
        yd.setMinutes(0);
        yd.setSeconds(0);
        yd.setDate(yd.getDate() - 1);

        var id = FlowRouter.getParam('id');
        if (!id) id = Meteor.userId();
        this.subscribe("jobsCount", id);
        this.subscribe("ordersCount", id, d, yd);
        this.subscribe("userCount", id);
        this.subscribe("profile", id);
    });

});

Template.dashboard.helpers({
    isOnlyAdmin: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, 'admin');
    },
    isAdminOrSeller: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, ['seller', 'admin']);
    },
    isAdminOrBuyer: function() {
        var userId = FlowRouter.getParam('id');
        if (!userId) userId = Meteor.userId();
        return Roles.userIsInRole(userId, ['admin', 'buyer']);
    },

    id: function() {
        var id = FlowRouter.getParam('id');
        if (!id) id = Meteor.userId();

        return id;
    },
    jobs: function() {
        return Counts.get('jobsC');
    },
    orders: function() {
        return Counts.get('ordersC');
    },
    jobsDone: function() {
        return Counts.get('jobsDone');
    },
    jobsRunning: function() {
        return Counts.get('jobsRunning');
    },
    jobsPaid: function() {
        return Counts.get('jobsPaid');
    },
    jobsUnpaid: function() {
        return Counts.get('jobsUnpaid');
    },
    allRidesCount: function() {
        return Counts.get('allRidesCount');
    },
    allAddedCount: function() {
        return Counts.get('allAddedCount');
    },
    pendingRidesAll: function() {
        return Counts.get('allRidesCount') - Counts.get('allAddedCount');
    },
    buyersCount: function() {
        return Counts.get('buyersCount');
    },
    sellersCount: function() {
        return Counts.get('sellersCount');
    },
    usersCount: function() {
        return Counts.get('usersCount');
    },
    newUsersCount: function() {
        return Counts.get('usersCount') - Counts.get('sellersCount') - Counts.get('buyersCount');
    },
    newRidesCount: function() {
        return Counts.get('todayRidesCount');
    },
    yesterdayRidesCount: function() {
        return Counts.get('yesterdayRidesCount');
    },
    random: function() {
        return (Math.random() + 1).toString(36).substring(2, 7);
    }
});

Template.dashboard.events({
    'click .email-send-test': function() {
        Meteor.call('sendEmail',
            'alice@example.com',
            'bob@example.com',
            'Hello from Meteor!',
            'This is a test of Email.send.');
    },
    'click .updateDB': function() {
        Meteor.call('updateDB');
    },
    'click .gitpull': function() {
        Meteor.call('gitPull');
    },
    'click .update_ref': function() {
        Meteor.call('updateUsersRef');
    }
});
