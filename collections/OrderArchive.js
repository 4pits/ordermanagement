OrdersArchive = new Mongo.Collection("ordersarchive");

OrdersArchive.schema = new SimpleSchema({
  orderId: {
    type: String
  },
  name: {
    type: String,
    label: "Buyer/Paypal Name",
    optional: true,
    max: 100
  },
  paypalemail: {
    type: String,
    optional: true
  },
  txnId: {
    type: String,
    label: "Paypal Transaction Id / Reciept No.",
    optional: true,
    max: 100
  },
  paidAmount: {
    type: Number,
    label: "Paid Amount in $(USD)",
    decimal: true,
    min: 5,
    optional: true
  },
  code: {
    type: String,
    label: "Your own invite code from Uber app",
    min: 4
  },
  source: {
    type: String,
    label: "Source",
    optional: true,
    max: 30,
    autoform: {
      omit: true,
      label: false
    }
  },
  rides: {
    type: Number,
    label: "# rides ordered",
    min: 1,
    max: 500
  },
  added: {
    type: Number,
    defaultValue: 0
  },
  runStatus: {
    type: Boolean,
    defaultValue: true,
    label: "Running status on blog",
    autoform: {
      omit: true,
      label: false
    }
  },
  comment: {
    type: String,
    label: "Comments",
    optional: true,
  },
  premium: {
    type: Boolean,
    defaultValue: false,
    label: "Premium Delivery"
  },
  done: {
    type: Boolean,
    defaultValue: false
  },
  pause: {
    type: Boolean
  },
  deleted: {
    type: Boolean
  },
  createdAt: {
    type: Date
  },
  updatedAt: {
    type: Date,
    optional: true
  },
  userId: {
    type: String
  },
  archAt: {
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
  }

});

OrdersArchive.attachSchema(OrdersArchive.schema);
