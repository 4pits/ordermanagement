Meteor.methods({
  "processing.insert": function(userId, orderId) {
    try {
      Processing.insert({
        userId: userId,
        orderId: orderId
      });
      return true;
    } catch (e) {
      return false;
    }

  },
  "processing.delete": function(adderId) {
    Processing.find({
      userId: adderId
    }).map(function(row) {
      Processing.remove(row._id);
    });
  }
});
