class SellerModel {
    static login(collection, email) {
        return collection.findOne({ email: email });
    }
    static findAll(collection) {
        return collection.find({}).toArray();
    }
    static findOne(collection, slug) {
        return collection.findOne({ slug: slug });
    }
    static create(collection, obj) {
        return collection.insertOne(obj);
    }
    static update(collection, slug, obj) {
        return collection.updateOne({ slug: slug }, { $set: obj });
    }
    static destroy(collection, slug) {
        return collection.deleteOne({ slug: slug });
    }
}

module.exports = SellerModel;