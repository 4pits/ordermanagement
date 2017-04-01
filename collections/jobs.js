Jobs = new Mongo.Collection("jobs");
Jobs.allow({
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

Jobs.deny({
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

Jobs.schema = new SimpleSchema({

    orderId: {
        type: String
    },
    code: {
        type: String
    },
    count: {
        type: Number,
        max: 4
    },
    done: {
        type: Boolean,
        defaultValue: false
    },
    paid: {
        type: Boolean,
        defaultValue: false
    },
    deleted: {
        type: Boolean,
        defaultValue: false
    },
    adderId: {
        type: String
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
    },
    userId: {
        type: String,
        autoValue: function() {
            return this.userId
        }
    }
});

Jobs.attachSchema(Jobs.schema);
var today = function() {
    var d = new Date();
    d.setDate(d.getDate() - 1);
    d.setMinutes(0);
    d.setSeconds(0);
    return d;
};


Meteor.methods({
    'jobs.insert': function(id, code, count, adderId) {
        //avoid repeatition of code to same seller
        var countJ = Jobs.find({
            adderId: adderId,
            code: code,
            createdAt: {
                $gte: today()
            }
        }).count();
        if (countJ === 0 && Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
            return Jobs.insert({
                orderId: id,
                code: code,
                count: count,
                adderId: adderId
            }, function(error, result) {
                //    if (error) console.log('jobs insert log' + error);
                //    if (result) console.log('jobs insert result' + result);
            });
        }
    },
    'jobDone': function(id) {
        if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
            Jobs.update({
                _id: id
            }, {
                $set: {
                    done: true,
                    updatedAt: new Date()
                }
            });
        }

    },
    'removeJob': function(id) {
        if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
            return Jobs.update({
                _id: id
            }, {
                $set: {
                    deleted: true
                }
            });
        }
    },
    'payNow': function(id) {
        var j = Jobs.findOne({
            _id: id
        });
        if (j.done) {
            if (Roles.userIsInRole(this.userId, 'admin')) {
                return Jobs.update({
                    adderId: j.adderId,
                    done: true,
                    createdAt: {
                        $lte: j.createdAt
                    }
                }, {
                    $set: {
                        paid: true,
                    }
                }, {
                    multi: true
                });
            }
        }

    }
});
