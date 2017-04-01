Template.Users.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allUsers");
    });

});

Template.Users.helpers({
    users: function() {
        return Meteor.users.find({}, {
            sort: {
                createdAt: -1
            }
        });
    },
    userEmail: function() {
        return this.emails[0].address;
    },
    isAdmin: function() {
        return Roles.userIsInRole(this._id, 'admin');
    },
    isSeller: function() {
        return Roles.userIsInRole(this._id, 'seller');
    },
    isBuyer: function() {
        return Roles.userIsInRole(this._id, 'buyer');
    },
    isPremiumSeller: function() {
        return Roles.userIsInRole(this._id, 'premium-seller');
    },
    isTwoRideSeller: function() {
        return Roles.userIsInRole(this._id, 'two-ride-seller');
    },
    isTenRideSeller: function() {
        return Roles.userIsInRole(this._id, 'ten-ride-seller');
    },
    isTwentyRideSeller: function() {
        return Roles.userIsInRole(this._id, 'twenty-ride-seller');
    },

    dateFormat: function() {
        return moment(this.createdAt).format('MMMM D YYYY');
    }
});

Template.Users.events({
    'click .user_id': function() {
        console.log(this);
        Session.set('currentUser', this);
    },
    'click .toggle-seller': function() {
        Meteor.call('toggleSeller', this._id);
    },
    'click .toggle-premium-seller': function() {
        Meteor.call('togglePremiumSeller', this._id);
    },
    'click .toggle-2ride-seller': function() {
        Meteor.call('toggle2rideSeller', this._id);
    },
    'click .toggle-10ride-seller': function() {
        Meteor.call('toggle10rideSeller', this._id);
    },
    'click .toggle-20ride-seller': function() {
        Meteor.call('toggle20rideSeller', this._id);
    },
    'click .toggle-buyer': function() {
        Meteor.call('toggleBuyer', this._id);
    }
});
