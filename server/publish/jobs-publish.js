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
      paid: false,
      deleted: false,
      createdAt: {
        $gte: yesterday()
      }
    });
  } else if (Roles.userIsInRole(id, 'seller')) {
    return Jobs.find({
      adderId: id,
      done: true,
      paid: false,
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
      paid: false,
      deleted: false,
      createdAt: {
        $lt: yesterday()
      }
    });
  } else if (Roles.userIsInRole(id, 'seller')) {
    return Jobs.find({
      adderId: id,
      done: true,
      paid: false,
      deleted: false,
      createdAt: {
        $lt: yesterday()
      }
    });
  }
});
Meteor.publish("jobsPaid", function(id) {
  //    console.log('server date time: ' + dt);
  if (Roles.userIsInRole(id, 'admin')) {
    return Jobs.find({
      paid: true
    });
  } else if (Roles.userIsInRole(id, 'seller')) {
    return Jobs.find({
      adderId: id,
      paid: true
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
