var firstOrderUpdate = function(orderId) {
  var flag = 0;
  var userId = Orders.findOne({
    _id: orderId
  }).userId;
  var status = Meteor.users.findOne({
    _id: userId
  }).firstOrder;
  var count = Orders.find({
    userId: userId,
    pause: false
  }).count();
  if (count > 0) flag = 1;
  count = Orders.find({
    userId: userId,
    done: true
  }).count();
  if (count > 0) flag = 2;
  //  console.log('flag ' + flag);
  Meteor.users.update(userId, {
    $set: {
      firstOrder: flag
    }
  });
}

Meteor.methods({
  'updateRide': function(id, count) {
    //    console.log(id);
    var order = Orders.findOne({
      _id: id
    });
    //      console.log(order);
    if (order) {
      if (order.added === order.rides && count > 0) return;
      if (order.added === 0 && count < 0) return;
      if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
        return Orders.update({
          _id: id
        }, {
          $set: {
            added: order.added + count,
          }
        });
      }
    }
  },
  'pauseOrderToggle': function(id, flag) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Orders.update({
        _id: id
      }, {
        $set: {
          pause: flag
        }
      });
      //        console.log(id);
      firstOrderUpdate(id);
    }
  },
  'resetOrder': function(id) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Orders.update({
        _id: id
      }, {
        $set: {
          added: 0,
          pending: this.rides,
          pause: true,
          done: false
        }
      });
      firstOrderUpdate(id);
    }
  },
  'deleteOrderToggle': function(id, flag) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      //    console.log('deleting');
      Orders.update({
        _id: id
      }, {
        $set: {
          deleted: flag
        }
      });
      firstOrderUpdate(id);
    }
  },
  'completeOrder': function(id) {
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Orders.update({
        _id: id
      }, {
        $set: {
          done: true

        }
      });
      firstOrderUpdate(id);
    }
  },
  'reassignOrderBuyer': function(buyerId, orderId) {
    //      console.log('assigning buyer');
    if (Roles.userIsInRole(this.userId, 'admin')) {
      Orders.update({
        _id: orderId
      }, {
        $set: {
          userId: buyerId
        }
      });
      firstOrderUpdate(orderId);
    }
  }

});
