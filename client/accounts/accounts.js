var myLogoutFunc = function() {
    Session.set("nav-login", '');
    FlowRouter.go('/');
}

var mySubmitFunc = function(error, state) {
    if (!error) {
        if (state === 'signIn') {
            if (Roles.userIsInRole(Meteor.userId, 'seller')) {
                //          console.log('mySubmitFunc  seller');
                FlowRouter.go('/jobs');
            } else if (Roles.userIsInRole(Meteor.userId, 'buyer')) {
                //        console.log('mySubmitFunc  buyer');
                FlowRouter.go('/orders');
            }
        }
        if (state === 'signUp') {
            FlowRouter.go('/');
        }
    }

}

AccountsTemplates.configure({
    onLogoutHook: myLogoutFunc,
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',
    homeRoutePath: '/',
    onSubmitHook: mySubmitFunc
});
AccountsTemplates.addField({
    _id: 'firstName',
    type: 'text',
    displayName: 'First Name',
    required: true,
    minLength: 4,
    placeholder: {
        signUp: "First Name"
    }
});
