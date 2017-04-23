FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {
            main: "Home"
        });
    }
});
FlowRouter.route('/sign-up', {
    name: 'sign-up',
    action() {
        BlazeLayout.render("HomeLayout", {
            main: "SignUp"
        });
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
//user profile
FlowRouter.route('/profile', {
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

FlowRouter.route('/profile/:id', {
    name: 'profile-user',
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
