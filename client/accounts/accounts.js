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
    homeRoutePath: '/',
    onSubmitHook: mySubmitFunc,
});
AccountsTemplates.addField({
    _id: 'firstName',
    type: 'text',
    displayName: 'Name',
    required: true,
    minLength: 4,
    trim: true,
    placeholder: {
        signUp: "Name"
    }
});
AccountsTemplates.addField({
    _id: 'refCodeBy',
    type: 'text',
    displayName: 'Referral Code',
    minLength: 4,
    maxLength: 8,
    re: /^[a-z0-9]+$/,
    trim: true,
    lowercase: true,
    placeholder: {
        signUp: "Thanks to, who referred you.",
        signIn: "Thanks to, who referred you."
    }
});
