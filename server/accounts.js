var postSignUp = function(userId, info) {
    //  console.log(userId);
    //  console.log(info.profile);
    Roles.addUsersToRoles(userId, ['normal-user']);
    var str = info.email;
    var name = info.profile.firstName;
    var refCode = info.profile.refCodeBy;
    str = name.concat(str).replace(/[^a-zA-Z0-9]/g, '');
    var code = '';
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
    Meteor.users.update(userId, {
        $set: {
            userCode: code,
            firstOrder: 0
        }
    });
    //set user role to buyer if they are referred by a buyer
    var user = Meteor.users.findOne({
        userCode: refCode
    });
    //  console.log(user);
    if (user) {
        Roles.addUsersToRoles(userId, ['buyer']);
    }

}

AccountsTemplates.configure({
    postSignUpHook: postSignUp,
});

AccountsTemplates.configure({
    postSignUpHook: postSignUp,
});
