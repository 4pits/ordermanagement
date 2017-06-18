Template.completedOrders.onCreated(function() {
  Session.set('limit', 10);
  this.searchQuery = new ReactiveVar();
  this.searching = new ReactiveVar(false);

  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    //  this.subscribe("completedOrders", id, Session.get('limit'));
    this.subscribe("completedOrders", id, Session.get('limit'), this.searchQuery.get(), () => {
      setTimeout(() => {
        this.searching.set(false);
      }, 300);
    });

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
  },
  'keyup [name="searchOrder"]' (event, template) {
    let value = event.target.value.trim();
    if (value !== '' && value.length > 2) {
      template.searchQuery.set(value);
      template.searching.set(true);
    }

    if (value === '') {
      template.searchQuery.set(value);
    }
  }
});

Template.completeOrder.helpers({
  pendingRides: function() {
    return this.rides - this.added;
  }
});
