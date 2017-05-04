Template.registerHelper('formatDate', function(date) {
    return moment(date).format('MMMM Do hh:mm A');
});

Template.registerHelper('formatDay', function(date) {
    return moment(date).format('MMMM Do YYYY');
});

Template.registerHelper('formatDay2', function(date) {
    return moment(date).format('MMM Do');
});
