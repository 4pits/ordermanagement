Template.nav.events({
    "click .login-toggle": function(event, template) {
        Session.set("nav-login", "open");

    },
    'click .logout': () => {
        AccountsTemplates.logout();
    }
});

Template.nav.helpers({
    userEmail: function() {
        var user = Meteor.user().emails[0].address;
        return user && user.emails && user.emails[0].address;
    },
    userName: function() {
        var user = Meteor.user();
        return user && user.profile && user.profile.firstName;
    }
});;
