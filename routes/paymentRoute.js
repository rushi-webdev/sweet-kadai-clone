const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
require('dotenv').config();
//Creating Order 
router.get('/get_id',(req,res)=>{
    res.send(process.env.KEY_ID);
})
router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100,
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        }
        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }

});

// Verifying the payment
router.post("/verify", async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature } = req.body;
        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const hmac = crypto.createHmac("sha256", process.env.KEY_SECRET);
        hmac.update(sign);
        const resultSign = hmac.digest("hex");
        if (razorpay_signature == resultSign) {
            return res.json({ status: 200, message: "Payment verified successfully" });
        } else {
            return res.json({ status: 400, message: "Payment not verified" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

// router.post('/verify', (req, res) => {
//     const secret = "rushi1717";
//     const {
//         razorpay_orderID,
//         razorpay_paymentID,
//         razorpay_signature } = req.body;

//     const shasum = crypto.createHmac('sha256', secret)
//     shasum.update(JSON.stringify(req.body))
//     const digest = shasum.digest('hex')
//     console.log(digest)
//     console.log(razorpay_signature)
//     res.json({ status: "ok" });
// })

module.exports = router;