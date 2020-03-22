
// const request = require('supertest')
// const app = require('../app')
// const jwt = require('../helpers/jwt')
// const SELLER_NAME = 'Nanda'
// const SELLER_EMAIL = 'nanda@gmail.com'
// const SELLER_PASSWORD = 'nanda'
// const SELLER_IMAGE_URL = 'https://asset.kompas.com/crops/o4-cO3zGUI1UPgabt2c3dWcGLBY=/0x43:1333x932/750x500/data/photo/2019/10/30/5db92a4ef1bb9.jpg'
// const SELLER_PHONE_NUMBER = '081324037470'
// const SELLER_CATEGORY = 'kesehatan'
// let TOKEN


// expect.extend({
//     toBeTypeOf(value, argument) {
//         const valueType = typeof value;
//         let type = '';
//         if (valueType === 'object') {
//             if (Array.isArray(value)) {
//                 type = 'array';
//             } else {
//                 type = valueType;
//             }
//         } else {
//             type = valueType;
//         }
//         if (type === argument) {
//             return {
//                 message: () => `expected ${value} to be type of ${type}`,
//                 pass: true
//             };
//         } else {
//             return {
//                 message: () => `expected ${value} to be type of ${type}`,
//                 pass: false
//             };
//         }
//     }
// });


// describe('Test Seller Auth', function () {
//     describe('Test Seller Register Route', function () {
//         describe('Test Seller Register Success', function () {
//             test('Should return 201 and object (message, status, payload)', function (done) {
//                 request(app)
//                     .post('/sellers/register')
//                     .send({
//                         category: SELLER_CATEGORY,
//                         email: SELLER_EMAIL,
//                         name: SELLER_NAME,
//                         password: SELLER_PASSWORD,
//                         image_url: SELLER_IMAGE_URL,
//                         phone_number: SELLER_PHONE_NUMBER
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         const { payload: seller } = body
//                         expect(status).toBe(201)
//                         expect(body).toHaveProperty('message', 'Register Succes')
//                         expect(body).toHaveProperty('status', 'success')
//                         expect(seller).toHaveProperty('name', SELLER_NAME)
//                         expect(seller).toHaveProperty('email', SELLER_EMAIL)
//                         expect(seller).toHaveProperty('password', SELLER_PASSWORD)
//                         expect(seller).toHaveProperty('image_url', SELLER_IMAGE_URL)
//                         expect(seller).toHaveProperty('phone_number', SELLER_PHONE_NUMBER)
//                         expect(seller).toHaveProperty('seller_category', SELLER_CATEGORY)
//                         expect(seller).toHaveProperty('slug')
//                         expect(seller).toHaveProperty('links')
//                         expect(seller).toHaveProperty('collections')
//                         expect(seller).toHaveProperty('chat_bots')
//                         expect(seller).toHaveProperty('_id')
//                         done()
//                     })
//             })
//         })

//         describe('Test Register Failed', function () {
//             test('Should return 400 and object(message, status)', function (done) {
//                 request(app)
//                     .post('/sellers/register')
//                     .send({
//                         "name": "",
//                         "email": "",
//                         "password": "",
//                         "image_url": "",
//                         "phone_number": "",
//                         "seller_category": ""
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         expect(status).toBe(400)
//                         expect(body).toHaveProperty('message', 'Please fill `Name`!, Please fill `Email`!, Please fill `Password`!, Please fill `Phone Number`!, Please Choose `Seller Category`!')
//                         expect(body).toHaveProperty('status', 'error')
//                         done()
//                     })
//             })
//         })
//     })

