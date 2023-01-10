const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const storageStatus = require("../models/storageStatus");
const Invoice = db.invoice;
const InvoiceArticle = db.invoiceArticle
const Op = db.Op;
const User = db.users
const StorageMovement = db.storageMovement
const Storage = db.storage
const Article = db.articles
const StorageStatus = db.storageStatus
const MethodOfPayment = db.methodOdPayment
const InvoiceMethodOfPayment = db.invoiceMethodOfPayment

const {
    orderBookInsert
} = require("../utilities/orderBook")

// Get all Invoice
const getAllInvoices = asyncHandler(async (req, res) => {
    const {
        type
    } = req.params

    if (type.toUpperCase() === "MALOPRODAJA" || type.toUpperCase() === "VELEPRODAJA") {
        const findInvoices = await Invoice.findAll({
            include: [{
                model: InvoiceArticle,

            },
            {
                model: MethodOfPayment,

            }],
            where: {
                invoice_type: type,
                valid: "Y"
            }
        })

        if (!findInvoices) {
            res.status(404)
            throw new Error("Cannot find invoices, please try again!")
        }

        res.status(200).json(findInvoices)
    } else {
        res.status(400)
        throw new Error("Invalid invoice type!")
    }
});
// Get one invoice
const getOneInvoice = asyncHandler(async (req, res) => {

    const {
        invoice_id
    } = req.params

    const findInvoice = await Invoice.findOne({
        include: [{
            model: InvoiceArticle,

        },
        {
            model: MethodOfPayment,

        }],
        where: {
            invoice_id,
            valid: "Y"
        }
    })

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    res.status(200).json(findInvoice)
});

const getLastInvoice = asyncHandler(async (req, res) => {

    const {
        invoice_type
    } = req.params

    if (invoice_type.toUpperCase() === "MALOPRODAJA" || invoice_type.toUpperCase() === "VELEPRODAJA") {
        const getLast = await db.sequelize.query(`SELECT * FROM erp.invoice WHERE invoice_type = "${invoice_type.toUpperCase()}" ORDER BY invoice_id DESC LIMIT 1;`)

        if (!getLast) {
            res.status(500)
            throw new Error("Last invoice was not found!")
        }

        res.status(200).json(getLast[0][0])
    } else {
        res.status(400)
        throw new Error("Invalid invoice type parameter!")
    }
})
// Create Invoice
const createInvoice = asyncHandler(async (req, res) => {

    let {
        customer_number,
        customer_name,
        date,
        date_of_order,
        date_of_delivery,
        required_delivery_date,
        customer_order_number,
        status,
        currency,
        subtotal_without_vat,
        discount,
        vat,
        total_invoice,
        invoice_type,
        organisation_unit_id,
        fiscal_number,
        valid,
        invoice_number,
    } = req.body;

    let obj = {}

    const { user_id } = req.params

    const findUser = await User.findOne({where: {users_id: user_id}})

    if (!findUser) {
        res.status(404)
        throw new Error("User was not found!")
    }

    if (!findUser) {
        res.status(404)
        throw new Error("User was not found!")
    }

    if (invoice_type.toUpperCase() === "MALOPRODAJA") {

        if (!date || !status || !currency /*|| !subtotal_without_vat || !discount*/ || !vat /*|| !total_invoice*/ || !organisation_unit_id || !invoice_number) {
            res.status(400)
            throw new Error("Please add all fields!")
        } else {
                obj.date = date,
                obj.status = status,
                obj.currency = currency,
                obj.subtotal_without_vat = subtotal_without_vat,
                obj.discount = discount,
                obj.vat = vat,
                obj.total_invoice = total_invoice,
                obj.invoice_type = invoice_type,
                obj.fiscal_number = 0,
                obj.valid = "Y"
                obj.invoice_number = invoice_number
        }
    } else if (invoice_type.toUpperCase() === "VELEPRODAJA") {
        console.log(req.body)
        if (!customer_number || !date || !customer_order_number || !status || !vat || !organisation_unit_id || !invoice_number) {
            res.status(400)
            throw new Error("Please add all fields!")
        } else {
                obj.customer_number = customer_number,
                obj.customer_name = customer_name,
                obj.date = date,
                obj.date_of_order = date_of_order,
                obj.date_of_delivery = date_of_delivery,
                obj.required_delivery_date = required_delivery_date,
                obj.customer_order_number = customer_order_number,
                obj.status = status,
                obj.currency = currency,
                obj.subtotal_without_vat = subtotal_without_vat,
                obj.discount = discount,
                obj.vat = vat,
                obj.total_invoice = total_invoice,
                obj.invoice_type = invoice_type,
                obj.fiscal_number = 0,
                obj.valid = "Y",
                obj.organisation_unit_id = organisation_unit_id,
                obj.invoice_number = invoice_number
        }
    } else {
        res.status(400)
        throw new Error("Invoice type is not valid or it was not specified!")
    }

    const invoice = await Invoice.create(obj);

    if (!invoice) {
        throw new Error("Invoice was not created, please try again!");
    }

    // await orderBookInsert(1, invoice.invoice_number, "", "", 1, 1, "")

    await invoice.setUser(findUser)

    res.status(201).json({
        invoice: invoice.invoice_id,
        message: "Invoice was successfully created!"
    });
});

