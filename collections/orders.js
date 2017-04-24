Orders = new Mongo.Collection("orders");

Orders.schema = new SimpleSchema({
    name: {
        type: String,
        label: "Buyer/Paypal Name",
        max: 100
    },
    paypalemail: {
        type: String,
        label: "Paypal Email",
        regEx: SimpleSchema.RegEx.Email,
        optional: true,
        max: 100
    },
    txnId: {
        type: String,
        label: "Paypal Transaction Id / Reciept No.",
        optional: true,
        max: 100
    },
    paidAmount: {
        type: Number,
        label: "Paid Amount in $(USD)",
        decimal: true,
        min: 5,
        optional: true
    },
    code: {
        type: String,
        label: "Your own invite code from Uber app",
        min: 4
    },
    source: {
        type: String,
        label: "Source",
        optional: true,
        max: 30,
        autoform: {
            omit: true,
            label: false
        }
    },
    rides: {
        type: Number,
        label: "# rides ordered",
        min: 1,
        max: 500
    },
    added: {
        type: Number,
        defaultValue: 0,
        label: "# rides added",
        optional: true,
        autoform: {
            omit: true,
            label: false
        }
    },
    runStatus: {
        type: Boolean,
        defaultValue: false,
        label: "Running status on blog",
        autoform: {
            omit: true,
            label: false
        }
    },
    comment: {
        type: String,
        label: "Comments",
        optional: true,
        defaultValue: 'Comments if any?',
        max: 1000,
        autoform: {
            rows: 3
        }
    },
    premium: {
        type: Boolean,
        defaultValue: false,
        label: "Premium Delivery"
    },
    done: {
        type: Boolean,
        defaultValue: false,
        optional: true,
        autoform: {
            omit: true,
            label: false
        }
    },
    pause: {
        type: Boolean,
        defaultValue: true,
        optional: true,
        autoform: {
            omit: true,
            label: false
        }
    },
    deleted: {
        type: Boolean,
        defaultValue: false,
        autoform: {
            omit: true,
            label: false
        }
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: new Date()
                };
            } else {
                this.unset(); // Prevent user from supplying their own value
            }
        },
        autoform: {
            omit: true,
            label: false
        }
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
        denyInsert: true,
        optional: true,
        autoform: {
            omit: true,
            label: false
        }
    },
    userId: {
        type: String,
        autoValue: function() {
            if (this.isInsert) {
                return this.userId;
            } else if (this.isUpsert) {
                return {
                    $setOnInsert: this.userId
                };
            } else {
                if (Roles.userIsInRole(this.userId, 'admin')) {
                    // allowing edit of user id
                } else {
                    this.unset(); // Prevent user from supplying their own value
                }

            }
        },
        autoform: {
            omit: true,
            label: false
        }
    }

});

Orders.attachSchema(Orders.schema);

var firstOrderUpdate = function(orderId) {
    var flag = 0;
    var userId = Orders.findOne({
        _id: orderId
    }).userId;
    var status = Meteor.users.findOne({
        _id: userId
    }).firstOrder;
    var count = Orders.find({
        userId: userId,
        pause: false
    }).count();
    if (count > 0) flag = 1;
    count = Orders.find({
        userId: userId,
        done: true
    }).count();
    if (count > 0) flag = 2;
    //  console.log('flag ' + flag);
    Meteor.users.update(userId, {
        $set: {
            firstOrder: flag
        }
    });
}

Meteor.methods({
    'updateRide': function(id, count) {
        //    console.log(id);
        var order = Orders.findOne({
            _id: id
        });
        //      console.log(order);
        if (order) {
            if (order.added === order.rides && count > 0) return;
            if (order.added === 0 && count < 0) return;
            if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
                return Orders.update({
                    _id: id
                }, {
                    $set: {
                        added: order.added + count,
                    }
                });
            }
        }
    },
    'pauseOrderToggle': function(id, flag) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Orders.update({
                _id: id
            }, {
                $set: {
                    pause: flag
                }
            });
            //        console.log(id);
            firstOrderUpdate(id);
        }
    },
    'resetOrder': function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Orders.update({
                _id: id
            }, {
                $set: {
                    added: 0,
                    pending: this.rides,
                    pause: true,
                    done: false
                }
            });
            firstOrderUpdate(id);
        }
    },
    'deleteOrderToggle': function(id, flag) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            //    console.log('deleting');
            Orders.update({
                _id: id
            }, {
                $set: {
                    deleted: flag
                }
            });
            firstOrderUpdate(id);
        }
    },
    'completeOrder': function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Orders.update({
                _id: id
            }, {
                $set: {
                    done: true

                }
            });
            firstOrderUpdate(id);
        }
    },
    'reassignOrderBuyer': function(buyerId, orderId) {
        //      console.log('assigning buyer');
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Orders.update({
                _id: orderId
            }, {
                $set: {
                    userId: buyerId
                }
            });
            firstOrderUpdate(orderId);
        }
    }

});;
