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
    var assignedcount = Jobs.find({
      orderId: o.orderId,
      deleted: false,
      $or: [{
        createdAt: {
          $gt: dayStart
        }
      }, {
        done: false
      }]
    }).count();
    //    console.log('assignedcount: ' + assignedcount);
    //    console.log(o.code);
    if (assignedcount > 1) ids.push(o.orderId);
  });
  return ids;
};

var jobcount = function(ordr, count, adderId, dayStart) {
  var jobcount = 0;
  //don't allow to get added by same person in same day
  var countJ = Jobs.find({
    adderId: adderId,
    deleted: false,
    orderId: ordr._id,
    createdAt: {
      $gte: dayStart
    }
  }).count();
  //console.log('J1 ' + countJ);
  //don't allow to get it added by any person in within 4 hours.
  //  console.log(ordr.code);
  Jobs.find({
    orderId: ordr._id,
    done: true,
    deleted: false,
    updatedAt: {
      $gte: dayStart
    }
  }).map(function(jb) {
    var ud = new Date() - jb.updatedAt;
    if (ud < 1000 * 60 * 60 * 4) countJ++;
    //    console.log(ud);
  });
  //  console.log('j2 ' + countJ);
  if (countJ === 0) {
    // to avoid adding extra rides then ordered
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
    //    console.log('ordr.added ' + ordr.added);
    //    console.log('addedForCode ' + addedForCode);
    //    console.log('jobcount ' + jobcount);
    if (jobcount > 0) {
      Meteor.call('jobs.insert', ordr._id, ordr.code, ordr.premium, jobcount, adderId, (error, result) => {
        if (error) {
          //    console.log(error);
          jobcount = 0;
        }
        if (result) {
          //    console.log("result " + result);
          //    console.log(jobcount);
          //return jobcount;
        }
      });
    }
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
    return 10;
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
    //    console.log('dayStart');
    //    console.log(dayStart);
    if (!dayStart || !adderId) return; // return if undefined
    //    console.log('count: ' + count);
    if (!Roles.userIsInRole(adderId, ['admin', 'seller'])) return;
    //    console.log('allowed ' + allowedRides(adderId));
    //    console.log('userrun ' + userRunningRides(adderId));
    //    console.log('limit ' + sellerDailyLimit(adderId));
    //    console.log('userdailyrun ' + userDailyRunningRidesCount(adderId, dayStart));
    if (allowedRides(adderId) <= userRunningRides(adderId)) return;
    if (sellerDailyLimit(adderId) <= userDailyRunningRidesCount(adderId, dayStart)) return;
    if (count < 1) return;
    //    console.log('adding now');
    // console.log('ids1');
    //    console.log(idsFirstJob(dayStart));
    // console.log('ids2');
    // console.log(idsSecondJob(dayStart));
    //    console.log('1: ' + count);
    Orders.find({
      _id: {
        $nin: idsFirstJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });
    //currentListPremium
    //    console.log('2: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsFirstJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });
    //    currentListNormalNew: function() {
    //      console.log('3: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsFirstJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });

    //  currentListNormal
    //    console.log('4: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsFirstJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });

    //      currentListOneRide
    //    console.log('5: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsFirstJob(dayStart)
      },
      done: false,
      pause: false,
      deleted: false,
      $where: "this.rides - this.added === 1"
    }, {
      sort: {
        createdAt: 1
      }
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });
    //code repeat if all done for first round
    //currentListPremium
    //      console.log('6: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsSecondJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });

    //  currentListNormal
    //      console.log('7: ' + count);
    if (count < 1) return;
    Orders.find({
      _id: {
        $nin: idsSecondJob(dayStart)
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
    }).map(function(ordr) {
      if (count > 0) {
        var jc = jobcount(ordr, count, adderId, dayStart);
        count = count - jc;
      }
    });
  }
});
