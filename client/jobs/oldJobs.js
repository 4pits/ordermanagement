Template.oldJobs.onCreated(function() {
    this.autorun(() => {
        this.subscribe("jobsCompletedOld");
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
            createdAt: {
                $lt: yesterday()
            }
        }).map(function(j) {
            total += j.count;
        });
        return total;
    }
});
