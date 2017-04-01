var postSignUp = function(userId, info) {
    //  console.log(userId);
    //  console.log(info.profile);
    Roles.addUsersToRoles(userId, ['normal-user']);
}

AccountsTemplates.configure({
    postSignUpHook: postSignUp
});
