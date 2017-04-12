Template.profile.onCreated(function() {
    this.autorun(() => {
        var userId = FlowRouter.getParam('id');
        this.subscribe("profile", userId);
        this.subscribe("jobsRunning", userId);
    });

});

Template.profile.helpers({
    isAdmin: function() {
        var userId = Meteor.userId();
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

    },
});
