// first job will be assigned daily after midnight , if its not running.
var idsFirstJob = function(dayStart, adderId) {
  let ids = [];
  Jobs.find({
    deleted: false,
    $or: [{
      createdAt: {
        $gte: dayStart
      }
    }, {
      done: false
    }]
  }).map(function(o) {
    ids.push(o.orderId);
  });
  //once removed don't show them again for the same day.
  Jobs.find({
    deleted: true,
    adderId: adderId,
    createdAt: {
      $gte: dayStart
    }
  }).map(function(o) {
    ids.push(o.orderId);
  });
  // include recently added codes by anyone untill paid=false
  Jobs.find({
    done: true,
    paid: false,
    updatedAt: {
      $gte: dayStart
    }
  }).map(function(o) {
    ids.push(o.orderId);
  });
  //  console.log(ids);
  Processing.find({}).map(function(p) {
    ids.push(p.orderId);
  });
  return ids;
};
// second job will be assigned once all orders are assigned once
var idsSecondJob = function(dayStart, adderId) {
  let ids = [];
  let orFilter = [{
    deleted: false,
    createdAt: {
      $gte: dayStart
    }
  }, {
    deleted: false,
    done: false
  }, {
    deleted: false,
    done: true,
    paid: false,
    updatedAt: {
      $gte: dayStart
    }
  }, {
    deleted: true,
    adderId: adderId,
    updatedAt: {
      $gte: dayStart
    }
  }];
  Jobs.find({
    $or: orFilter
  }).map(function(o) {
    //  console.log(o._id + ' ' + o.code + ' ' + o.createdAt + ' ' + o.deleted);
    var assignedcount = Jobs.find({
      orderId: o.orderId,
      $or: orFilter
    }).count();
    //    console.log('assignedcount: ' + assignedcount);
    //    console.log(o.code);
    if (assignedcount > 1) ids.push(o.orderId);
  });
  //  console.log('firstround');
  //  console.log(ids);
  Jobs.find({
    deleted: true,
    adderId: adderId,
    createdAt: {
      $gte: dayStart
    }
  }).map(function(o) {
    ids.push(o.orderId);
  });
  //  console.log('secondround');
  //  console.log(ids);
  Processing.find({}).map(function(p) {
    ids.push(p.orderId);
  });
  return ids;
};

var jobcount = function(ordr, count, adderId, dayStart) {
  var jobcount = 0;
  var countJ = Jobs.find({
    adderId: adderId,
    //  deleted: false,
    orderId: ordr._id,
    $or: [{
      createdAt: {
        $gte: dayStart
      }
    }, {
      done: true,
      paid: false,
      updatedAt: {
        $gte: dayStart
      }
    }, {
      deleted: true,
      createdAt: {
        $gte: dayStart
      }
    }]
  }).count();
  //console.log('J1 ' + countJ);
  if (countJ > 0) {
    return jobcount;
  }
  var addedForCode = 0;
  Jobs.find({
    orderId: ordr._id,
    deleted: false
  }).map(function(jb) {
    addedForCode = addedForCode + jb.count;
  });
  if (ordr.rides - addedForCode === 1 && count > 1) {
    jobcount = 1;
  } else if (ordr.rides - addedForCode > 1 && count > 1) {
    jobcount = 2;
  }
  var countProcessing = Processing.find({
    orderId: ordr._id
  }).count();
  if (countProcessing != 1) return 0; // not adding

  if (jobcount > 0) {
    Meteor.call('jobs.insert', ordr._id, ordr.code, ordr.premium, jobcount, adderId);
  }
  return jobcount;
}
var deletedCount = function(userId) {
  var dt = new Date();
  dt.setDate(dt.getDate() - 2);
  let count = 0;
  Jobs.find({
    adderId: userId,
    deleted: true,
    createdAt: {
      $gte: dt
    }
  }).map(function(jb) {
    count = count + jb.count;
  });
  return count;
}

