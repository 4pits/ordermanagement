Template.completedOrders.onCreated(function() {
  Session.set('limit', 5);
  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    this.subscribe("completedOrders", id, Session.get('limit'));
    this.subscribe("completedOrderCount", id);
  });

});

Template.completedOrders.helpers({
  completOrders: function() {
    return Orders.find({
      done: true
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  markCompletedCount: function() {
    return Orders.find({
      done: true
    }).count();
  },
  markCompletedCount2: function() {
    return Counts.get('orderCount');
  },
  showButton: function() {
    var count = Counts.get('orderCount');
    console.log('server count ' + count);

    var limit = Session.get('limit');
    console.log('local limit ' + limit);
    return limit < count ? true : false;
  }

});

Template.completedOrders.events({
  'click .completed' () {
    if (!this.done) {
      Meteor.call('completeOrder', this._id);
    }
  },
  'click .showMore' () {
    Session.set('limit', Session.get('limit') + 5);
  }
});

Template.completeOrder.helpers({
  pendingRides: function() {
    return this.rides - this.added;
  }
});
