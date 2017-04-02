Meteor.publish("orders", function(argument) {
    var id = this.userId;
    if (Roles.userIsInRole(id, 'admin'))
        return Orders.find({
            done: false
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

Meteor.publish("completedOrders", function(argument) {
    var id = this.userId;
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

Meteor.publish("jobsRunning", function() {
    var d = new Date();
    d.setHours(d.getHours() - 20);
    var id = this.userId;
    if (Roles.userIsInRole(id, 'admin')) {
        return Jobs.find({
            done: false,
            deleted: false,
        });
    } else if (Roles.userIsInRole(id, 'seller')) {
        return Jobs.find({
            done: false,
            adderId: id,
            deleted: false
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

Meteor.publish("jobsCompletedRecently", function() {
    var id = this.userId;
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

Meteor.publish("jobsCompletedOld", function() {
    var dt = new Date();
    //    console.log('server date time: ' + dt);
    var id = this.userId;
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

Meteor.publish('allUsers', function() {
    if (Roles.userIsInRole(this.userId, 'admin'))
        return Meteor.users.find({}, {
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

Meteor.publish('orderJobs', function(id) {
    //    console.log(id + ' orderjobs');
    return Jobs.find({
        orderId: id,
        deleted: false
    });
});
