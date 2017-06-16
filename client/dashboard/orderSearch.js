Template.orderSearch.helpers({

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
  orders: function() {
    return Orders.find({}, {
      sort: {
        createdAt: -1
      }
    });
  },
});


Template.orderSearch.onCreated(function() {
  var self = this;
  self.searchQuery = new ReactiveVar();
  self.searching = new ReactiveVar(false);

  self.autorun(() => {
    var orderId = FlowRouter.getParam('id');
    self.subscribe("orderSearch", self.searchQuery.get(), () => {
      setTimeout(() => {
        self.searching.set(false);
      }, 300);
    });

  });
});

Template.orderSearch.events({
  'keyup [name="search"]' (event, template) {
    let value = event.target.value.trim();

    if (value !== '' && event.keyCode === 13) {
      template.searchQuery.set(value);
      template.searching.set(true);
    }

    if (value === '') {
      template.searchQuery.set(value);
    }
  }
});
