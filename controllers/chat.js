const { ChatModel, SellerModel } = require("../models");
const { Tokenizer, Stemmer } = require("sastrawijs");
const tokenizer = new Tokenizer;
const stemmer = new Stemmer;

class ChatController {
    static async findAll(req, res, next) {
        const collection = req.chatCollection;
        const link = req.body.link;
        const chats = await ChatModel.findOne(collection, link);
        if (!chats) {
            res.status(404).json({
                message: "Data not found!",
                status: "error"
            });
        } else {
            res.status(200).json({
                message: "Success get all chat!",
                status: "success",
                payload: {
                    chats
                }
            });
        }
    }
    static async chat(req, res, next) {
        const collection = req.chatCollection;
        const collection2 = req.sellerCollection;
        const sellerSlug = req.loggedSellerSlug;
        const customerSlug = req.loggedCustomerSlug;
        const link = req.body.link;
        const text = req.body.text;
        const created_at = new Date();
        const chat = await ChatModel.findOne(collection, link);
        let obj;
        let obj2;
        if (sellerSlug) {
            obj = {
                text,
                role: "seller",
                created_at
            }
        } else if (customerSlug) {
            obj = {
                text,
                role: "customer",
                created_at
            }
            const tokenized = tokenizer.tokenize(text);
            const stemmed = [];
            tokenized.forEach(el => {
                stemmed.push(stemmer.stem(el));
            });
            const slug = chat.seller_slug;
            const seller = await SellerModel.findOne(collection2, slug);
            let count = 0;
            let answer = "";
            seller.chat_bots.forEach((el, i) => {
                let count2 = 0;
                el.key.forEach(el2 => {
                    stemmed.forEach(el3 => {
                        if (el2 == el3) {
                            count2++;
                        }
                    });
                });
                if (count2 > (el.key.length * 80 / 100)) {
                    if (count2 > count) {
                        count = count2;
                        answer = el.answer;
                    }
                }
            });
            if (count > 0) {
                obj2 = {
                    text: answer,
                    role: "seller",
                    created_at
                }
            }
        }
        chat.chats.unshift(obj);
        if (obj2) {
            chat.chats.unshift(obj2);
        }
        await ChatModel.update(collection, link, chat);
        res.status(201).json({
            message: "Succesful add chat!",
            status: "succes",
            payload: {
                chat
            }
        });
    }
}

module.exports = ChatController;