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
        const answers = [];
        if (sellerSlug) {
            obj = {
                text,
                seller_slug: sellerSlug,
                created_at
            }
        } else if (customerSlug) {
            obj = {
                text,
                customer_slug: customerSlug,
                created_at
            }
            const tokenized = tokenizer.tokenize(text);
            const stemmed = [];
            tokenized.forEach(el => {
                stemmed.push(stemmer.stem(el));
            });
            const slug = chat.seller_slug;
            const seller = await SellerModel.findOne(collection2, slug);
            seller.chat_bots.forEach((el, i) => {
                let count = 0;
                el.key.forEach(el2 => {
                    stemmed.forEach(el3 => {
                        if (el2 == el3) {
                            count++;
                        }
                    });
                });
                if (count > (stemmed.length * 80 / 100)) {
                    answers.push(el.answer);
                }
            });
        }
        chat.chats.unshift(obj);
        await ChatModel.update(collection, link, chat);
        res.status(201).json({
            message: "Succesful add chat!",
            status: "succes",
            payload: {
                chat,
                answers: answers
            }
        });
    }
}

module.exports = ChatController;