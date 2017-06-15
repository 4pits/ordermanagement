Template.registerHelper('formatDate', function(date) {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return moment(date).format('MMMM Do hh:mm:ss.SSS a');
  } else {
    return moment(date).format('MMMM Do hh:mm A');
  }
});

Template.registerHelper('formatDay', function(date) {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return moment(date).format('MMMM Do YYYY');
  } else {
    return moment(date).format('MMMM Do YYYY');
  }
});

Template.registerHelper('formatDay2', function(date) {
  if (Roles.userIsInRole(Meteor.userId(), 'admin')) {
    return moment(date).format('MMM Do');
  } else {
    return moment(date).format('MMM Do');
  }
});
