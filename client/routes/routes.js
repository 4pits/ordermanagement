FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {
            main: "Home"
        });
    }
});

// Home Page
FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action() {
        BlazeLayout.render("AppLayout", {
            main: "Dashboard"
        });
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


FlowRouter.route('/jobs', {
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
