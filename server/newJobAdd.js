// first job will be assigned daily after midnight , if its not running.
var idsFirstJob = function(dayStart) {
    let ids = [];
    Jobs.find({
        deleted: false,
        $or: [{
            createdAt: {
                $gt: dayStart
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
var idsSecondJob = function(dayStart) {
    ids = [];
    var dt = dayStart;
    dt.setHours(dt.getHours() - 6);
    Jobs.find({
        deleted: false,
        $or: [{
            createdAt: {
                $gt: dt
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

var jobcount = function(ordr, count, adderId, dayStart) {
    var jobcount = 1;
    //don't allow to get added by same person in same day
    var countJ = Jobs.find({
        adderId: adderId,
        deleted: false,
        orderId: ordr._id,
        createdAt: {
            $gte: dayStart
        }
    }).count();
    //  console.log('J1 ' + countJ);
    //don't allow to get it added by any person in within 6 hours.
    var ud = dayStart;
    ud.setHours(ud.getHours() - 4);
    countJ += Jobs.find({
        orderId: ordr._id,
        done: true,
        deleted: false,
        paid: false,
        updatedAt: {
            $gte: ud
        }
    }).count();
    //    console.log(countJ);
    if (countJ === 0) {
        if (ordr.rides - ordr.added > 1 && count > 1) jobcount = 2;
        Meteor.call('jobs.insert', ordr._id, ordr.code, jobcount, adderId, (error) => {
            if (error) {
                alert(error.error);
            }
        });
    } else {
        jobcount = 0;
    }
    return jobcount;
}

var allowedRides = function(id) {
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
var sellerDailyLimit = function(id) {
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
    //  console.log('adderId ' + adderId);
    var total = 0;
    Jobs.find({
        adderId: adderId,
        done: false,
        deleted: false
    }).map(function(job) {
        total = total + job.count;
    });
    return total;
}

var userDailyRunningRidesCount = function(adderId, dayStart) {
    //  console.log('adderId ' + adderId);
    var total = 0;
    Jobs.find({
        adderId: adderId,
        deleted: false,
        createdAt: {
            $gt: dayStart
        }
    }).map(function(job) {
        total = total + job.count;
    });
    return total;
}

Meteor.methods({
    "addJobOrder": function(adderId, count, dayStart) {
        console.log('dayStart');
        console.log(dayStart);
        if (!dayStart || !adderId) return; // return if undefined
        //    console.log('count: ' + count);
        if (!Roles.userIsInRole(adderId, ['admin', 'seller'])) return;
        //      console.log('allowed ' + allowedRides(adderId));
        //      console.log('userrun ' + userRunningRides(adderId));
        //      console.log('limit ' + sellerDailyLimit(adderId));
        //      console.log('userdailyrun ' + userDailyRunningRidesCount(adderId));
        if (allowedRides(adderId) <= userRunningRides(adderId)) return;
        if (sellerDailyLimit(adderId) <= userDailyRunningRidesCount(adderId, dayStart)) return;
        if (count < 1) return;
        //        console.log('adding now');
        //        console.log(idsFirstJob());
        Orders.find({
            _id: {
                $nin: idsFirstJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });
        //currentListPremium
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });
        //    currentListNormalNew: function() {
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });

        //  currentListNormal
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });

        //      currentListOneRide
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsFirstJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });
        //code repeat if all done for first round
        //currentListPremium
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsSecondJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });

        //  currentListNormal
        if (count < 1) return;
        Orders.find({
            _id: {
                $nin: idsSecondJob(dayStart)
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
                count = count - jobcount(ordr, count, adderId, dayStart);
            }
        });
    }
});
