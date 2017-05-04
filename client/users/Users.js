Template.Users.onCreated(function() {
    this.searchQuery = new ReactiveVar();
    this.searching = new ReactiveVar(false);
    this.autorun(() => {
        this.subscribe("allUsers", this.searchQuery.get(), () => {
            setTimeout(() => {
                this.searching.set(false);
            }, 300);
        });
        this.subscribe("jobsUnpaid");
    });
});

Template.Users.helpers({
    searching: function() {
        if (this.searching) {
            return this.searching.get();
        }
        return false;
    },
    query: function() {
        if (this.searchQuery) {
            return this.searchQuery.get();
        }
        return '';
    },
    users: function() {
        return Meteor.users.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
});

Template.Users.events({
    'keyup [name="search"]' (event, template) {
        let value = event.target.value.trim();

        if (value !== '' && event.keyCode === 13) {
            template.searchQuery.set(value);
            template.searching.set(true);
        }

        if (value === '') {
            template.searchQuery.set(value);
        }
    }

});

Template.user.helpers({
    runningJobCount: function() {
        var count = 0;
        Jobs.find({
            adderId: this._id,
            done: false
        }).map(function(jb) {
            count = count + jb.count;
        });
        return count;
    },
    allAddedJobCount: function() {
        var count = 0;
        Jobs.find({
            adderId: this._id,
            done: true
        }).map(function(jb) {
            count = count + jb.count;
        });
        return count;
    },
    userPanel: function() {
        if (Roles.userIsInRole(this._id, 'seller')) {
            return 'panel-primary';
        } else if (Roles.userIsInRole(this._id, 'buyer')) {
            return 'panel-success';
        } else if (Roles.userIsInRole(this._id, 'admin')) {
            return 'panel-danger';
        } {
            return 'panel-default';
        }
    },
    userEmail: function() {
        return this.emails[0].address;
    },
    isNewUser: function() {
        return !Roles.userIsInRole(this._id, ['admin', 'seller', 'buyer']);
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
    },
    'click .delete-user': function() {
        console.log('delete user');
        Meteor.call('deleteUser', this._id);
    }
});
