Meteor.publish('allUsers', function(search) {
    check(search, Match.OneOf(String, null, undefined));
    let query = {};
    if (search) {
        let regex = new RegExp(search, 'i');

        query = {
            $or: [{
                    "emails.address": regex
                },
                {
                    "profile.firstName": regex
                }
            ]
        };
    }
    if (Roles.userIsInRole(this.userId, 'admin'))
        return Meteor.users.find(query, {
            sort: {
                createdAt: -1
            },
            fields: {
                emails: 1,
                roles: 1,
                profile: 1,
                createdAt: 1,
                userCode: 1,
                firstOrder: 1
            },
            limit: 5
        });
});

Meteor.publish('allBuyers', function(search) {
    check(search, Match.OneOf(String, null, undefined));
    let query = {};
    if (search) {
        let regex = new RegExp(search, 'i');

        query = {
            roles: 'buyer',
            $or: [{
                    "emails.address": regex
                },
                {
                    "profile.firstName": regex
                }
            ]
        };
    }
    if (Roles.userIsInRole(this.userId, 'admin')) {
        return Meteor.users.find(query, {
            sort: {
                createdAt: -1
            },
            fields: {
                emails: 1,
                roles: 1,
                profile: 1,
                createdAt: 1,
                userCode: 1,
                firstOrder: 1
            },
            limit: 5
        });
    }
});
Meteor.publish('jobAdders', function(orderId) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
        var ids = [];
        Jobs.find({
            orderId: orderId,
            deleted: false
        }).map(function(jb) {
            ids.push(jb.adderId);
        });
        ids.push(Orders.findOne({
            _id: orderId
        }).userId);
        var options = {
            fields: {
                emails: 1,
                profile: 1,
                createdAt: 1,
                roles: 1
            }
        };
        return Meteor.users.find({
            _id: {
                $in: ids
            }
        }, options);
    }
});


Meteor.publish('allSellers', function() {
    if (Roles.userIsInRole(this.userId, 'admin')) {
        var options = {
            fields: {
                emails: 1
            }
        };
        return Meteor.users.find({
            roles: 'seller'
        }, options);
    }
});

Meteor.publish('profile', function(id) {
    if (Roles.userIsInRole(id, 'buyer')) {
        var code = Meteor.users.findOne({
            _id: id
        }).userCode;
        //    console.log('in buyer');
        return Meteor.users.find({
            $or: [{
                    _id: id
                },
                {
                    "profile.refCodeBy": code
                }
            ]
        }, {
            fields: {
                emails: 1,
                roles: 1,
                profile: 1,
                createdAt: 1,
                userCode: 1,
                firstOrder: 1
            }
        });
    } else {
        return Meteor.users.find({
            _id: id
        }, {
            fields: {
                emails: 1,
                roles: 1,
                profile: 1,
                createdAt: 1,
                userCode: 1,
                firstOrder: 1
            }
        });
    }

});
