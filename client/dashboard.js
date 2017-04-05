Template.dashboard.onCreated(function() {
    this.autorun(() => {
        this.subscribe("jobsCount");
        this.subscribe("ordersCount");
        this.subscribe("userCount");
    });

});

Template.dashboard.helpers({
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
    }
});