var allowedRides = function(id) {
  let count = 0;
  if (Roles.userIsInRole(id, 'two-ride-seller')) {
    count = 2;
  } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
    count = 10;
  } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
    count = 20;
  } else if (Roles.userIsInRole(id, 'premium-seller')) {
    count = 100;
  } else if (Roles.userIsInRole(id, 'admin')) {
    count = 1000;
  }
  //  console.log(deletedCount(id) + ' ad c');
  return count - deletedCount(id);
};
var sellerDailyLimit = function(id) {
  let count = 0;
  if (Roles.userIsInRole(id, 'two-ride-seller')) {
    count = 10;
  } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
    count = 30;
  } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
    count = 50;
  } else if (Roles.userIsInRole(id, 'premium-seller')) {
    count = 200;
  } else if (Roles.userIsInRole(id, 'admin')) {
    count = 1000;
  }
  //  console.log(deletedCount(id) + ' sd c');
  return count - deletedCount(id);
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
      $gte: dayStart
    }
  }).map(function(job) {
    total = total + job.count;
  });
  return total;
}

var recentlyAdded = function(adderId) {
  let job = Jobs.findOne({
    adderId: adderId
  }, {
    sort: {
      createdAt: -1,
      limit: 1
    }
  });
  if (!job) return false;
  let diff = Math.abs(job.createdAt.getTime() - (new Date()).getTime());
  //  console.log(diff);
  return diff > 5000 ? false : true;
}
Meteor.methods({
  "addJobOrder": function(adderId, count) {
    if (recentlyAdded(adderId)) return -1;
    var dtnow = new Date();
    var dtStart = new Date();
    dtStart.setHours(11);
    dtStart.setMinutes(31);
    dtStart.setSeconds(0);
    if (dtStart.getTime() > dtnow.getTime()) {
      dtStart = new Date(dtStart.getTime() - (24 * 60 * 60 * 1000));
    }
    var dayStart = dtStart;
    //console.log(dayStart);
    //return -1;
    if (!dayStart || !adderId) return -1; // return if undefined
    if (!Roles.userIsInRole(adderId, ['admin', 'seller'])) return -1;
    if (allowedRides(adderId) <= userRunningRides(adderId)) return count;
    if (sellerDailyLimit(adderId) <= userDailyRunningRidesCount(adderId, dayStart)) return -1;
    if (count < 1) return count;
    var codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsFirstJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        added: 0,
        premium: true,
        deleted: false,
        $where: "this.rides - this.added > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }
    //currentListPremium
    //  console.log('2: ' + count);
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsFirstJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        deleted: false,
        added: {
          $gt: 0
        },
        premium: true,
        $where: "this.rides - this.added > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }
    //    currentListNormalNew: function() {
    //  console.log('3: ' + count);
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsFirstJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        added: 0,
        premium: false,
        deleted: false,
        $where: "this.rides - this.added > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }

    //  currentListNormal
    //  console.log('4: ' + count);
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsFirstJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        deleted: false,
        added: {
          $gt: 0
        },
        premium: false,
        $where: "this.rides - this.added > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }

    //      currentListOneRide
    //  console.log('5: ' + count);
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsFirstJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        deleted: false,
        $where: "this.rides - this.added === 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }

    //code repeat if all done for first round
    //currentListPremium
    Meteor.call('processing.delete', adderId);
    //  console.log('6: ' + count);
    //allow second job in morning
    //  console.log(dayStart);
    var now = new Date();
    var diff = now.getTime() - dayStart.getTime();
    //    console.log(diff);
    if (diff < 8 * 60 * 60 * 1000) return count; // 8 hours delay for second job
    //    console.log('can add second');
    //  console.log('secondjob');
    //  console.log(idsSecondJob(dayStart, adderId));
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsSecondJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        premium: true,
        runStatus: false,
        deleted: false,
        $where: "this.rides - this.added -2 > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }

    //  currentListNormal
    //  console.log('7: ' + count);
    codeAvailable = true;
    while (codeAvailable && count > 0) {
      var order = Orders.findOne({
        _id: {
          $nin: idsSecondJob(dayStart, adderId)
        },
        done: false,
        pause: false,
        premium: false,
        runStatus: false,
        deleted: false,
        $where: "this.rides - this.added - 2 > 1"
      }, {
        sort: {
          createdAt: 1
        }
      });
      if (order) {
        Meteor.call('processing.insert', adderId, order._id, (error, result) => {
          if (result) {
            var jc = jobcount(order, count, adderId, dayStart);
            count = count - jc;
          }
        });
      } else {
        codeAvailable = false;
      }
    }
    Meteor.call('processing.delete', adderId);
    return count;
  }
});
