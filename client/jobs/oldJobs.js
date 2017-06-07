Template.oldJobs.onCreated(function() {
  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    this.subscribe("jobsCompletedOld", id);
  });

});

var yesterday = function() {
  var yd = new Date();
  yd.setHours(0);
  yd.setMinutes(0);
  yd.setSeconds(0);
  yd.setDate(yd.getDate() - 1);
  return yd;
};

Template.oldJobs.helpers({
  oldList: function() {
    var dt = new Date();
    //    console.log('console time' + dt);
    return Jobs.find({
      paid: false,
      createdAt: {
        $lt: yesterday()
      }
    }, {
      sort: {
        createdAt: -1
      }
    });
  },
  oldListCount: function() {
    var total = 0;
    Jobs.find({
      paid: false,
      createdAt: {
        $lt: yesterday()
      }
    }).map(function(j) {
      total += j.count;
    });
    return total;
  }
});
