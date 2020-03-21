require("dotenv").config({ path: "../.env" });

const { client, dbName } = require("../config");

async function Migrating() {
    try {
        await client.connect();
        const db = await client.db(dbName);

        await db.createCollection("Sellers", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "email",
                        "password",
                        "image_url",
                        "phone_number",
                        "seller_category",
                        "slug",
                        "links",
                        "collections",
                        "chat_bots"
                    ],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        image_url: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        phone_number: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        seller_category: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        slug: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        links: {
                            bsonType: "array",
                            description: "must be a array and is required",
                        },
                        collections: {
                            bsonType: "array",
                            description: "must be a array and is required",
                        },
                        chat_bots: {
                            bsonType: "array",
                            description: "must be a array and is required",
                        },
                    }
                }
            }
        });
        console.log("Success migrate `Sellers`");
        await db.createCollection("Customers", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "name",
                        "email",
                        "password",
                        "image_url",
                        "slug",
                        "links"
                    ],
                    properties: {
                        name: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        email: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        password: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        image_url: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        phone_number: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        slug: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        links: {
                            bsonType: "array",
                            description: "must be a array and is required",
                        },
                    }
                }
            }
        });
        console.log("Success migrate `Customers`");
        await db.createCollection("Chats", {
            validator: {
                $jsonSchema: {
                    bsonType: "object",
                    required: [
                        "link",
                        "seller_slug",
                        "customer_slug",
                        "chats",
                    ],
                    properties: {
                        link: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        seller_slug: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        customer_slug: {
                            bsonType: "string",
                            description: "must be a string and is required",
                        },
                        chats: {
                            bsonType: "array",
                            description: "must be a array and is required",
                        },
                    }
                }
            }
        });
        console.log("Success migrate `Chats`");
        client.close();
    } catch (err) {
        console.log(err);
        client.close();
    }
}

Migrating();