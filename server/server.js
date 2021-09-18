require('dotenv').config();
const express = require('express');
const connectDb = require('./utils/connectDb');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const path = require('path');
const app = express();


connectDb(process.env.MONGO_URL);

app.use(express.json());
app.use(express.urlencoded({ extends: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
})

app.use('/users', userRouter);
app.use('/products', productRouter);


app.use('*', (req, res) => {
    res.status(400).json({
        msg: 'Api endpoint does not exist'
    })
})


app.listen(process.env.PORT || 9000, () => {
    console.log('server started');
});