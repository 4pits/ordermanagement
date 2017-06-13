Jobs = new Mongo.Collection("jobs");
Jobs.allow({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  }
});

Jobs.deny({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  }
});

Jobs.schema = new SimpleSchema({
  orderId: {
    type: String
  },
  code: {
    type: String
  },
  count: {
    type: Number,
    max: 4
  },
  done: {
    type: Boolean,
    defaultValue: false
  },
  paid: {
    type: Boolean,
    defaultValue: false
  },
  deleted: {
    type: Boolean,
    defaultValue: false
  },
  adderId: {
    type: String
  },
  createdAt: {
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
  updatedAt: {
    type: Date,
    autoValue: function() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
  userId: {
    type: String,
    autoValue: function() {
      return this.userId
    }
  },
  notes: {
    type: String,
    optional: true
  },
  premium: {
    type: Boolean,
    defaultValue: false,
    label: "Premium Delivery"
  }
});

Jobs.attachSchema(Jobs.schema);
