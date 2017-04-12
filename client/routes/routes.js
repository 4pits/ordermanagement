FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {
            main: "Home"
        });
    }
});
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

// Dashboard Page
FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Dashboard"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
// Dashboard Page
FlowRouter.route('/dashboard/:id', {
    name: 'user-dashboard',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Dashboard"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});

//user profile
FlowRouter.route('/profile/:id', {
    name: 'profile',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "profile"
            });
        } else {
            FlowRouter.go('/');
        }
    }
});
FlowRouter.route('/orders/:id', {
    name: 'orders-users',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Orders"
            });
        } else {
            FlowRouter.go('/');
        }
    }
});

FlowRouter.route('/orders', {
    name: 'orders',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Orders"
            });
        } else {
            FlowRouter.go('/');
        }
    }
});
FlowRouter.route('/order/:id', {
    name: 'order',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Order"
            });
        } else {
            FlowRouter.go('/');
        }
    }
});

FlowRouter.route('/completed-orders', {
    name: 'completd-orders',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "CompletedOrders"
            });
        } else {
            FlowRouter.go('/');
        }
    }
});
FlowRouter.route('/completed-orders/:id', {
    name: 'completd-orders-users',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "CompletedOrders"
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

var adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

adminRoutes.route('/users', {
    name: 'users',
    action() {
        if (Meteor.userId()) {
            BlazeLayout.render("AppLayout", {
                main: "Users"
            });
        } else {
            FlowRouter.go('/');
        }

    }
});
