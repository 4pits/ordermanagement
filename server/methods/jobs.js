Meteor.methods({
  'jobs.insert': function(id, code, premium, count, adderId) {
    //avoid repeatition of code to same seller
    if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
      return Jobs.insert({
        orderId: id,
        code: code,
        count: count,
        adderId: adderId,
        premium: premium
      });
    }
  },
  'jobDone': function(id, notes) {
    if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
      Jobs.update({
        _id: id
      }, {
        $set: {
          done: true,
          notes: notes,
          updatedAt: new Date()
        }
      });
    }

  },
  'removeJob': function(id, notes) {
    if (Roles.userIsInRole(this.userId, ['admin', 'seller'])) {
      return Jobs.update({
        _id: id
      }, {
        $set: {
          deleted: true,
          notes: notes
        }
      });
    }
  },
  'payNow': function(id) {
    var j = Jobs.findOne({
      _id: id
    });
    if (j.done) {
      if (Roles.userIsInRole(this.userId, 'admin')) {
        Jobs.update({
          adderId: j.adderId,
          done: true,
          createdAt: {
            $lte: j.createdAt
          }
        }, {
          $set: {
            paid: true,
          }
        }, {
          multi: true
        });
        // archive paid jobs to paidjobs collection
        Jobs.find({
          paid: true
        }).map(function(job) {
          PaidJobs.insert({
            orderId: job.orderId,
            code: job.code,
            count: job.count,
            done: job.done,
            paid: job.paid,
            deleted: job.deleted,
            adderId: job.adderId,
            createdAt: job.createdAt,
            updatedAt: job.updatedAt,
            userId: job.userId,
            notes: job.notes,
            premium: job.premium
          });
          Jobs.remove(job._id);
        });


      }
    }

  }
});
