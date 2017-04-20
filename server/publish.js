Meteor.publish("orders", function(id) {
    if (Roles.userIsInRole(id, 'admin'))
        return Orders.find({
            done: false,
            deleted: false
        }, {
            fields: {
                paypalemail: 0,
                txnId: 0,
                paidAmount: 0,
                comment: 0
            }
        });
    else if (Roles.userIsInRole(id, 'buyer'))
        return Orders.find({
            userId: id,
            done: false,
            deleted: false
        }, {
            fields: {
                paypalemail: 0,
                txnId: 0,
                paidAmount: 0,
                comment: 0
            }
        });

});

Meteor.publish("completedOrders", function(id) {
    if (Roles.userIsInRole(id, 'admin'))
        return Orders.find({
            deleted: false,
            done: true
        }, {
            fields: {
                paypalemail: 0,
                txnId: 0,
                paidAmount: 0,
                comment: 0
            }
        });
    else if (Roles.userIsInRole(id, 'buyer'))
        return Orders.find({
            userId: id,
            deleted: false,
            done: true
        }, {
            fields: {
                paypalemail: 0,
                txnId: 0,
                paidAmount: 0,
                comment: 0
            }
        });

});

Meteor.publish("jobsRunning", function(userId) {
    if (Roles.userIsInRole(userId, 'admin')) {
        return Jobs.find({
            done: false,
            deleted: false,
        });
    } else if (Roles.userIsInRole(userId, 'seller')) {
        return Jobs.find({
            done: false,
            adderId: userId,
            deleted: false
        });
    }

});
Meteor.publish("jobsDeleted", function(userId) {
    var dt = new Date();
    dt.setDate(dt.getDate() - 2);
    if (Roles.userIsInRole(userId, 'admin')) {
        return Jobs.find({
            deleted: true,
            createdAt: {
                $gte: dt
            }
        });
    } else if (Roles.userIsInRole(userId, 'seller')) {
        return Jobs.find({
            adderId: userId,
            deleted: true,
            createdAt: {
                $gte: dt
            }
        });
    }

});


var yesterday = function() {
    var yd = new Date();
    yd.setHours(0);
    yd.setMinutes(0);
    yd.setSeconds(0);
    yd.setDate(yd.getDate() - 2);
    return yd;
};

Meteor.publish("jobsCompletedRecently", function(id) {
    if (Roles.userIsInRole(id, 'admin')) {
        return Jobs.find({
            done: true,
            deleted: false,
            createdAt: {
                $gte: yesterday()
            }
        });
    } else if (Roles.userIsInRole(id, 'seller')) {
        return Jobs.find({
            adderId: id,
            done: true,
            deleted: false,
            createdAt: {
                $gte: yesterday()
            }
        });
    }

});

Meteor.publish("jobsCompletedOld", function(id) {
    //    console.log('server date time: ' + dt);
    if (Roles.userIsInRole(id, 'admin')) {
        return Jobs.find({
            done: true,
            deleted: false,
            createdAt: {
                $lt: yesterday()
            }
        });
    } else if (Roles.userIsInRole(id, 'seller')) {
        return Jobs.find({
            adderId: id,
            done: true,
            deleted: false,
            createdAt: {
                $lt: yesterday()
            }
        });
    }
});

Meteor.publish('allUsers', function(search) {
    check(search, Match.OneOf(String, null, undefined));
    let query = {};
    console.log(search);
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
            fields: {
                emails: 1,
                roles: 1,
                profile: 1,
                createdAt: 1
            }
        });
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
    return Meteor.users.find({
        _id: id
    });

});



Meteor.publish('oneOrder', function(id) {
    //    console.log(id + ' oneorder');
    var user = this.userId;
    if (Roles.userIsInRole(user, 'admin')) {
        return Orders.find({
            _id: id
            //        deleted: false
        });
    } else if (Roles.userIsInRole(user, 'buyer')) {
        return Orders.find({
            _id: id,
            userId: user,
            deleted: false
        });
    }
});
// display counts for each user
Meteor.publish('jobsUnpaid', function() {
    var user = this.userId;
    if (Roles.userIsInRole(user, 'admin')) {
        return Jobs.find({
            paid: false,
            deleted: false
        });
    }
});

//jobs related to only one order
Meteor.publish('orderJobs', function(id) {
    //    console.log(id + ' orderjobs');
    return Jobs.find({
        orderId: id,
        deleted: false
    });
});
