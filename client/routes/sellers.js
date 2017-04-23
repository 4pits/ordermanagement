FlowRouter.route('/deletedjobs', {
    name: 'deletedjobs',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "DeletedJobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
FlowRouter.route('/deletedjobs/:id', {
    name: 'deletedjobs-user',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "DeletedJobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});

FlowRouter.route('/jobs/:id', {
    name: 'jobs',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Jobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
FlowRouter.route('/jobs', {
    name: 'jobs-user',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Jobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});

FlowRouter.route('/completed-jobs', {
    name: 'completed-jobs',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "CompletedJobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
FlowRouter.route('/completed-jobs/:id', {
    name: 'completed-jobs-users',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "CompletedJobs"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
