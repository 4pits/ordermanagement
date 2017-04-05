Template.Users.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allUsers");
    });
    Session.set('newUserOnly', true);
    Session.set('allUsers', false);
    Session.set('sellers', false);
    Session.set('buyers', false);

});

Template.Users.helpers({
    users: function() {
        return Meteor.users.find({}, {
            sort: {
                createdAt: -1
            }
        });
    },
    usersCount: function() {
        return Meteor.users.find().count();
    },
    newUsers: function() {
        return Meteor.users.find({
            roles: {
                $nin: ['buyer', 'seller', 'admin']
            }
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    newUsersCount: function() {
        return Meteor.users.find({
            roles: {
                $nin: ['buyer', 'seller', 'admin']
            }
        }).count();
    },
    sellers: function() {
        return Meteor.users.find({
            roles: 'seller'
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    sellersCount: function() {
        return Meteor.users.find({
            roles: 'seller'
        }).count();
    },
    buyers: function() {
        return Meteor.users.find({
            roles: 'buyer'
        }, {
            sort: {
                createdAt: -1
            }
        });
    },
    buyersCount: function() {
        return Meteor.users.find({
            roles: 'buyer'
        }).count();
    },
    allUsers: function() {
        return Session.get('allUsers');
    },
    onlySeller: function() {
        return Session.get('sellers');
    },
    onlyBuyer: function() {
        return Session.get('buyers');
    },
    newUsersOnly: function() {
        return Session.get('newUserOnly');
    }

});

Template.Users.events({
    'click .all-user' () {
        Session.set('newUserOnly', false);
        Session.set('allUsers', true);
        Session.set('sellers', false);
        Session.set('buyers', false);
    },
    'click .only-seller' () {
        Session.set('newUserOnly', false);
        Session.set('allUsers', false);
        Session.set('sellers', true);
        Session.set('buyers', false);
    },
    'click .only-buyer' () {
        Session.set('newUserOnly', false);
        Session.set('allUsers', false);
        Session.set('sellers', false);
        Session.set('buyers', true);
    },
    'click .new-user' () {
        Session.set('newUserOnly', true);
        Session.set('allUsers', false);
        Session.set('sellers', false);
        Session.set('buyers', false);
    },

});

Template.user.helpers({
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
Template.user.events({
    'click .user_id': function() {
        //  console.log(this);
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
