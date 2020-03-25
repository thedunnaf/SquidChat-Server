const bcrypt = require('../helpers/bcrypt')
const request = require('supertest')
const app = require('../app')
const jwt = require('../helpers/jwt')
const SELLER_NAME = 'Nanda'
const SELLER_EMAIL = 'nanda@gmail.com'
const SELLER_PASSWORD = 'nanda'
const SELLER_IMAGE_URL = 'https://asset.kompas.com/crops/o4-cO3zGUI1UPgabt2c3dWcGLBY=/0x43:1333x932/750x500/data/photo/2019/10/30/5db92a4ef1bb9.jpg'
const SELLER_PHONE_NUMBER = '081324037470'
const SELLER_CATEGORY = 'kesehatan'
let FAKE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzbHVnIjoiTmFuZGFfMTU4NTA0NzA3MjExNCIsImlhdCI6MTU4NTA0ODIyMX0.-0CN4CK5XClwaZsBi1DIv79HtHV9Uj_WtEEh4Ubel6o'
let TOKEN
let CHAT_BOT_ID
let FAKE_CHAT_BOT_ID = 'chatbot_1585049416898'
let COLLECTION_ID
let FAKE_COLLECTION_ID = 'collection_1585067777497'
let FIELD_ID


expect.extend({
    toBeTypeOf(value, argument) {
        const valueType = typeof value;
        let type = '';
        if (valueType === 'object') {
            if (Array.isArray(value)) {
                type = 'array';
            } else {
                type = valueType;
            }
        } else {
            type = valueType;
        }
        if (type === argument) {
            return {
                message: () => `expected ${value} to be type of ${type}`,
                pass: trueexpect(seller).toHaveProperty('password', SELLER_PASSWORD)
            };
        } else {
            return {
                message: () => `expected ${value} to be type of ${type}`,
                pass: false
            };
        }
    }
});


