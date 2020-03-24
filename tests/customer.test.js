const { CustomerModel, SellerModel, ChatModel } = require("../models");
const request = require('supertest')
const app = require('../app')
const jwt = require('../helpers/jwt')
const bcrypt = require('../helpers/bcrypt')
const CUSTOMER_NAME = 'Kuda'
const CUSTOMER_PASSWORD = 'Liar'
const CUSTOMER_EMAIL = 'kudaliar@mail.com'
const CUSTOMER_IMAGE = 'https://asset.kompas.com/crops/o4-cO3zGUI1UPgabt2c3dWcGLBY=/0x43:1333x932/750x500/data/photo/2019/10/30/5db92a4ef1bb9.jpg'
let TOKEN


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
                pass: true
            };
        } else {
            return {
                message: () => `expected ${value} to be type of ${type}`,
                pass: false
            };
        }
    }
});

describe('Test Cutomer Auth', function () {
    describe('Test Customer Register Route', () => {
        describe('Test Register Success', function () {
            test(`Should return 200  and object (message, status, payload)`, function (done) {
                request(app)
                    .post('/customers/register')
                    .send({
                        name: CUSTOMER_NAME,
                        email: CUSTOMER_EMAIL,
                        password: CUSTOMER_PASSWORD,
                        image_url: CUSTOMER_IMAGE
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(201)
                        // console.log(payload.customer.password)
                        // console.log(customer)
                        const decode = bcrypt.comparePassword(CUSTOMER_PASSWORD, payload.customer.password)
                        expect(body).toHaveProperty('message', 'Register success!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.customer).toHaveProperty('name', CUSTOMER_NAME)
                        expect(payload.customer).toHaveProperty('email', CUSTOMER_EMAIL)
                        expect(decode).toBe(true)
                        expect(payload.customer).toHaveProperty('image_url', CUSTOMER_IMAGE)
                        expect(payload.customer).toHaveProperty('slug')
                        expect(payload.customer).toHaveProperty('links')
                        expect(payload.customer).toHaveProperty('_id')
                        done()
                    })
            })
        })

        describe('Register Validation Error', function () {
            test(`Should return 400 and object(message) when email, password, name is not declared`, function (done) {
                request(app)
                    .post('/customers/register')
                    .send({
                        name: '',
                        email: '',
                        password: '',
                        image_url: ''
                    })
                    .then(response => {
                        const { body, status } = response
                        expect(status).toBe(400)
                        expect(body).toHaveProperty('message', 'Please fill `Name`!, Please fill `Email`!, Please fill `Password`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()
                    })
            })
        })

    })

    describe('Test Customer Login Route', function () {
        describe('Test Customer Login Success', () => {
            test('Should return status 200 and object (message, status, payload)', function (done) {
                request(app)
                    .post('/customers/login')
                    .send({
                        email: CUSTOMER_EMAIL,
                        password: CUSTOMER_PASSWORD
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        const decoded = jwt.verifyToken(payload.token)
                        TOKEN = payload.token
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Login successful!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload).toHaveProperty('token', expect.any(String))
                        expect(decoded).toHaveProperty('slug')
                        done()
                    })
            })
        })

        describe('Test Customer where email and password empty', () => {
            test('Should return status 400 and object (message, status)', function (done) {
                request(app)
                    .post('/customers/login')
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

        describe('Test Customer where user not found', () => {
            test('Should return status 400 and object (message, status)', function (done) {
                request(app)
                    .post('/customers/login')
                    .send({
                        email: 'haaha',
                        password: 'lucu'
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

        describe('Test Seller Login Wrong Password', () => {
            test('Should return status 403 and object(message, status)', function (done) {
                request(app)
                    .post('/customers/login')
                    .send({
                        email: CUSTOMER_EMAIL,
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
                    .put('/customers/updateAccount')
                    .send({
                        name: CUSTOMER_NAME,
                        email: CUSTOMER_EMAIL,
                        password: CUSTOMER_PASSWORD,
                        image_url: CUSTOMER_IMAGE
                    })
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(200)
                        const decode = bcrypt.comparePassword(CUSTOMER_PASSWORD, payload.customer.password)
                        expect(body).toHaveProperty('message', 'Successful update account!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload.customer).toHaveProperty('name', CUSTOMER_NAME)
                        expect(payload.customer).toHaveProperty('email', CUSTOMER_EMAIL)
                        expect(decode).toBe(true)
                        expect(payload.customer).toHaveProperty('image_url', CUSTOMER_IMAGE)
                        expect(payload.customer).toHaveProperty('slug')
                        expect(payload.customer).toHaveProperty('links')
                        expect(payload.customer).toHaveProperty('_id')
                        done()

                    })
            })
        })

        describe('Test Customer Update Account Success', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .put('/customers/updateAccount')
                    .send({
                        name: "",
                        email: "",
                        password: "",
                        image_url: ""
                    })
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        // const { payload } = body
                        expect(status).toBe(400)
                        console.log(body, '======================')
                        expect(body).toHaveProperty('message', 'Please fill `Name`!, Please fill `Email`!, Please fill `Password`!')
                        expect(body).toHaveProperty('status', 'error')
                        done()

                    })
            })
        })
    })

    describe('Test Customer Dashboard', function () {
        describe('Test Customer Dashboard Success', () => {
            test('Should return 400 and object(message, status, payload)', function (done) {
                request(app)
                    .get('/customers/dashboard')
                    .set('token', TOKEN)
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        console.log(payload.customer.links)
                        expect(status).toBe(200)
                        expect(body).toHaveProperty('message', 'Successful access dashboard!')
                        expect(body).toHaveProperty('status', 'success')
                        expect(payload).toHaveProperty('customer')
                        expect(payload).toHaveProperty('sellers')
                        done()
                    })
            })
        })

        describe('Test Customer Dashboard Failed because invalid token', () => {
            test(`Should return status 401 and object(message, status)`, function (done) {
                request(app)
                    .get('/customers/dashboard')
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

    describe('Test Customer Link', function () {
        let SELLER_SLUG
        describe('Test Seller Register Success', function () {
            test('Should return 201 and object (message, status, payload)', function (done) {
                request(app)
                    .post('/sellers/register')
                    .send({
                        seller_category: 'Kesehatan',
                        email: 'kuda@mail.com',
                        name: 'kuda',
                        password: 'kudaliar',
                        image_url: '',
                        phone_number: '087880070375'
                    })
                    .then(response => {
                        const { body, status } = response
                        const { payload } = body
                        expect(status).toBe(201)
                        SELLER_SLUG = payload.seller.slug
                        done()
                    })
            })
        })



        describe('Test Customer Create Link', () => {
            test('Should return 200 and object(message, status, payload)', function (done) {
                request(app)
                    .patch('/customers/createLink')
                    .set('token', TOKEN)
                    .send({
                        sellerSlug: SELLER_SLUG
                    })
                    .then(response => {
                        const { body, status } = response
                        console.log(body)
                        // expect(status).toBe(401)
                        // expect(body).toHaveProperty('message', 'Succesful add chat!')
                        // expect(body).toHaveProperty('status', 'success')
                        done()
                    })
            })
        })
    })

})


