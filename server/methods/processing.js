Meteor.methods({
  "processing.insert": function(userId, orderId) {
    return Processing.insert({
      userId: userId,
      orderId: orderId
    });
  },
  "processing.delete": function(id) {
    return Processing.remove(id);
  }
});
