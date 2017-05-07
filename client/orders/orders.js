Template.orders.onCreated(function() {
  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    this.subscribe("orders", id);
  });
});

Template.orders.helpers({
  newOrders: function() {
    return Orders.find({
      done: false,
      pause: true
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  newOrderCount: function() {
    return Orders.find({
      done: false,
      pause: true
    }).count();
  },
  runningOrders: function() {
    return Orders.find({
      done: false,
      pause: false,
      $where: "this.rides != this.added"
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  runningOrderCount: function() {
    return Orders.find({
      done: false,
      pause: false,
      $where: "this.rides != this.added"
    }).count();
  },


  rendered: function() {

  },
  destroyed: function() {

  },
  pending: function() {
    return this.rides;
  },
  insertMode: function() {
    return Session.get('insertMode');
  },
  showEditOrder: function() {
    return Session.get('showEditOrder');
  },
  showJobs: function() {
    return Session.get('showJobs');
  },
  autoSaveMode: function() {
    return Session.get("autoSaveMode") ? true : false;
  },
  selectedOrderDoc: function() {
    return Orders.findOne(Session.get("selectedOrderId"));
  },
  isSelectedOrder: function() {
    return Session.equals("selectedOrderId", this._id);
  },
  formType: function() {
    if (Session.get("selectedOrderId")) {
      return "update";
    } else {
      return "disabled";
    }
  },
  disableButtons: function() {
    return !Session.get("selectedOrderId");
  },
  ordersCount: function() {
    return Orders.find({
      done: false,
      $where: "this.rides - this.added != 0"
    }).count();
  },
  allAddedOrders: function() {
    return Orders.find({
      done: false,
      $where: "this.rides === this.added"
    });
  },
  allAddedCount: function() {
    return Orders.find({
      done: false,
      $where: "this.rides === this.added"
    }).count();
  }

});



Template.orders.events({
  'click #showHide': function() {
    Session.set('insertMode', !Session.get('insertMode'));
  },
  'change .autosave-toggle': function() {
    Session.set("autoSaveMode", !Session.get("autoSaveMode"));
  },
  'click .close-order-form': function() {
    Session.set('selectedOrderId', null);
    Session.set('showEditOrder', false);
  },
  'click .close-order-details': function() {
    Session.set('showOrderDetails', false);
    Session.set('orderDetailsId', null);
  }

});
Template.order.events({
  'click .run-status': function(event, template) {
    return Orders.update({
      _id: this._id
    }, {
      $set: {
        runStatus: !this.runStatus

      }
    });

  },
  'click .premium-status': function(event, template) {
    return Orders.update({
      _id: this._id
    }, {
      $set: {
        premium: !this.premium

      }
    });

  },
  'click .pause-status': function(event, template) {
    return Orders.update({
      _id: this._id
    }, {
      $set: {
        pause: !this.pause

      }
    });

  },

  'click .order-row': function() {
    Session.set('selectedOrderId', this._id);
    Session.set('showEditOrder', true);
  }
});

Template.order.helpers({
  pendingRides: function() {
    return this.rides - this.added;
  },
  orderStatus: function() {
    if (this.deleted) {
      return 'Deleted';
    } else if (!this.done && this.pause && this.rides != this.added)
      return 'New';
    else if (!this.done && !this.pause && this.rides != this.added) {
      return 'Running'
    } else if (!this.done && !this.pause && this.rides === this.added) {
      return 'Completed'
    } else {
      return 'Error';
    }
  },
  allAdded: function() {
    return this.rides === this.added;
  }

});
