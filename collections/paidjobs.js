PaidJobs = new Mongo.Collection("paidjobs");

PaidJobs.schema = new SimpleSchema({
  orderId: {
    type: String
  },
  code: {
    type: String
  },
  count: {
    type: Number
  },
  done: {
    type: Boolean
  },
  paid: {
    type: Boolean
  },
  deleted: {
    type: Boolean
  },
  adderId: {
    type: String
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true,
  },
  userId: {
    type: String
  },
  notes: {
    type: String,
    optional: true
  },
  premium: {
    type: Boolean,
    defaultValue: false,
    label: "Premium Delivery"
  },
  paidAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return {
          $setOnInsert: new Date()
        };
      } else {
        this.unset(); // Prevent user from supplying their own value
      }
    }
  },
});

PaidJobs.attachSchema(PaidJobs.schema);