//Update Invoice

const updateInvoice = asyncHandler(async (req, res) => {
    let {
        invoice_id,
        customer_number,
        customer_name,
        date,
        date_of_order,
        date_of_delivery,
        required_delivery_date,
        customer_order_number,
        status,
        currency,
        subtotal_without_vat,
        discount,
        vat,
        total_invoice,
        invoice_type,
        organisation_unit_id,
        fiscal_number,
        valid,
        invoice_number
    } = req.body;

    if (!invoice_id) {
        res.status(400);
        throw new Error("Please add all fields!");
    }

    const findInvoice = await Invoice.findOne({
        where: {
            invoice_id
        }
    })

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    let obj = {}

    if (invoice_type.toUpperCase() === "MALOPRODAJA") {

        obj.date = date,
            obj.status = status,
            obj.currency = currency,
            obj.subtotal_without_vat = subtotal_without_vat,
            obj.discount = discount,
            obj.vat = vat,
            obj.total_invoice = total_invoice,
            obj.fiscal_number = fiscal_number,
            obj.valid = valid,
            obj.organisation_unit_id = organisation_unit_id,
            obj.invoice_number = invoice_number

    } else if (invoice_type.toUpperCase() === "VELEPRODAJA") {

            obj.customer_number = customer_number,
            obj.customer_name = customer_name,
            obj.date = date,
            obj.date_of_order = date_of_order,
            obj.date_of_delivery = date_of_delivery,
            obj.required_delivery_date = required_delivery_date,
            obj.customer_order_number = customer_order_number,
            obj.status = status,
            obj.currency = currency,
            obj.subtotal_without_vat = subtotal_without_vat,
            obj.discount = discount,
            obj.vat = vat,
            obj.total_invoice = total_invoice,
            obj.fiscal_number = fiscal_number,
            obj.valid = valid,
            obj.organisation_unit_id = organisation_unit_id,
            obj.invoice_number = invoice_number

    } else {
        res.status(400)
        throw new Error("Invoice type is not valid or it was not specified!")
    }

    const invoice = await Invoice.update(obj, {
        where: {
            invoice_id: findInvoice.invoice_id,
        },
    });

    if (!invoice) {
        res.status(500);
        throw new Error("Invoice was not updated, please try again!");
    }

    res.status(201).json({
        message: "Invoice was successfully updated!"
    });
});

