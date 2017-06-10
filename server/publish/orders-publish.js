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

Meteor.publish('allOrders', function() {
    var user = this.userId;
    if (Roles.userIsInRole(user, 'admin')) {
        return Orders.find({});
    }
});
