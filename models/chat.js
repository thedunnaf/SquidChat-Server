class ChatModel {
    static findAll(collection, link) {
        return collection.find({ link }).toArray();
    }
    static findOne(collection, link) {
        return collection.findOne({ link });
    }
    static create(collection, obj) {
        return collection.insertOne(obj);
    }
    static update(collection, link, obj) {
        return collection.updateOne({ link }, { $set: obj });
    }
    static destroy(collection, id) {
        return collection.deleteOne({ id: id });
    }
}

module.exports = ChatModel;