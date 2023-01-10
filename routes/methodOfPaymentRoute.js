const express = require("express");
const router = express.Router();

const {
    getMethodsOfPayment, addMethodOfPaymentToInvoice, test
} = require("../controllers/mehodOfPaymentController");

router.get("/", getMethodsOfPayment);
router.get("/test/:invoice_id", test);
router.post("/add-methods-of-payment/:invoice_id", addMethodOfPaymentToInvoice);

module.exports = router;