describe('Test Seller Auth', function () {
    describe('Test Seller Register Route', function () {
        describe('Test Seller Register Success', function () {
            test('Should return 201 and object (message, status, payload)', function (done) {
                request(app)
                    .post('/sellers/register')
                    .send({
                        seller_category: SELLER_CATEGORY,
                        email: SELLER_EMAIL,
                        name: SELLER_NAME,
                        password: SELLER_PASSWORD,
                        image_url: SELLER_IMAGE_URL,
                        phone_number: SELLER_PHONE_NUMBER
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(201)
                        const decode = bcrypt.comparePassword(SELLER_PASSWORD, payload.seller.password)
                        expect(body).toHaveProperty('message', 'Register success!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.seller).toHaveProperty('name', SELLER_NAME)
                        expect(payload.seller).toHaveProperty('email', SELLER_EMAIL)
                        expect(decode).toBe(true)
                        expect(payload.seller).toHaveProperty('image_url', SELLER_IMAGE_URL)
                        expect(payload.seller).toHaveProperty('phone_number', SELLER_PHONE_NUMBER)
                        expect(payload.seller).toHaveProperty('seller_category', SELLER_CATEGORY)
                        expect(payload.seller).toHaveProperty('slug')
                        expect(payload.seller).toHaveProperty('links')
                        expect(payload.seller).toHaveProperty('collections')
                        expect(payload.seller).toHaveProperty('chat_bots')
                        expect(payload.seller).toHaveProperty('_id')
                        done()
                    })
            })
        })

        describe('Test Register Failed', function () {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .post('/sellers/register')
                    .send({
                        "name": "",
                        "email": "",
                        "password": "",
                        "image_url": "",
                        "phone_number": "",
                        "seller_category": ""
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Name`!, Please fill `Email`!, Please fill `Password`!, Please fill `Phone Number`!, Please Choose `Seller Category`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })
    })

    describe('Test Seller Login Router', function () {
        describe('Test Seller Login Success', function () {
            test('Should return status 201 and object(message, status, payload)', function (done) {
                request(app)
                    .post('/sellers/login')
                    .send({
                        email: SELLER_EMAIL,
                        password: SELLER_PASSWORD
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        TOKEN = payload.token
                        console.log(TOKEN)
                        const decode = jwt.verifyToken(payload.token)
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Login successful!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload).toHaveProperty('token', expect.any(String))
                        expect(decode).toHaveProperty('slug')
                        done()
                    })
            })
        })

        describe('Test Seller Login Failed because ', function () {
            test('Should return status 400 and object(mesage, status)', function (done) {
                request(app)
                    .post('/sellers/login')
                    .send({
                        email: '',
                        password: ''
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Email`!, Please fill `Password`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Login User Not Found', function () {
            test('Should return status 404 and object(message, status)', function (done) {
                request(app)
                    .post('/sellers/login')
                    .send({
                        email: 'nanda',
                        password: 'nanda'
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Login Wrong Password', function () {
            test('Should return status 403 and object(message, status)', function (done) {
                request(app)
                    .post('/sellers/login')
                    .send({
                        email: SELLER_EMAIL,
                        password: 'kuda'
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(403)
                        expect(body).toHaveProperty('message', 'Password not match!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })
    })

    describe('Test Customer Update Account', function () {
        describe('Test Customer Update Account Success', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .put('/sellers/updateAccount')
                    .send({
                        seller_category: SELLER_CATEGORY,
                        email: SELLER_EMAIL,
                        name: SELLER_NAME,
                        password: SELLER_PASSWORD,
                        image_url: SELLER_IMAGE_URL,
                        phone_number: SELLER_PHONE_NUMBER
                    })
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(200)
                        const decode = bcrypt.comparePassword(SELLER_PASSWORD, payload.seller.password)
                        expect(body).toHaveProperty('message', 'Successful update account!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.seller).toHaveProperty('name', SELLER_NAME)
                        expect(payload.seller).toHaveProperty('email', SELLER_EMAIL)
                        expect(decode).toBe(true)
                        expect(payload.seller).toHaveProperty('image_url', SELLER_IMAGE_URL)
                        expect(payload.seller).toHaveProperty('phone_number', SELLER_PHONE_NUMBER)
                        expect(payload.seller).toHaveProperty('seller_category', SELLER_CATEGORY)
                        expect(payload.seller).toHaveProperty('slug')
                        expect(payload.seller).toHaveProperty('links')
                        expect(payload.seller).toHaveProperty('collections')
                        expect(payload.seller).toHaveProperty('chat_bots')
                        expect(payload.seller).toHaveProperty('_id')
                        done()

                    })
            })
        })

        describe('Test Customer Update Account Failed Because User Not Found', () => {
            test('Should return 404 and object(message, status, payload)', function (done) {
                request(app)
                    .put('/sellers/updateAccount')
                    .send({
                        seller_category: SELLER_CATEGORY,
                        email: SELLER_EMAIL,
                        name: SELLER_NAME,
                        password: SELLER_PASSWORD,
                        image_url: SELLER_IMAGE_URL,
                        phone_number: SELLER_PHONE_NUMBER
                    })
                    .set('token', FAKE_TOKEN)
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()

                    })
            })
        })

        describe('Test Seller Update Account Failed', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .put('/sellers/updateAccount')
                    .send({
                        "name": "",
                        "email": "",
                        "password": "",
                        "image_url": "",
                        "phone_number": "",
                        "seller_category": ""
                    })
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        // const { payload } = body
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Name`!, Please fill `Email`!, Please fill `Password`!, Please fill `Phone Number`!, Please Choose `Seller Category`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()

                    })
            })
        })
    })

    describe('Test Seller Dashboard', function () {
        describe('Test Seller Dashboard Success', function () {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .get('/sellers/dashboard')
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Successful access dashboard!')
                        expect(body).toHaveProperty('status', 'success')
                        console.log(payload)
                        const decode = bcrypt.comparePassword(SELLER_PASSWORD, payload.seller.password)
                        expect(payload.seller).toHaveProperty('name', SELLER_NAME)
                        expect(payload.seller).toHaveProperty('email', SELLER_EMAIL)
                        expect(decode).toBe(true)
                        expect(payload.seller).toHaveProperty('image_url', SELLER_IMAGE_URL)
                        expect(payload.seller).toHaveProperty('phone_number', SELLER_PHONE_NUMBER)
                        expect(payload.seller).toHaveProperty('seller_category', SELLER_CATEGORY)
                        expect(payload.seller).toHaveProperty('slug')
                        expect(payload.seller).toHaveProperty('links')
                        expect(payload.seller).toHaveProperty('collections')
                        expect(payload.seller).toHaveProperty('chat_bots')
                        expect(payload.seller).toHaveProperty('_id')
                        done()
                    })
            })
        })

        describe('Test Seller Dashboard Failed User Not Found', function () {
            test('Should return 404 and object(message, status, payload)', function (done) {
                request(app)
                    .get('/sellers/dashboard')
                    .set('token', FAKE_TOKEN)
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Dashboard Failed because invalid token', function () {
            test(`Should return status 401 and object(message, status)`, function (done) {
                request(app)
                    .get('/sellers/dashboard')
                    .set('token', 'awdwdawd12121')
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(401)
                        expect(body).toHaveProperty('message', 'Token invalid!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })
    })

    describe('Test Seller ChatBot', function () {
        describe('Test Seller Create ChatBot', () => {
            test('Should return 200 and object(message, status)', function (done) {
                request(app)
                    .patch('/sellers/createChatBot')
                    .set('token', TOKEN)
                    .send({
                        question: 'Hai Apa Kabar',
                        answer: 'Luar Biasa'
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(200)
                        CHAT_BOT_ID = payload.chat_bot.id
                        expect(body).toHaveProperty('message', 'Create chat bot sucessful!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.chat_bot).toHaveProperty('id')
                        expect(payload.chat_bot).toHaveProperty('question', 'Hai Apa Kabar')
                        expect(payload.chat_bot).toHaveProperty('answer', 'Luar Biasa')
                        expect(payload.chat_bot).toHaveProperty('created_at')
                        done()
                    })
            })
        })

        describe('Test Seller Create ChatBot Failed User Not Found', () => {
            test('Should return 404 and object(message, status)', function (done) {
                request(app)
                    .patch('/sellers/createChatBot')
                    .set('token', FAKE_TOKEN)
                    .send({
                        question: 'Hai Apa Kabar',
                        answer: 'Luar Biasa'
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Create ChatBot Failed Because Answer empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch('/sellers/createChatBot')
                    .set('token', TOKEN)
                    .send({
                        question: 'Hai Apa Kabar'
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Answer`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Create ChatBot Failed Because Answer empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch('/sellers/createChatBot')
                    .set('token', TOKEN)
                    .send({
                        question: '',
                        answer: 'Luar Biasa'
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Question`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Create ChatBot Failed Because Answer empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch('/sellers/createChatBot')
                    .set('token', TOKEN)
                    .send({
                        question: '',
                        answer: ''
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Question`!, Please choose `Answer`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Update ChatBot Success', () => {
            test('Should return 200 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/updateChatBot/${CHAT_BOT_ID}`)
                    .set('token', TOKEN)
                    .send({
                        question: 'Hai Apa Kabar',
                        answer: 'Luar Biasa'
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Update chat bot sucessful!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.chat_bot).toHaveProperty('id')
                        done()
                    })
            })
        })

        describe('Test Seller Update ChatBot Failed Cause User Not Found', () => {
            test('Should return 404 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/updateChatBot/${CHAT_BOT_ID}`)
                    .set('token', FAKE_TOKEN)
                    .send({
                        question: 'Hai Apa Kabar',
                        answer: 'Luar Biasa Abang'
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Update ChatBot Failed Cause Question is Empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/updateChatBot/${CHAT_BOT_ID}`)
                    .set('token', TOKEN)
                    .send({
                        question: '',
                        answer: 'Luar Biasa'
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Question`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })


        describe('Test Seller Update ChatBot Failed Answer Empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/updateChatBot/${CHAT_BOT_ID}`)
                    .set('token', TOKEN)
                    .send({
                        question: 'Hai Apa Kabar',
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Answer`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Update ChatBot Failed Answer Empty', () => {
            test('Should return 400 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/updateChatBot/${CHAT_BOT_ID}`)
                    .set('token', TOKEN)
                    .send({
                        question: '',
                        answer: ''
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please choose `Question`!, Please choose `Answer`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Delete ChatBot', () => {
            test('Should return 200 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/destroyChatBot/${CHAT_BOT_ID}`)
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(200)
                        console.log(body, '==================================')
                        expect(body).toHaveProperty('message', 'Destroy chat bot sucessful!')
                        expect(body).toHaveProperty('status', 'success')
                        done()
                    })
            })
        })

        describe('Test Seller Delete ChatBot', () => {
            test('Should return 404 and object(message, status)', function (done) {
                request(app)
                    .patch(`/sellers/destroyChatBot/${CHAT_BOT_ID}`)
                    .set('token', FAKE_TOKEN)
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'User not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })
    })

    describe('Test Seller  Collection', function () {
        describe('Test Seller Create Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/createCollection`)
                    .set('token', TOKEN)
                    .send({
                        collection_name: "Ruangan Mayat"
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        console.log(body)
                        COLLECTION_ID = payload.collection.id
                        expect(status).toBe(201)
                        expect(body).toHaveProperty('message', 'Success create collection!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.collection).toHaveProperty('id')
                        expect(payload.collection).toHaveProperty('collection_name', 'Ruangan Mayat')
                        expect(payload.collection).toHaveProperty('fields')
                        expect(payload.collection).toHaveProperty('created_at')
                        done()
                    })
            })
        })

        describe('Test Update Collection Failed', function () {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/updateCollection/${COLLECTION_ID}`)
                    .set('token', TOKEN)
                    .send({
                        collection_name: ""
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Collection Name`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })


        })

        describe('Test Seller Update Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/updateCollection/${COLLECTION_ID}`)
                    .set('token', TOKEN)
                    .send({
                        collection_name: "Ruangan Mayat"
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        console.log(body)
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Success update collection!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.collection).toHaveProperty('id')
                        expect(payload.collection).toHaveProperty('collection_name', 'Ruangan Mayat')
                        expect(payload.collection).toHaveProperty('fields')
                        done()
                    })
            })
        })

        describe('Test Seller Collection', function () {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/createCollection`)
                    .set('token', TOKEN)
                    .send({
                        collection_name: ""
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Collection Name`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })


        })

        describe('Test Seller Delete Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/destroyCollection/${COLLECTION_ID}`)
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Success delete collection!')
                        expect(body).toHaveProperty('status', 'success')
                        done()
                    })
            })
        })


    })

    describe('Test Seller Field', function () {

        describe('Test Seller Create Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/createCollection`)
                    .set('token', TOKEN)
                    .send({
                        collection_name: "Ruangan Mayat"
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        COLLECTION_ID = payload.collection.id
                        console.log(COLLECTION_ID)
                        done()
                    })
            })
        })



        describe('Test Seller Create Field', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/createField/${COLLECTION_ID}`)
                    .set('token', TOKEN)
                    .send({
                        field_name: 'VVIP',
                        value: 20
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        FIELD_ID = payload.field.id
                        expect(status).toBe(201)
                        expect(body).toHaveProperty('message', 'Success create field!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.field).toHaveProperty('id')
                        expect(payload.field).toHaveProperty('field_name', 'VVIP')
                        expect(payload.field).toHaveProperty('value', 20)
                        done()
                    })
            })
        })

        describe('Test Seller Create Field', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/createField/${FAKE_COLLECTION_ID}`)
                    .set('token', TOKEN)
                    .send({
                        field_name: 'VVIP',
                        value: 20
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'Data not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Update Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/updateField/${COLLECTION_ID}/${FIELD_ID}`)
                    .set('token', TOKEN)
                    .send({
                        field_name: 'VVIP',
                        value: 20
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        console.log(body)
                        FIELD_ID = payload.field.id
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Success update field!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.field).toHaveProperty('id')
                        expect(payload.field).toHaveProperty('field_name', 'VVIP')
                        expect(payload.field).toHaveProperty('value', 20)
                        done()
                    })
            })
        })

        describe('Test Seller Update Collection Failed Collection Not Found', () => {
            test('Should return 404 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/updateField/${FAKE_COLLECTION_ID}/${FIELD_ID}`)
                    .set('token', TOKEN)
                    .send({
                        field_name: 'VVIP',
                        value: 20
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        expect(status).toBe(404)
                        expect(body).toHaveProperty('message', 'Data not found!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

        describe('Test Seller Delete Collection', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch(`/sellers/destroyField/${COLLECTION_ID}/${FIELD_ID}`)
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Success delete field!')
                        expect(body).toHaveProperty('status', 'success')
                        done()
                    })
            })
        })
    })

})