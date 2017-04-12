Template.DeletedJobs.onCreated(function() {
    this.autorun(() => {
        var id = FlowRouter.getParam('id');
        if (!id) id = Meteor.userId();
        this.subscribe("jobsDeleted", id);
        this.subscribe("allSellers");
    });
});

Template.DeletedJobs.helpers({
    deletedJobs: function() {
        return Jobs.find({}, {
            sort: {
                createdAt: -1
            }
        });
    },
    deletedCount: function() {
        var count = 0;
        Jobs.find().map(function(jb) {
            count = count + jb.count;
        });
        return count;
    },
    id: function() {
        return FlowRouter.getParam('id');
    },
    addedBy: function() {
        console.log('adderId ' + this.adderId);
        return Meteor.users.findOne({
            _id: this.adderId
        }).emails[0].address;
    }
});
