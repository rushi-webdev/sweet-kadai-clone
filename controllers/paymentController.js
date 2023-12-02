// const instance =require("../server.js");
const crypto= require("crypto");
const Payment= require("../models/paymentModel.js");
const Razorpay =require("razorpay");

const instance = new Razorpay({
    key_id: "rzp_test_foKvrZE621faky",
    key_secret: "7rcgdhWu6hcEpzbIed3OYRq0",
  });
const checkout = async (req, res) => {
  console.log(req.body)
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", "rzp_test_foKvrZE621faky")
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Database comes here

    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    res.redirect(
      `http://127.0.0.1:5173/orders`
    );
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = { 
    checkout,
    paymentVerification,
}