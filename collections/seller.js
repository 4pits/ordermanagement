UserDetails = new Mongo.Collection("userDetails");

UserDetails.schema = new SimpleSchema({
    userId: {
        type: String
    },
    role: {
        type: Number
    }
});

UserDetails.attachSchema(UserDetails.schema);

UserDetails.allow({
    insert: function() {
        return false;
    },
    update: function() {
        return false;
    },
    remove: function() {
        return false;
    }
});

UserDetails.deny({
    insert: function() {
        return true;
    },
    update: function() {
        return true;
    },
    remove: function() {
        return true;
    }
});
