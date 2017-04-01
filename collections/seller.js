Seller = new Mongo.Collection("seller");

Seller.schema = new SimpleSchema({
    userId: {
        type: String
    },
    rate: {
        type: Number
    }

});

Seller.attachSchema(Seller.schema);
