Template.orders.onCreated(function() {
  // 1= pause, 2= pause+ new running, 3= pause+ all added, 4 = all new
  Session.set('orderStatus', 1);
  this.searchQuery = new ReactiveVar();
  this.searching = new ReactiveVar(false);

  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    //  this.subscribe("orders", id, Session.get('orderStatus'));
    this.subscribe("orders", id, Session.get('orderStatus'), this.searchQuery.get(), () => {
      setTimeout(() => {
        this.searching.set(false);
      }, 300);
    });

  });
});

Template.orders.helpers({
  searching: function() {
    if (this.searching) {
      return this.searching.get();
    }
    return false;
  },
  query: function() {
    if (this.searchQuery.get()) {

    }
    return '';
  },
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
    return true;
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
    Session.set('showEditOrder', false);
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
  },
  'click .setStatus2': function() {
    Session.set('orderStatus', 2);
  },
  'click .setStatus3': function() {
    Session.set('orderStatus', 3);
  },
  'click .setStatus4': function() {
    Session.set('orderStatus', 4);
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
    Session.set('insertMode', false);
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
