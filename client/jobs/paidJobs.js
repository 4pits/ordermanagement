Template.paidJobs.onCreated(function() {
  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    this.subscribe("jobsPaid", id);
  });

});

Template.paidJobs.helpers({
  paidList: function() {
    var dt = new Date();
    //    console.log('console time' + dt);
    return Jobs.find({
      paid: true
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  paidListCount: function() {
    var total = 0;
    Jobs.find({
      paid: true
    }).map(function(j) {
      total += j.count;
    });
    return total;
  }
});
