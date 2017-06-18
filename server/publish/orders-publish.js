var options = {
  fields: {
    paypalemail: 0,
    txnId: 0,
    paidAmount: 0,
    comment: 0
  }
};

Meteor.publish("orders", function(id, orderStatus, search) {
  //console.log(search);
  // orderStatus 1= pause, 2= pause+ new running, 3= pause+ all added, 4 = all new
  let query = [{}];
  if (search && search.length > 2) {
    let regex = new RegExp(search, 'i');

    query = [{
        name: regex
      },
      {
        code: regex
      }
    ];
  }
  if (Roles.userIsInRole(id, 'admin')) {
    if (orderStatus == 1) {
      return Orders.find({
        $or: query,
        done: false,
        deleted: false,
        pause: true
      }, options);
    } else if (orderStatus == 2) {
      return Orders.find({
        $or: query,
        done: false,
        deleted: false,
        $or: [{
          pause: true
        }, {
          $where: "this.rides != this.added"
        }]
      }, options);
    } else if (orderStatus == 3) {
      return Orders.find({
        $or: query,
        done: false,
        deleted: false,
        $or: [{
          pause: true
        }, {
          $where: "this.rides === this.added"
        }]
      }, options);
    } else if (orderStatus == 4) {
      return Orders.find({
        $or: query,
        done: false,
        deleted: false
      }, options);
    }
  } else if (Roles.userIsInRole(id, 'buyer')) {
    return Orders.find({
      $or: query,
      userId: id,
      done: false,
      deleted: false
    }, options);
  }

});

Meteor.publish("completedOrders", function(id, count, search) {
  let query = [{}];
  if (search && search.length > 2) {
    let regex = new RegExp(search, 'i');

    query = [{
        name: regex
      },
      {
        code: regex
      }
    ];
  }

  if (Roles.userIsInRole(id, 'admin')) {
    return Orders.find({
      $or: query,
      deleted: false,
      done: true
    }, {
      sort: {
        createdAt: -1
      },
      limit: count
    }, options);
  } else if (Roles.userIsInRole(id, 'buyer')) {
    return Orders.find({
      $or: query,
      userId: id,
      deleted: false,
      done: true
    }, {
      sort: {
        createdAt: -1
      },
      limit: count
    }, options);
  }
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

Meteor.publish('orderSearch', function(search) {
  check(search, Match.OneOf(String, null, undefined));
  let query = {};
  if (!search || search.length < 4) return;
  if (search) {
    let regex = new RegExp(search, 'i');

    query = {
      $or: [{
          name: regex
        },
        {
          code: regex
        },
        {
          paypalemail: regex
        }
      ],
      deleted: false
    };
  }
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Orders.find(query, {
      sort: {
        createdAt: -1
      },
      fields: {
        paypalemail: 0,
        txnId: 0,
        paidAmount: 0,
        comment: 0
      },
      limit: 10
    });
  }
});
