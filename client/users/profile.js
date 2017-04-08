Template.profile.onCreated(function() {
    this.autorun(() => {
        var userId = FlowRouter.getParam('id');
        this.subscribe("profile", userId);
        this.subscribe("jobsRunning", userId);
    });

});

Template.profile.helpers({
    isAdmin: function() {
        var userId = FlowRouter.getParam('id');
        console.log(userId);
        return Roles.userIsInRole(userId, 'admin');
    },
    isSeller: function() {
        var userId = FlowRouter.getParam('id');
        return Roles.userIsInRole(userId, 'seller');
    },
    isBuyer: function() {
        var userId = FlowRouter.getParam('id');
        return Roles.userIsInRole(userId, 'buyer');
    },
    id: function() {
        return FlowRouter.getParam('id');
    },
    jobCount: function() {
        var total = 0;
        Jobs.find({
            done: false
        }).map(function(doc) {
            total += doc.count;
        });
        return total;
    }

});
