const asyncHandler = require("express-async-handler");
const db = require('../config/db');
const MethodOfPayment = db.methodOdPayment;
const InvoiceMethodOfPayment = db.invoiceMethodOfPayment
const Invoice = db.invoice
const Op = db.Op;

const getMethodsOfPayment = asyncHandler(async (req, res) => {

    const fetch = await MethodOfPayment.findAll()

    if (!fetch) {
        res.status(400)
        throw new Error("Methods of payment were not found!")
    }

    res.status(200).json(fetch)
})

const addMethodOfPaymentToInvoice = asyncHandler(async (req, res) => {

    const { invoice_id } = req.params

    const { methods_of_payment } = req.body

    const t = await db.sequelize.transaction();

    if (!methods_of_payment) {
        res.status(400)
        throw new Error("Please provide a payment method!")
    }

    const findInvoice = await Invoice.findOne({where: {invoice_id}})

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    let arr = []

    for (let i = 0; i < methods_of_payment.length; i++) {
        arr.push(methods_of_payment[i].method_of_payment_id)
    }

    const findMethodOfPayment = await MethodOfPayment.findAll({where: {
        method_of_payment_id: {
            [Op.in]: arr
        }
    }})

    if (!findMethodOfPayment) {
        res.status(404)
        throw new Error("Method of payment was not found!")
    }

    let condition = "OK"

    for (let i = 0; i < methods_of_payment.length; i++) {
        const relate = await InvoiceMethodOfPayment.create({
            total: methods_of_payment[i].total,
            invoice_id: findInvoice.invoice_id,
            method_of_payment_id: methods_of_payment[i].method_of_payment_id,
        }, {transaction: t})

        if (!relate) {
            await t.rollback()
            condition = "NOT OK"
            break
        }
    }

    if (condition === "OK") {
        await t.commit()
        res.status(200).json({message: "Payment method was successfully added to the invoice!"})
    } else {
        res.status(500)
        throw new Error("Payment method was not added to the invoice, please try again!")
    }

})

const test = asyncHandler(async (req, res) => {

    const { invoice_id } = req.params

    const findInvoice = await Invoice.findOne({
        where: {invoice_id}
    })

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const result = await findInvoice.getMethod_of_payments()

    res.status(200).json(result)
})

module.exports = {
    getMethodsOfPayment,
    addMethodOfPaymentToInvoice,
    test
}