// first job will be assigned daily after midnight , if its not running.
var idsFirstJob = function() {
    let ids = [];
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    Jobs.find({
        $or: [{
            createdAt: {
                $gt: d
            }
        }, {
            done: false
        }]
    }).map(function(o) {
        ids.push(o.orderId);
    });
    //  console.log(ids);
    return ids;
};
// second job will be assigned after 16 hours of ending last first/second job.
var idsSecondJob = function() {
    ids = [];
    var d = new Date();
    d.setDate(d.getDate() - 1);
    Jobs.find({
        $or: [{
            createdAt: {
                $gt: d
            }
        }, {
            done: false
        }]
    }).map(function(o) {
        var assignedcount = Jobs.find({
            orderId: o.orderId
        }).count();
        if (assignedcount > 1) ids.push(o.orderId);
    });
    return ids;
};

var jobcount = function(ordr, count, adderId) {
    var jobcount = 1;
    if (ordr.rides - ordr.added > 1 && count > 1) jobcount = 2;
    Meteor.call('jobs.insert', ordr._id, ordr.code, jobcount, adderId, (error) => {
        if (error) {
            alert(error.error);
        }
    });
    return jobcount;
}

var allowedRides = function() {
    var id = Meteor.userId();
    if (Roles.userIsInRole(id, 'two-ride-seller')) {
        return 2;
    } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
        return 10;
    } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
        return 20;
    } else if (Roles.userIsInRole(id, 'premium-seller')) {
        return 100;
    } else if (Roles.userIsInRole(id, 'admin')) {
        return 1000;
    }
    return 0;
};
var sellerDailyLimit = function() {
    var id = Meteor.userId();
    if (Roles.userIsInRole(id, 'two-ride-seller')) {
        return 20;
    } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
        return 30;
    } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
        return 100;
    } else if (Roles.userIsInRole(id, 'premium-seller')) {
        return 200;
    } else if (Roles.userIsInRole(id, 'admin')) {
        return 1000;
    }
    return 0;
};


var userRunningRides = function(adderId) {
    var total = 0;
    Jobs.find({
        adderId: adderId,
        done: false
    }).map(function(job) {
        total = toal + job.count;
    });
    return total;
}

var userDailyRunningRidesCount = function(adderId) {
    var total = 0;
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    Jobs.find({
        adderId: adderId,
        createdAt: {
            $gt: d
        }
    }).map(function(job) {
        total = toal + job.count;
    });
    return total;
}

Meteor.methods({
    "addJobOrder": function(adderId, count) {
        if (!Roles.userIsInRole(this.userId, ['admin', 'seller'])) return;
        if (allowedRides() <= userRunningRides()) return;
        if (sellerDailyLimit() <= userDailyRunningRidesCount()) return;
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob()
            },
            done: false,
            pause: false,
            added: 0,
            premium: true,
            $where: "this.rides - this.added > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });
        //currentListPremium
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob()
            },
            done: false,
            pause: false,
            added: {
                $gt: 0
            },
            premium: true,
            $where: "this.rides - this.added > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });
        //    currentListNormalNew: function() {
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob()
            },
            done: false,
            pause: false,
            added: 0,
            premium: false,
            $where: "this.rides - this.added > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });

        //  currentListNormal
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob()
            },
            done: false,
            pause: false,
            added: {
                $gt: 0
            },
            premium: false,
            $where: "this.rides - this.added > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });

        //      currentListOneRide
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob()
            },
            done: false,
            pause: false,
            $where: "this.rides - this.added === 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });
        //code repeat if all done for first round
        //currentListPremium
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsSecondJob()
            },
            done: false,
            pause: false,
            premium: true,
            runStatus: false,
            $where: "this.rides - this.added -2 > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });

        //  currentListNormal
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsSecondJob()
            },
            done: false,
            pause: false,
            premium: false,
            runStatus: false,
            $where: "this.rides - this.added - 2 > 1"
        }, {
            sort: {
                createdAt: 1
            }
        }).map(function(ordr) {
            if (count > 0) {
                count = count - jobcount(ordr, count, adderId);
            }
        });
    }
});
