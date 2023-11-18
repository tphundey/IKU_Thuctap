const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const fetch = require('node-fetch');
const app = express();
const router = express.Router();
const fileUpload = require('express-fileupload');

const mongoDBUrl = "mongodb+srv://root:123@cluster0.zq6tyry.mongodb.net/thuctap?retryWrites=true&w=majority";
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: 'dsk9jrxzf',
    api_key: '612129235538518',
    api_secret: 'FZkzoeuEcvkqDZmbiqrpmoKSEVA',

});

cloudinary.uploader.upload("https://s120-ava-talk.zadn.vn/f/1/7/8/139/120/c5debf8a117bcbf7a86ed9ab75f1dc10.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {
    if (error) {
      console.error(error);
    } else {
      console.log(result);
    }
  }
);

mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB Atlas!");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.static(path.join(__dirname, 'public')));

const productsRouter = require('./products');
const cartRouter = require('./cart');
const googleAccountRouter = require('./googleAccount');
const invoiceRouter = require('./invoice');
const reviewRouter = require('./reviews');
const categoryRouter = require('./categories');

// Sử dụng các router
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/googleAccount', googleAccountRouter);
app.use('/hoadon', invoiceRouter);
app.use('/categories', categoryRouter);
app.use('/reviews', reviewRouter);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// Endpoint để hiển thị form upload


// Route chính
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/order', (req, res) => {
    try {
        const orderData = fs.readFileSync(path.join(__dirname, 'order.txt'), 'utf-8');
        const amountData = fs.readFileSync(path.join(__dirname, 'amount.txt'), 'utf-8');
        
        const orderLines = orderData.split('\n');
        const amountLines = amountData.split('\n');

        const lastOrderLine = orderLines[orderLines.length - 2];
        const lastAmountLine = amountLines[amountLines.length - 2];

        const orderId = lastOrderLine.trim(); // Lưu ý: Đây là id trực tiếp, không có tiền tố "OrderId:"
        const amount = (lastAmountLine.trim() + '000') || '1000000'; // Mặc định là 1000 nếu không tìm thấy

        res.render('order', { title: 'Thông tin thanh toán', orderId, amount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error', message: error.message });
      }
});

app.post('/create_payment_url', function (req, res, next) {

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');

    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    let config = require('config');

    let tmnCode = config.get('vnp_TmnCode');
    let secretKey = config.get('vnp_HashSecret');
    let vnpUrl = config.get('vnp_Url');
    let returnUrl = config.get('vnp_ReturnUrl');
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;

    let locale = req.body.language;
    if (locale === null || locale === '') {
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if (bankCode !== null && bankCode !== '') {
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    res.redirect(vnpUrl)
});


app.post('/saveOrder', (req, res) => {
    const { orderId, amount } = req.body;

    // Ghi chỉ số id vào tệp tin
    const orderData = `${orderId}\n`;
    const amountData = `${amount}\n`;

    fs.writeFileSync('order.txt', orderData);  // Ghi đè nội dung file, chỉ giữ lại id cuối cùng
    fs.writeFileSync('amount.txt', amountData);  // Ghi đè nội dung file, chỉ giữ lại amount cuối cùng

    res.sendStatus(200);
});

app.get('/order/vnpay_return', vnpayReturnHandler);

async function vnpayReturnHandler(req, res, next) {
    try {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        // Xóa các tham số không cần thiết
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // Sắp xếp lại tham số
        const sortedParams = sortObject(vnp_Params);

        const config = require('config');
        const tmnCode = config.get('vnp_TmnCode');
        const secretKey = config.get('vnp_HashSecret');

        const querystring = require('qs');
        const signData = querystring.stringify(sortedParams, { encode: false });
        const crypto = require("crypto");
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

        const amountPaid = vnp_Params['vnp_Amount'] / 100;

        if (secureHash === signed) {
            const responseCode = vnp_Params['vnp_ResponseCode'];

            if (responseCode === '00') {
                const orderIdFilePath = 'order.txt';
                const orderId = fs.readFileSync(orderIdFilePath, 'utf-8').trim();

                try {
                    const updateResponse = await fetch(`http://localhost:3000/hoadon/${orderId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            paymentStatus: 'Đã thanh toán',
                            amountDone: amountPaid,
                        }),
                    });

                    if (updateResponse.ok) {
                        res.render('success', { code: responseCode });
                    } else {
                        res.render('success', { code: '97' });
                    }
                } catch (error) {
                    res.render('success', { code: '97' });
                }
            } else {
                res.render('success', { code: responseCode });
            }
        } else {
            res.render('success', { code: '97' });
        }
    } catch (error) {
        console.error('Error handling VNPAY return:', error);
        res.status(500).send('Internal Server Error');
    }
}

function sortObject(obj) {
    let sorted = {};
    let str = [];
    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (let key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
