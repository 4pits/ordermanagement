Meteor.methods({
  "processing.insert": function(userId, orderId) {
    return Processing.insert({
      userId: userId,
      orderId: orderId
    });
  },
  "processing.delete": function(adderId) {
    Processing.find({
      userId: adderId
    }).map(function(row) {
      Processing.remove(row._id);
    });
  }
});