//     describe('Test Seller Login Router', function () {
//         describe('Test Seller Login Success', function () {
//             test('Should return status 201 and object(message, status, payload)', function (done) {
//                 request(app)
//                     .post('/sellers/login')
//                     .send({
//                         email: SELLER_EMAIL,
//                         password: SELLER_PASSWORD
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         const { payload } = body
//                         console.log(payload)
//                         TOKEN = payload.token
//                         const decode = jwt.verifyToken(payload.token)
//                         expect(status).toBe(201)
//                         expect(body).toHaveProperty('message', 'Login Succes')
//                         expect(body).toHaveProperty('status', 'success')
//                         expect(payload).toHaveProperty('token', expect.any(String))
//                         expect(decode.payload).toHaveProperty('slug')
//                         done()
//                     })
//             })
//         })

//         describe('Test Seller Login Failed because ', function () {
//             test('Should return status 400 and object(mesage, status)', function (done) {
//                 request(app)
//                     .post('/sellers/login')
//                     .send({
//                         email: '',
//                         password: ''
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         expect(status).toBe(400)
//                         expect(body).toHaveProperty('message', 'Please fill `Email`!, Please fill `Password`!')
//                         expect(body).toHaveProperty('status', 'error')
//                         done()
//                     })
//             })
//         })

//         describe('Test Seller Login User Not Found', function () {
//             test('Should return status 404 and object(message, status)', function (done) {
//                 request(app)
//                     .post('/sellers/login')
//                     .send({
//                         email: 'nanda',
//                         password: 'nanda'
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         expect(status).toBe(404)
//                         expect(body).toHaveProperty('message', 'User not found!')
//                         expect(body).toHaveProperty('status', 'error')
//                         done()
//                     })
//             })
//         })

//         describe('Test Seller Login Wrong Password', function () {
//             test('Should return status 403 and object(message, status)', function (done) {
//                 request(app)
//                     .post('/sellers/login')
//                     .send({
//                         email: SELLER_EMAIL,
//                         password: 'kuda'
//                     })
//                     .then(response => {
//                         const { body, status } = response
//                         expect(status).toBe(403)
//                         expect(body).toHaveProperty('message', 'Password not match!')
//                         expect(body).toHaveProperty('status', 'error')
//                         done()
//                     })
//             })
//         })
//     })

//     describe('Test Seller Dashboard', function () {
//         describe('Test Seller Dashboard Success', function () {
//             test('Should return 200 and object(message, status, payload)', function (done) {
//                 request(app)
//                     .get('/sellers/dashboard')
//                     .set('token', TOKEN)
//                     .then(response => {
//                         const { body, status } = response
//                         const { payload: seller } = body
//                         expect(status).toBe(201)
//                         expect(body).toHaveProperty('message', 'Successful access dashboard!')
//                         expect(body).toHaveProperty('status', 'success')
//                         expect(seller).toHaveProperty('name', SELLER_NAME)
//                         expect(seller).toHaveProperty('email', SELLER_EMAIL)
//                         expect(seller).toHaveProperty('password', SELLER_PASSWORD)
//                         expect(seller).toHaveProperty('image_url', SELLER_IMAGE_URL)
//                         expect(seller).toHaveProperty('phone_number', SELLER_PHONE_NUMBER)
//                         expect(seller).toHaveProperty('seller_category', SELLER_CATEGORY)
//                         expect(seller).toHaveProperty('slug')
//                         expect(seller).toHaveProperty('links')
//                         expect(seller).toHaveProperty('collections')
//                         expect(seller).toHaveProperty('chat_bots')
//                         expect(seller).toHaveProperty('_id')
//                         done()
//                     })
//             })
//         })

//         describe('Test Seller Dashboard Failed because invalid token', function () {
//             test(`Should return status 401 and object(message, status)`, function (done) {
//                 request(app)
//                     .get('/sellers/dashboard')
//                     .set('token', 'awdwdawd12121')
//                     .then(response => {
//                         const { body, status } = response
//                         expect(status).toBe(401)
//                         expect(body).toHaveProperty('message', 'User not found!')
//                         expect(body).toHaveProperty('status', 'error')
//                         done()
//                     })
//             })
//         })
//     })

// })