const cancelInvoice = asyncHandler(async (req, res) => {

    const { invoice_id, cancel_type } = req.params

    const { invoice_articles, srrNumber } = req.body

    const t = await db.sequelize.transaction();

    if (!invoice_articles) {
        res.status(400)
        throw new Error("Please provide invoice articles!")
    }

    const findInvoice = await Invoice.findOne({where: {invoice_id}})

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const articles = await findInvoice.getInvoice_articles({where: {valid: "Y"}})

    if (!articles || articles.length === 0) {
        res.status(404)
        throw new Error("This invoice has no articles!")
    }

    const result = await db.sequelize.query(`SELECT invoice_number FROM erp.invoice WHERE (invoice_number LIKE '%-DS%' OR invoice_number LIKE '%-S%') ORDER BY invoice_id DESC LIMIT 1;`, { type: db.sequelize.QueryTypes.SELECT })

    let str
    
    if (!result || result.length<1) {
        str = "1" + "-" + cancel_type
    } else {
        let valueForInvoiceNum = result[0].invoice_number

        if (valueForInvoiceNum.includes("-DS") || valueForInvoiceNum.includes("-S")) {
            valueForInvoiceNum = valueForInvoiceNum.replace("-DS", "").replace("-S", "");
        }

        const intValue = parseInt(valueForInvoiceNum) + 1

        str = intValue.toString() + "-" + cancel_type
    }

    const createCancel = await Invoice.create({
        invoice_number: str,
        customer_number: findInvoice.customer_number,
        customer_name: findInvoice.customer_name,
        date: findInvoice.date,
        date_of_order: findInvoice.date_of_order,
        date_of_delivery: findInvoice.date_of_delivery,
        required_delivery_date: findInvoice.required_delivery_date,
        customer_order_number: findInvoice.customer_order_number,
        status: findInvoice.status,
        currency: findInvoice.currency,
        subtotal_without_vat: findInvoice.subtotal_without_vat,
        discount: findInvoice.discount,
        vat: findInvoice.vat,
        total_invoice: findInvoice.total_invoice,
        method_of_payment: findInvoice.method_of_payment,
        fiscal_number: srrNumber,
        valid: findInvoice.valid,
        invoice_type: findInvoice.invoice_type,
        organisation_unit_id: findInvoice.organisation_unit_id,
    }, {
        transaction: t
    })

    const findUser = await User.findOne({where: {users_id: findInvoice.user_id}})

    if (!findUser) {
        res.status(404)
        throw new Error("User was not found!")
    }

    if (!createCancel) {
        await t.rollback()
        res.status(500)
        throw new Error("Cancellation was not successful!")
    }

    let condition = "OK"

    for (let i = 0; i < invoice_articles.length; i++) {
        const findStorage = await Storage.findOne({where: {storage_id: invoice_articles[i].storage_id}})

        if (!findStorage) {
            condition = "NOT OK"
            break;
        }

        const findArticle = await Article.findOne({where: {article_id: invoice_articles[i].article_id}})

        if (!findArticle) {
            condition = "NOT OK"
            break;
        }

        const inputValue = parseInt(invoice_articles[i].selling_price) * parseInt(invoice_articles[i].amount) 

        const createStorageMovement = await StorageMovement.create({
            storage_id: invoice_articles[i].storage_id,
            article_id: invoice_articles[i].article_id,
            storage_name: findStorage.name,
            article_name: findArticle.name,
            article_in: '+' + invoice_articles[i].amount,
            price_in: invoice_articles[i].sale_value,
            valid: 'Y',
            type_of_movement: 'STORN',
            input_value: inputValue.toString()
        }, {
            transaction: t
        })

        if (!createStorageMovement) {
            await t.rollback()
            condition = "NOT OK"
            break;
        }
        const createInvoiceArticle = await InvoiceArticle.create({
            storage_id: invoice_articles[i].storage_id,
            article_name: invoice_articles[i].article_name,
            article_id: invoice_articles[i].article_id,
            invoice_id: invoice_articles[i].invoice_id,
            storage_movement_id: invoice_articles[i].storage_movement_id,
            description: invoice_articles[i].description,
            value_with_vat: invoice_articles[i].value_with_vat,
            type_of_good: invoice_articles[i].type_of_good,
            source: invoice_articles[i].source,
            source_number: invoice_articles[i].source_number,
            storage_location: invoice_articles[i].storage_location,
            amount: "-" + invoice_articles[i].amount,
            unit_of_measure: invoice_articles[i].unit_of_measure,
            selling_price: invoice_articles[i].selling_price,
            discount: invoice_articles[i].discount,
            sale_value: invoice_articles[i].sale_value,
            vat: invoice_articles[i].vat,
            sale_value_with_vat: invoice_articles[i].sale_value_with_vat,
            valid: "Y",
        }, {
            transaction: t
        })

        if (!createInvoiceArticle) {
            await t.rollback()
            condition = "NOT OK"
            break;
        }

        const relate = await createInvoiceArticle.setInvoice(createCancel, { transaction: t })

        if (!relate) {
            await t.rollback()
            condition = "NOT OK"
            break;
        }

        const findStorageStatus = await StorageStatus.findOne({where: {storage_id: findStorage.storage_id, article_id: findArticle.article_id}})

        if (!findStorageStatus) {
            condition = "NOT OK"
            break;
        }

        const updateStorageStatus = await StorageStatus.update({saldo: findStorageStatus.saldo + parseInt(invoice_articles[i].amount)}, {where: {storage_status_id: findStorageStatus.storage_status_id}, transaction: t})

        if (!updateStorageStatus) {
            await t.rollback()
            condition = "NOT OK"
            break;
        }
    }

    

    if (condition === "OK") {
        await createCancel.setUser(findUser, {transaction: t})
        await t.commit()

        res.status(200).send("OK")
    } else {
        res.status(500)
        throw new Error("An error occured!")
    }

})

const deleteInvoice = asyncHandler(async (req, res) => {

    const { invoice_id } = req.params

    const findInvoice = await Invoice.findOne({where: {
        invoice_id,
        valid: "Y",
        fiscal_status: {
            [Op.ne]: "Y"
        }
    }})

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found or it was fiscalized!")
    }

    const deleteInvoice = await Invoice.update({valid: "N"}, {where: {invoice_id: findInvoice.invoice_id}})

    if (!deleteInvoice) {
        res.status(500)
        throw new Error("Invoice was not deleted, please try again!")
    }

    res.status(200).json({message: "Invoice was successfully deleted!"})
})

const test = asyncHandler(async (req, res) => {

    const result = await db.sequelize.query(`SELECT * FROM erp.invoice WHERE (invoice_number LIKE '%-DS%' OR invoice_number LIKE '%-S%') ORDER BY invoice_id DESC LIMIT 1;`, { type: db.sequelize.QueryTypes.SELECT })

    if (f.includes("-DS") || f.includes("-S")) {
        f = f.replace("-DS", "").replace("-S", "");
    }

    if (!result) {
        res.status(404)
        throw new Error("Invoices were not found!")
    }
    res.status(200).json(result)
})

module.exports = {
    getAllInvoices,
    createInvoice,
    updateInvoice,
    getOneInvoice,
    getLastInvoice,
    cancelInvoice,
    deleteInvoice,
    test
};