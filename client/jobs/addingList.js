Template.addingList.onCreated(function() {
    this.autorun(() => {
        this.subscribe("jobsRunning");
    });

});

Template.addingList.onRendered(function() {
    var clipboard = new Clipboard('.btn-copy-link');
});

var runningRideCount = function() {
    var id = Meteor.userId();
    var total = 0;
    if (Roles.userIsInRole(id, 'admin')) {
        Jobs.find({
            done: false
        }).map(function(doc) {
            total += doc.count;
        });
    } else if (Roles.userIsInRole(id, 'seller')) {
        Jobs.find({
            done: false,
            adderId: id
        }).map(function(doc) {
            total += doc.count;
        });
    }
    return total;
};

Template.addingList.helpers({

    runningList: function() {
        //    console.log(Meteor.userId());
        var id = Meteor.userId();
        if (Roles.userIsInRole(id, 'admin')) {
            return Jobs.find({
                done: false
            }, {
                sort: {
                    createdAt: 1
                }
            });
        } else if (Roles.userIsInRole(id, 'seller')) {
            return Jobs.find({
                adderId: id,
                done: false
            }, {
                sort: {
                    createdAt: 1
                }
            });
        }

    },

    runningRides: runningRideCount,

    runningCountNotZero: function() {
        //    console.log(myride());
        return runningRideCount() > 0;
    },
    allowedRides: function() {
        var id = Meteor.userId();

        if (Roles.userIsInRole(id, 'two-ride-seller')) {
            return 2;
        } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
            return 10;
        } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
            return 20;
        } else if (Roles.userIsInRole(id, 'premium-seller')) {
            return 100;
        } else if (Roles.userIsInRole(id, 'admin')) {
            return 1000;
        }
        return 0;
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
        var dt = new Date();
        var dtnow = new Date();
        dtnow.setHours(0);
        dtnow.setMinutes(0);
        dtnow.setSeconds(0);
        Meteor.call('addJobOrder', adderId, count, dt, dtnow);

    }
});
Template.runningCode.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allSellers");
    });

});
Template.runningCode.events({
    "click .removeWork": function(event, template) {
        var result = confirm('Are you sure?');
        if (result) {
            Meteor.call('removeJob', this._id);
        }
    },
    "click .workDone": function() {
        var mins = parseInt((new Date() - this.createdAt) / (1000 * 60));
        if (mins > 10) {
            var result = confirm("Ride add ho gaya? update de diya? Jab ho jaye tab OK pe click karna, nahi to Cancel.");
            if (result) {
                Meteor.call('jobDone', this._id);
                Meteor.call('updateRide', this.orderId, this.count, (error) => {
                    if (error) {
                        alert(error.error);
                    }
                });
            } else {
                alert('Add karne ke baad update dena hai,  uske baad hi done pe click karna hai.');
            }
        } else {
            alert("Too early to complete this job. Please do it properly.");
        }
    }
});
Template.runningCode.helpers({
    addedBy: function() {

        return Meteor.users.findOne({
            _id: this.adderId
        }).emails[0].address;
    }
});
