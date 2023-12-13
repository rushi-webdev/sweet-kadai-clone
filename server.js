const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const secretKey = process.env.JWT_SECRET_KEY;
app.use(express.json());
app.use(cors());
mongoose.set('strictQuery', false);
app.use(express.json({ extended: false }));

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("running on 5000")
  })
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });
const productRouter = require('./routes/productRoute');
const orderRouter = require('./routes/orderRoute');
const addressRoute = require('./routes/addressRoute');
const userRoute = require('./routes/userRoute');
const paymentRoute = require('./routes/paymentRoute');
const categoryRoute = require('./routes/categoryRoute');
function verifyToken(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
}

app.get('/protected', verifyToken, (req, res) => {
    // If the token is valid, you can access the user ID in req.user
    res.json({ message: 'Protected route', userId: req.user.userId });
});
// app.get("/api/getkey", (req, res) =>
//   res.status(200).json({ key: "rzp_test_foKvrZE621faky" })
// );
app.use('/', upload.array('images'), productRouter);
app.use('/', orderRouter);
app.use('/', addressRoute);
app.use('/', userRoute);
app.use('/', categoryRoute);
app.use('/api/payment/', paymentRoute);
