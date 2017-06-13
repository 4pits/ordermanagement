OrdersArchive = new Mongo.Collection("ordersarchive");

OrdersArchive.schema = new SimpleSchema({
  orderId: {
    type: String
  },
  name: {
    type: String,
    label: "Buyer/Paypal Name",
    max: 100
  },
  paypalemail: {
    type: String,
    label: "Paypal Email",
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
    max: 100
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
    defaultValue: 0,
    label: "# rides added",
    optional: true,
    autoform: {
      omit: true,
      label: false
    }
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
    defaultValue: 'Comments if any?',
    max: 1000,
    autoform: {
      rows: 3
    }
  },
  premium: {
    type: Boolean,
    defaultValue: false,
    label: "Premium Delivery"
  },
  done: {
    type: Boolean,
    defaultValue: false,
    optional: true,
    autoform: {
      omit: true,
      label: false
    }
  },
  pause: {
    type: Boolean,
    autoform: {
      omit: true,
      label: false
    }
  },
  deleted: {
    type: Boolean,
    defaultValue: false,
    autoform: {
      omit: true,
      label: false
    }
  },
  createdAt: {
    type: Date,
    autoform: {
      omit: true,
      label: false
    }
  },
  updatedAt: {
    type: Date,
    denyInsert: true,
    optional: true,
    autoform: {
      omit: true,
      label: false
    }
  },
  userId: {
    type: String,
    autoform: {
      omit: true,
      label: false
    }
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
    },
    autoform: {
      omit: true,
      label: false
    }
  },

});

OrdersArchive.attachSchema(OrdersArchive.schema);
