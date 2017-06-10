Meteor.publish('jobsCount', function(id) {
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'jobsC', Jobs.find({
      deleted: false
    }), {
      countFromField: 'count'
    });

  } else {
    Counts.publish(this, 'jobsC', Jobs.find({
      deleted: false,
      adderId: id
    }), {
      countFromField: 'count'
    });

  }
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'jobsDone', Jobs.find({
      done: true,
      deleted: false
    }), {
      countFromField: 'count'
    });

  } else {
    Counts.publish(this, 'jobsDone', Jobs.find({
      done: true,
      deleted: false,
      adderId: id
    }), {
      countFromField: 'count'
    });

  }
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'jobsRunning', Jobs.find({
      deleted: false,
      done: false
    }), {
      countFromField: 'count'
    });

  } else {
    Counts.publish(this, 'jobsRunning', Jobs.find({
      deleted: false,
      done: false,
      adderId: id
    }), {
      countFromField: 'count'
    });

  }
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'jobsPaid', Jobs.find({
      deleted: false,
      done: true,
      paid: true
    }), {
      countFromField: 'count'
    });

  } else {
    Counts.publish(this, 'jobsPaid', Jobs.find({
      deleted: false,
      done: true,
      paid: true,
      adderId: id
    }), {
      countFromField: 'count'
    });
  }
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'jobsUnpaid', Jobs.find({
      deleted: false,
      done: true,
      paid: false
    }), {
      countFromField: 'count'
    });
  } else {
    Counts.publish(this, 'jobsUnpaid', Jobs.find({
      done: true,
      deleted: false,
      paid: false,
      adderId: id
    }), {
      countFromField: 'count'
    });
  }

});
Meteor.publish('ordersCount', function(id, d, yd) {
  if (Roles.userIsInRole(id, 'admin')) {

  } else {

  }
  if (Roles.userIsInRole(id, 'admin')) {

  } else {

  }
  if (Roles.userIsInRole(id, 'admin')) {

  } else {

  }
  if (Roles.userIsInRole(id, 'admin')) {

  } else {

  }
  if (Roles.userIsInRole(id, 'admin')) {

  } else {

  }
  Counts.publish(this, 'ordersC', Orders.find({
    deleted: false
  }));
  Counts.publish(this, 'allRidesCount', Orders.find({
    deleted: false
  }), {
    countFromField: 'rides'
  });
  Counts.publish(this, 'allAddedCount', Orders.find({
    deleted: false
  }), {
    countFromField: 'added'
  });
  Counts.publish(this, 'todayRidesCount', Orders.find({
    deleted: false,
    pause: false,
    createdAt: {
      $gte: d
    }
  }), {
    countFromField: 'rides'
  });
  Counts.publish(this, 'yesterdayRidesCount', Orders.find({
    deleted: false,
    pause: false,
    createdAt: {
      $gte: yd,
      $lt: d
    }
  }), {
    countFromField: 'rides'
  });

});

Meteor.publish('userCount', function(id) {
  Counts.publish(this, 'buyersCount', Meteor.users.find({
    roles: 'buyer'
  }));
  Counts.publish(this, 'sellersCount', Meteor.users.find({
    roles: 'seller'
  }));
  Counts.publish(this, 'usersCount', Meteor.users.find());
});

Meteor.publish('completedOrderCount', function(id) {
  if (Roles.userIsInRole(id, 'admin')) {
    Counts.publish(this, 'orderCount', Orders.find({
      deleted: false,
      done: true
    }));
  } else {
    Counts.publish(this, 'orderCount', Orders.find({
      userId: id,
      deleted: false,
      done: true
    }));
  }


});
