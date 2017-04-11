Sellers = new Mongo.Collection("sellers");

Sellers.schema = new SimpleSchema({
    userId: {
        type: String
    },
    limit: {
        type: Number
    },
    perDayLimit: {
        type: Number
    },
    ratePerRide: {
        type: Number
    }
});

Sellers.attachSchema(Sellers.schema);

Sellers.allow({
    insert: function() {
        return false;
    },
    update: function() {
        return false;
    },
    remove: function() {
        return false;
    }
});

Sellers.deny({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});

Meteor.methods({
    "seller.insert.update": function(userId, limit, perDayLimit, rate) {
        var seller = Sellers.findOne({
            userId: userId
        });
        console.log(seller);
        if (seller) {
            Sellers.update({
                userId: userId
            }, {
                $set: {
                    limit: limit,
                    perDayLimit: perDayLimit,
                    rate: rate
                }
            })
        } else {
            Sellers.insert({
                userId: userId,
                limit: limit,
                perDayLimit: perDayLimit,
                rate: rate
            });
        }
    }
});
