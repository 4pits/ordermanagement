Template.yesterdayList.onCreated(function() {
    this.autorun(() => {
        this.subscribe("jobsCompletedRecently");
    });

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

Template.yesterdayList.helpers({
    yesterdayList: function() {
        //      console.log('listing');
        return Jobs.find({
            done: true,
            createdAt: {
                $gte: yesterday(),
                $lt: today()
            }
        }, {
            sort: {
                updatedAt: -1
            }
        });
    },
    yesterday: function() {
        return yesterday();
    },
    yesterdayCount: function() {
        var total = 0;
        Jobs.find({
            done: true,
            createdAt: {
                $gte: yesterday(),
                $lt: today()
            }
        }).map(function(j) {
            total += j.count;
        });
        return total;
    }

});
