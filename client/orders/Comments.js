Template.Comments.onCreated(function() {
    this.autorun(() => {
        this.subscribe("allOrders");

    });
});

Template.Comments.helpers({
    orders: function() {
        return Orders.find({}, {
            sort: {
                createdAt: -1
            }
        });
    }
});
