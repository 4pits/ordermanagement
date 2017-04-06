Template.registerHelper("showmorecodebutton", function(running) {
    var id = Meteor.userId();

    if (Roles.userIsInRole(id, 'two-ride-seller')) {
        return running < 2;
    } else if (Roles.userIsInRole(id, 'ten-ride-seller')) {
        return running < 10;
    } else if (Roles.userIsInRole(id, 'twenty-ride-seller')) {
        return running < 20;
    } else if (Roles.userIsInRole(id, 'premium-seller')) {
        return running < 50;
    } else if (Roles.userIsInRole(id, 'admin')) {
        return running < 1000;
    }
    return false;

});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('MMMM Do hh:mm A');
});

Template.registerHelper('formatDay', function(date) {
    return moment(date).format('MMMM Do YYYY');
});
