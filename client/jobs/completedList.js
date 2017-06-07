Template.completedList.onCreated(function() {
  Session.set('showOldJob', false);
  Session.set('showPaidJob', false);

});

var today = function() {
  var d = new Date();
  d.setHours(0);
  d.setMinutes(0);
  d.setSeconds(0);
  return d;
};
var yesterday = function() {
  var yd = new Date();
  yd.setHours(0);
  yd.setMinutes(0);
  yd.setSeconds(0);
  yd.setDate(yd.getDate() - 1);
  return yd;
};

Template.completedList.helpers({
  // created today
  showOldJob: function() {
    return Session.get('showOldJob');
  },
  showPaidJob: function() {
    return Session.get('showPaidJob');
  },
  completedCount: function() {
    return Counts.get('getCompletedCount');
  },
  completedRideNotZero: function() {
    //        console.log('counting 2');
    return Counts.get('getCompletedCount') > 0;
  }

});

Template.completedList.events({
  'click .updateLimit': function() {
    //    var dl = Session.get('jobsLimit') || 2;
    //  Session.set('jobsLimit', dl + 2);
  },
  'click .showOldJob': function() {
    Session.set('showOldJob', !Session.get('showOldJob'));
  },
  'click .showPaidJob': function() {
    Session.set('showPaidJob', !Session.get('showPaidJob'));
  }
});
