Template.ListUsers.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allSellers");

    });
});

Template.ListUsers.helpers({
    allUsers() {
        return Meteor.users.find({});
    },
    email() {
        return this.emails[0].address;
    },

});
