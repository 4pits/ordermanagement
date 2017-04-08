Meteor.methods({
    "toggleSeller": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'seller')) {
                Roles.removeUsersFromRoles(id, 'seller');
            } else {
                Roles.addUsersToRoles(id, 'seller');
            }
        }
    },
    "togglePremiumSeller": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'premium-seller')) {
                Roles.removeUsersFromRoles(id, 'premium-seller');
            } else {
                Roles.addUsersToRoles(id, 'premium-seller');
            }
        }
    },
    "toggle2rideSeller": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'two-ride-seller')) {
                Roles.removeUsersFromRoles(id, 'two-ride-seller');
            } else {
                Roles.addUsersToRoles(id, 'two-ride-seller');
            }
        }
    },
    "toggle10rideSeller": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'ten-ride-seller')) {
                Roles.removeUsersFromRoles(id, 'ten-ride-seller');
            } else {
                Roles.addUsersToRoles(id, 'ten-ride-seller');
            }
        }
    },
    "toggle20rideSeller": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
                Roles.removeUsersFromRoles(id, 'twenty-ride-seller');
            } else {
                Roles.addUsersToRoles(id, 'twenty-ride-seller');
            }
        }
    },

    "toggleBuyer": function(id) {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            if (Roles.userIsInRole(id, 'buyer')) {
                Roles.removeUsersFromRoles(id, 'buyer');
            } else {
                Roles.addUsersToRoles(id, 'buyer');
            }
        }
    },
    sendEmail: function(to, from, subject, text) {
        check([to, from, subject, text], [String]);
        // Let other method calls from the same client start running,
        // without waiting for the email sending to complete.
        this.unblock();
        Email.send({
            to: to,
            from: from,
            subject: subject,
            text: text
        });
    },
    updateDB: function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Jobs.update({}, {
                $set: {
                    deleted: false,
                }
            }, {
                multi: true
            });
            Orders.update({}, {
                $set: {
                    deleted: false,
                }
            }, {
                multi: true
            });
        }
    },
    gitPull: function() {
        var child_process = Npm.require('child_process');
        //    console.log(child_process);
        var ls = child_process.spawn("ls");
        ls.stdout.setEncoding("utf8");
        ls.stdout.on("data", function(data) {
            process.stdout.write(data);
            console.log(data);
        });
        //console.log(ls);
    }

});
