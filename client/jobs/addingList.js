Template.addingList.onCreated(function() {
  this.autorun(() => {
    var id = FlowRouter.getParam('id');
    if (!id) id = Meteor.userId();
    this.subscribe("jobsRunning", id);
  });

});

Template.addingList.onRendered(function() {
  var clipboard = new Clipboard('.btn-copy-link');
});

var runningRideCount = function() {
  var total = 0;

  Jobs.find({
    done: false
  }).map(function(doc) {
    total += doc.count;
  });
  return total;
};

Template.addingList.helpers({

  runningList: function() {
    return Jobs.find({
      done: false
    }, {
      sort: {
        createdAt: 1
      }
    });
  },

  runningRides: runningRideCount,

  runningCountNotZero: function() {
    //    console.log(myride());
    return runningRideCount() > 0;
  }
});


Template.addingList.events({
  "click .addCode" (event) {
    //var e = document.getElementById("ride-count");
    var count = 2;
    var f = document.getElementById("adder");
    var adderId = "";
    if (f == null) adderId = Meteor.userId();
    else {
      adderId = f.options[f.selectedIndex].value;
    }
    var dayStart = new Date();
    dayStart.setHours(0);
    dayStart.setMinutes(0);
    dayStart.setSeconds(0);
    Meteor.call('addJobOrder', adderId, count, dayStart);

  }
});
Template.runningCode.onCreated(function() {
  this.autorun(() => {
    this.subscribe("allSellers");
  });

});
Template.runningCode.events({
  "click .removeWork": function(event, template) {
    var notes = prompt('Are you sure? But Why?');
    if (notes) {
      Meteor.call('removeJob', this._id, notes);
    }
  },
  "click .workDone": function() {
    var mins = parseInt((new Date() - this.createdAt) / (1000 * 60));
    if (mins > 30) {
      var notes = prompt("Ride account me aa gaya hai? Booking names?");
      if (notes) {
        Meteor.call('jobDone', this._id, notes);
        Meteor.call('updateRide', this.orderId, this.count, (error) => {
          if (error) {
            alert(error.error);
          }
        });
      } else {
        alert('Ride account me aane ke baad "Done" karna hai.');
      }
    } else {
      alert("Ride account me aa gaya hai?? Try agian after some time.");
    }
  }
});
Template.runningCode.helpers({
  addedBy: function() {

    return Meteor.users.findOne({
      _id: this.adderId
    }).emails[0].address;
  },
  tooOld: function() {
    var dt = new Date();
    var createdAt = this.createdAt;
    if (createdAt.getDate() < dt.getDate()) {
      return true;
    } else {
      return false;
    }
  }
});
