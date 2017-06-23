Meteor.publish('allUsers', function(search) {
  if (!this.userId) {
    return this.ready();
  }
  if (!Roles.userIsInRole(this.userId, 'admin')) {
    return this.ready();
  }
  check(search, Match.OneOf(String, null, undefined));
  if (search) search = search.toLowerCase();
  let options = {
    sort: {
      createdAt: -1
    },
    fields: {
      emails: 1,
      roles: 1,
      profile: 1,
      createdAt: 1,
      userCode: 1,
      firstOrder: 1
    },
    limit: 25
  };
  if (search === '') {
    return Meteor.users.find({}, options);
  } else if (search === 'sell') {
    return Meteor.users.find({
      roles: 'seller'
    }, options);
  } else if (search === 'buy') {
    return Meteor.users.find({
      roles: 'buyer'
    }, options);
  } else if (search === 'new') {
    return Meteor.users.find({
      roles: {
        $nin: ['admin', 'seller', 'buyer']
      }
    }, options);
  } else {
    let query = {};
    if (search) {
      let regex = new RegExp(search, 'i');

      query = {
        $or: [{
            "emails.address": regex
          },
          {
            "profile.firstName": regex
          }
        ]
      };
    }
    return Meteor.users.find(query, options);
  }
});

Meteor.publish('allBuyers', function(search) {
  if (!this.userId) {
    return this.ready();
  }
  check(search, Match.OneOf(String, null, undefined));
  let query = {};
  if (search) {
    let regex = new RegExp(search, 'i');

    query = {
      roles: 'buyer',
      $or: [{
          "emails.address": regex
        },
        {
          "profile.firstName": regex
        }
      ]
    };
  }
  if (Roles.userIsInRole(this.userId, 'admin')) {
    return Meteor.users.find(query, {
      sort: {
        createdAt: -1
      },
      fields: {
        emails: 1,
        roles: 1,
        profile: 1,
        createdAt: 1,
        userCode: 1,
        firstOrder: 1
      },
      limit: 10
    });
  }
});
Meteor.publish('jobAdders', function(orderId) {
  if (!this.userId) {
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, 'admin')) {
    var ids = [];
    Jobs.find({
      orderId: orderId,
      deleted: false
    }).map(function(jb) {
      ids.push(jb.adderId);
    });
    PaidJobs.find({
      orderId: orderId,
      deleted: false
    }).map(function(jb) {
      ids.push(jb.adderId);
    });
    ids.push(Orders.findOne({
      _id: orderId
    }).userId);
    var options = {
      fields: {
        emails: 1,
        profile: 1,
        createdAt: 1,
        roles: 1
      }
    };
    return Meteor.users.find({
      _id: {
        $in: ids
      }
    }, options);
  }
});


Meteor.publish('allSellers', function() {
  if (!this.userId) {
    return this.ready();
  }
  if (Roles.userIsInRole(this.userId, 'admin')) {
    var options = {
      fields: {
        emails: 1
      }
    };
    return Meteor.users.find({
      roles: 'seller'
    }, options);
  }
});

Meteor.publish('profile', function(id) {
  if (!this.userId) {
    return this.ready();
  }
  let options = {
    fields: {
      emails: 1,
      roles: 1,
      profile: 1,
      createdAt: 1,
      userCode: 1,
      firstOrder: 1
    }
  };
  if (Roles.userIsInRole(id, 'buyer')) {
    var code = Meteor.users.findOne({
      _id: id
    }).userCode;
    //    console.log('in buyer');
    return Meteor.users.find({
      $or: [{
          _id: id
        },
        {
          "profile.refCodeBy": code
        }
      ]
    }, options);
  } else {
    return Meteor.users.find({
      _id: id
    }, options);
  }
});
