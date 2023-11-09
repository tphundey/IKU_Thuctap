const express = require('express');
const mongoose = require('mongoose');
const app = express();
const productsRouter = require('./products');
const cartRouter = require('./cart');
const googleAccountRouter = require('./googleAccount');
const invoiceRouter = require('./invoice');
const reviewRouter = require('./reviews');
const categoryRouter = require('./categories');

const mongoDBUrl = "mongodb+srv://root:123@cluster0.zq6tyry.mongodb.net/thuctap?retryWrites=true&w=majority";
const cors = require('cors');
mongoose.connect(mongoDBUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log("Connected to MongoDB Atlas!");
});

app.use(cors());
app.use(express.json());
app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/googleAccount', googleAccountRouter);
app.use('/hoadon', invoiceRouter);
app.use('/categories', categoryRouter);
app.use('/reviews', reviewRouter);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
