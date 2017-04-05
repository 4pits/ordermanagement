Meteor.publish('jobsCount', function() {
    Counts.publish(this, 'jobsC', Jobs.find({
        deleted: false
    }), {
        countFromField: 'count'
    });
    Counts.publish(this, 'jobsDone', Jobs.find({
        done: true,
        deleted: false
    }), {
        countFromField: 'count'
    });
    Counts.publish(this, 'jobsRunning', Jobs.find({
        deleted: false,
        done: false
    }), {
        countFromField: 'count'
    });
    Counts.publish(this, 'jobsPaid', Jobs.find({
        deleted: false,
        paid: true
    }), {
        countFromField: 'count'
    });
    Counts.publish(this, 'jobsUnpaid', Jobs.find({
        deleted: false,
        paid: false
    }), {
        countFromField: 'count'
    });
});
Meteor.publish('ordersCount', function() {
    Counts.publish(this, 'ordersC', Orders.find({
        deleted: false
    }));
    Counts.publish(this, 'allRidesCount', Orders.find({
        deleted: false
    }), {
        countFromField: 'rides'
    });
    Counts.publish(this, 'allAddedCount', Orders.find({
        deleted: false
    }), {
        countFromField: 'added'
    });
    var d = new Date();
    d.setHours(0);
    d.setMinutes(0);
    d.setSeconds(0);
    Counts.publish(this, 'todayRidesCount', Orders.find({
        deleted: false,
        pause: false,
        createdAt: {
            $gte: d
        }
    }), {
        countFromField: 'rides'
    });
    var yd = new Date();
    yd.setHours(0);
    yd.setMinutes(0);
    yd.setSeconds(0);
    yd.setDate(yd.getDate() - 1);
    Counts.publish(this, 'yesterdayRidesCount', Orders.find({
        deleted: false,
        pause: false,
        createdAt: {
            $gte: yd,
            $lt: d
        }
    }), {
        countFromField: 'rides'
    });

});

Meteor.publish('userCount', function() {
    Counts.publish(this, 'buyersCount', Meteor.users.find({
        roles: 'buyer'
    }));
    Counts.publish(this, 'sellersCount', Meteor.users.find({
        roles: 'seller'
    }));
    Counts.publish(this, 'usersCount', Meteor.users.find());
});
