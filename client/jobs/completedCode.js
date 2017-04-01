Template.completedCode.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allSellers");
    });

});
Template.completedCode.events({
    "click .removeWork": function(event, template) {
        Meteor.call('removeJob', this._id);
        Meteor.call('updateRide', this.orderId, -this.count, (error) => {
            if (error) {
                alert(error.error);
            }
        });
    },
    "click .pay-now": function() {
        Meteor.call('payNow', this._id);
    }

});

Template.completedCode.helpers({
    timeTaken: function() {
        var duration = this.updatedAt - this.createdAt;
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = parseInt((duration / 1000) % 60),
            minutes = parseInt((duration / (1000 * 60)) % 60),
            hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        var hours = (hours < 10) ? "0" + hours : hours;
        var minutes = (minutes < 10) ? "0" + minutes : minutes;
        var seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    },
    addedBy: function() {
        return Meteor.users.findOne({
            _id: this.adderId
        }).emails[0].address;
    }
});
