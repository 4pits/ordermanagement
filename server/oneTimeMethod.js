Meteor.methods({
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
    updateUsersRef: function() {
        if (Roles.userIsInRole(this.userId, 'admin')) {
            Meteor.users.find().map(function(user) {
                console.log(user);
                var str = user.emails[0].address;
                var name = '';
                console.log(user.profile);
                if (user.profile && user.profile.firstName)
                    name = user.profile.firstName;
                console.log(str);
                console.log(name);
                str = name.concat(str).replace(/[^a-zA-Z0-9]/g, '');
                var code = '';
                console.log(code);
                var usercount = 0;
                var count = 0;
                do {
                    code = str.substring(0 + count, 5 + count).toLowerCase();;
                    let query = {};
                    let regex = new RegExp(code, 'i');
                    query = {
                        userCode: regex
                    };
                    usercount = Meteor.users.find(query).count();
                    count++;
                } while (usercount > 0);
                //firstOrder status , 0= jsut signedup, 1= first order active, 2= first order completed.
                console.log('code ' + code);
                Meteor.users.update(user._id, {
                    $set: {
                        userCode: code,
                        firstOrder: 0
                    }
                });
            });
        }
    }
});
