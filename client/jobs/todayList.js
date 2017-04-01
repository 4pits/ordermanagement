Template.todayList.onCreated(function() {
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

Template.todayList.helpers({
    todayList: function() {
        //      console.log('listing');
        return Jobs.find({
            done: true,
            createdAt: {
                $gte: today()
            }
        }, {
            sort: {
                updatedAt: -1
            }
        });
    }, // created yesterday
    today: function() {
        return today();
    },
    todayCount: function() {
        var total = 0;
        Jobs.find({
            done: true,
            createdAt: {
                $gte: today()
            }
        }).map(function(j) {
            total += j.count;
        });
        return total;
    }

});
