Meteor.publish("orders", function(id, orderStatus) {
  // orderStatus 1= pause, 2= pause+ new running, 3= pause+ all added, 4 = all new
  if (Roles.userIsInRole(id, 'admin')) {
    if (orderStatus == 1) {
      return Orders.find({
        done: false,
        deleted: false,
        pause: true
      }, {
        fields: {
          paypalemail: 0,
          txnId: 0,
          paidAmount: 0,
          comment: 0
        }
      });
    } else if (orderStatus == 2) {
      return Orders.find({
        done: false,
        deleted: false,
        $or: [{
          pause: true
        }, {
          $where: "this.rides != this.added"
        }]
      }, {
        fields: {
          paypalemail: 0,
          txnId: 0,
          paidAmount: 0,
          comment: 0
        }
      });
    } else if (orderStatus == 3) {
      return Orders.find({
        done: false,
        deleted: false,
        $or: [{
          pause: true
        }, {
          $where: "this.rides === this.added"
        }]
      }, {
        fields: {
          paypalemail: 0,
          txnId: 0,
          paidAmount: 0,
          comment: 0
        }
      });
    } else if (orderStatus == 4) {
      return Orders.find({
        done: false,
        deleted: false
      }, {
        fields: {
          paypalemail: 0,
          txnId: 0,
          paidAmount: 0,
          comment: 0
        }
      });
    }
  } else if (Roles.userIsInRole(id, 'buyer')) {
    return Orders.find({
      userId: id,
      done: false,
      deleted: false
    }, {
      fields: {
        paypalemail: 0,
        txnId: 0,
        paidAmount: 0,
        comment: 0
      }
    });
  }

});

Meteor.publish("completedOrders", function(id, count) {
  if (Roles.userIsInRole(id, 'admin')) {
    return Orders.find({
      deleted: false,
      done: true
    }, {
      sort: {
        createdAt: -1
      },
      limit: count
    }, {
      fields: {
        paypalemail: 0,
        txnId: 0,
        paidAmount: 0,
        comment: 0
      }
    });
  } else if (Roles.userIsInRole(id, 'buyer')) {
    console.log('elif' + count);
    return Orders.find({
      userId: id,
      deleted: false,
      done: true
    }, {
      sort: {
        createdAt: -1
      },
      limit: count
    }, {
      fields: {
        paypalemail: 0,
        txnId: 0,
        paidAmount: 0,
        comment: 0
      }
    });
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
      ]
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
      limit: 5
    });
  }
});
