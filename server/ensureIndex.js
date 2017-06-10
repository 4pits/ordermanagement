import {
  Meteor
} from 'meteor/meteor';

Meteor.startup(() => {
  // code to run on server at startup
  Jobs._ensureIndex({
    "orderId": 1
  });
  Jobs._ensureIndex({
    "adderId": 1
  });
});
