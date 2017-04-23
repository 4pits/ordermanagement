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
