Processing = new Mongo.Collection("processing");

Processing.schema = new SimpleSchema({
  userId: {
    type: String
  },
  orderId: {
    type: String,
    unique: true
  }
});

Processing.attachSchema(Processing.schema);
