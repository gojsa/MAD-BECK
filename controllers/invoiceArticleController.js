const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const InvoiceArticle = db.invoiceArticle;
const Storage = db.storage;
const StorageStatus = db.storageStatus;
const StorageMovement = db.storageMovement;
const Article = db.articles;
const Invoice = db.invoice;
const Op = db.Op;
const { createStorageMovement } = require('../utilities/storageMovement');

// Get all Invoice
const getAllinvoiceArticles = asyncHandler(async (req, res) => {
    const {
        invoice_id
    } = req.params;

   console.log(123123)
    const getAll = await InvoiceArticle.findAll({
        where:{
            invoice_id
            
        }
    })
    if (!getAll) {
        res.status(404)
        throw new Error("Invoice articles were not found!")
    }

    res.status(200).json(getAll)
});
// Get one invoice
const getOneinvoiceArticle = asyncHandler(async (req, res) => {
    const {
        invoice_article_id
    } = req.params;

    const getOne = await InvoiceArticle.findOne({
        where: {
            invoice_article_id,
            valid: 'Y'
        }
    })

    if (!getOne) {
        res.status(404)
        throw new Error("Cannot find invoice article!")
    }

    res.status(200).json(getOne)
});
// Create invoice Article
const createinvoiceArticle = asyncHandler(async (req, res) => {
    let {
        storage_id,
        article_name,
        article_id,
        description,
        value_with_vat,
        type_of_good,
        source,
        source_number,
        storage_location,
        amount,
        unit_of_measure,
        selling_price,
        discount,
        sale_value,
        vat,
        sale_value_with_vat,
        valid,
        type_of_movement
    } = req.body;

   

    const t = await db.sequelize.transaction();

    const { invoice_id } = req.params

    const findInvoice = await Invoice.findOne({where: {invoice_id}})

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const storage = await Storage.findOne({
        where: {
            storage_id
        }
    })
    if (!storage) {
        res.status(404)
        throw new Error("Can't find storage please try again");
    }
    const article = await Article.findOne({
        where: {
            article_id
        }
    })
    if (!article) {
        res.status(404)
        throw new Error("Can't find article please try again");
    }

    const storageStatus = await StorageStatus.findOne({
        where: {
            storage_id,
            article_id
        }
    })
    if (!storageStatus) {
        res.status(404)
        throw new Error("Artikal nije u vasem skladistu!");
    }


    if (amount > storageStatus.saldo) {
        res.status(400)
        throw new Error("Nema dovoljno u skladistu!");
    }
    const output_value = Number(amount) * Number(sale_value)
    const storageMovement = await StorageMovement.create({
        storage_id,
        article_id,
        storage_name: storage.name,
        article_name: article.name,
        article_out: '-' + amount,
        price_out: sale_value,
        output_value,
        valid: 'Y',
        type_of_movement

    }, {
        transaction: t
    })

    if (!storageMovement) {
        await t.rollback()
        res.status(500)
        throw new Error("Can't create storage movement please try again");
    }
    const invoiceArticle = await InvoiceArticle.create({
        storage_id,
        article_name,
        article_id,
        invoice_id,
        storage_movement_id: storageMovement.storage_movement_id,
        description,
        value_with_vat,
        type_of_good,
        source,
        source_number,
        storage_location,
        amount,
        unit_of_measure,
        selling_price,
        discount,
        sale_value,
        vat,
        sale_value_with_vat,
        valid: "Y",
    }, {
        transaction: t
    });

    if (!invoiceArticle) {
        await t.rollback()
        res.status(500)
        throw new Error("Can't create invoice Article please try again");
    }

    if (storageMovement.type_of_movement.toUpperCase() !== "RESERVED") {

        const storageStatusUpdate = await StorageStatus.update({
            saldo: storageStatus.saldo - parseInt(storageMovement.article_out.replace("-", "")),
            saldo_value: storageStatus.saldo_value - Number(output_value)
        }, {
            where: {
                storage_id: storage.storage_id,
                article_id: article.article_id,
            }, transaction: t
        })
        if (!storageStatusUpdate) {
            await t.rollback()
            res.status(500)
            throw new Error("Can't update storage status please try again");
        }

    }

    await t.commit()

    await invoiceArticle.setInvoice(findInvoice)

    res.status(201).json({
        storageMovement: storageMovement.storage_movement_id,
    });
});

//Update Invoice

const updateinvoiceArticle = asyncHandler(async (req, res) => {
    let {
        invoice_article_id,
        article_name,
        article_id,
        invoice_id,
        description,
        value_with_vat,
        type_of_good,
        source,
        source_number,
        storage_location,
        amount,
        unit_of_measure,
        selling_price,
        discount,
        type_of_movement,
        sale_value,
        vat,
        sale_value_with_vat,
        valid,
        storage_id
    } = req.body;

    if (!invoice_article_id) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const t = await db.sequelize.transaction();

    const storage = await Storage.findOne({
        where: {
            storage_id
        }
    })
    if (!storage) {
        res.status(404)
        throw new Error("Can't find storage please try again");
    }
    const article = await Article.findOne({
        where: {
            article_id
        }
    })
    if (!article) {
        res.status(404)
        throw new Error("Can't find article please try again");
    }

    const storageStatus = await StorageStatus.findOne({
        where: {
            storage_id,
            article_id
        }
    })
    if (!storageStatus) {
        res.status(404)
        throw new Error("Artikal se ne nalazi na vasem skladistu!");
    }


    if (amount > storageStatus.saldo) {
        res.status(400)
        throw new Error("Nema dovoljno na skladistu!");
    }

    const storageMovement = await StorageMovement.create({
        storage_id,
        article_id,
        storage_name: storage.name,
        article_name: article.name,
        article_in: '+' + amount,
        price_in: sale_value,
        valid: 'Y',
        type_of_movement

    }, {
        transaction: t
    })

    if (!storageMovement) {
        await t.rollback()
        res.status(500)
        throw new Error("Can't create storage movement please try again");
    }
    /*const storageStatusUpdateOut = await createStorageMovement(
        storage_id,
        article_id,
        null,
        amount,
        null,
        '',
        type_of_movement,
        null,
    );

    
    if (!storageStatusUpdateOut) {
        throw new Error("Please try again");

    }*/
    const findInvoiceArticle = await InvoiceArticle.findOne({where: {invoice_article_id}})

    if (!findInvoiceArticle) {
        res.status(404)
        throw new Error("Invoice article was not found!")
    }

    const invoiceArticle = await InvoiceArticle.update({
        article_name,
        article_id,
        invoice_id,
        description,
        value_with_vat,
        type_of_good,
        source,
        source_number,
        storage_location,
        amount,
        unit_of_measure,
        selling_price,
        discount,
        sale_value,
        vat,
        sale_value_with_vat,
        valid,
    }, {
        where: {
            invoice_article_id: findInvoiceArticle.invoice_article_id,
        },
    });

    if (!invoiceArticle) {
        res.status(400);
        throw new Error("Invoice article was not updated, please try again!");
    }

    // if (storageMovement.type_of_movement.toUpperCase() !== "RESERVED") {

    //     const storageStatusUpdate = await StorageStatus.update({
    //         saldo: storageStatus.saldo + parseInt(storageMovement.article_in.replace("+", ""))
    //     }, {
    //         where: {
    //             storage_id: storage.storage_id,
    //             article_id: article.article_id,
    //         }, transaction: t
    //     })
    //     if (!storageStatusUpdate) {
    //         await t.rollback()
    //         res.status(500)
    //         throw new Error("Can't update storage status please try again");
    //     }

    // }

    // await t.commit()

    res.status(201).json({
        message: "Invoice article was successfully updated!",
        invoice_article_id: findInvoiceArticle.invoice_article_id
    });
});

const cancellationinvoiceArticle = asyncHandler(async (req, res) => {
    let {
        arr


    } = req.body;

    if (!arr || arr.length < 1) {
        res.status(400);
        throw new Error("Please provide an array with invoice articles!");
    }

    let condition = "OK"

    const t = await db.sequelize.transaction();

    for (let i = 0; i < arr.length; i++) {

        if (!arr[i].invoice_article_id || !arr[i].storage_id || !arr[i].storage_movement_id || !arr[i].article_id || !arr[i].saldo || !arr[i].selling_price) {
            condition = "400"
            break
        }
        const findInvoiceArticle = await InvoiceArticle.findOne({where: {invoice_article_id: arr[i].invoice_article_id}})

        if (!findInvoiceArticle) {
            condition = "INVOICE_ARTICLE_404"
            break
        }

        const findStorage = await Storage.findOne({where: {storage_id: arr[i].storage_id}})

        if (!findStorage) {
            condition = "STORAGE_404"
            break
        }

        const findArticle = await Article.findOne({where: {article_id: arr[i].article_id}})

        if (!findArticle) {
            condition = "ARTICLE_404"
            break
        }

        const finalAmount = parseInt(findInvoiceArticle.amount) - parseInt(arr[i].saldo)

        const invoiceArticle = await InvoiceArticle.update({amount: finalAmount.toString(), selling_price: arr[i].selling_price}, {where: {invoice_article_id: findInvoiceArticle.invoice_article_id}, transaction: t});

        if (!invoiceArticle) {
            await t.rollback()
            condition = "INVOICE_ARTICLE_500"
            break
        }

        const findStorageMovement = await StorageMovement.findOne({where: {storage_movement_id: arr[i].storage_movement_id}})

        if (!findStorageMovement) {
            condition = "STORAGE_MOVEMENT_404"
            break
        }

        const findInvoiceArticleForAmount = await InvoiceArticle.findOne({where: {invoice_article_id: findInvoiceArticle.invoice_article_id}})

        if (!findInvoiceArticleForAmount) {
            condition = "INVOICE_ARTICLE_404"
            break
        }

        const val = parseInt(findStorageMovement.article_out.replace("-", "")) - parseInt(arr[i].saldo)

        const outputValue = parseInt(arr[i].selling_price) * val

        const updateStorageMovement = await StorageMovement.update({article_out: "-" + val.toString(), output_value: outputValue}, {where: {storage_movement_id: findStorageMovement.storage_movement_id}, transaction: t})

        if (!updateStorageMovement) {
            await t.rollback()
            condition = "STORAGE_MOVEMENT_500"
            break
        }

        if (findInvoiceArticleForAmount.amount === "0"){
            const deleteInvoiceArticle = await InvoiceArticle.destroy({where: {invoice_article_id: findInvoiceArticleForAmount.invoice_article_id}, transaction: t})
    
            if (!deleteInvoiceArticle) {
                await t.rollback()
                condition = "DELETE_INVOICE_ARTICLE"
                break
            }
    
            const deleteStorageMovement = await StorageMovement.destroy({where: {storage_movement_id: findStorageMovement.storage_movement_id}, transaction: t})
    
            if (!deleteStorageMovement) {
                await t.rollback()
                condition = "DELETE_STORAGE_MOVEMENT"
                break
            }
    
        }
    }

    // const findStorageStatus = await StorageStatus.findOne({
    //     where: {
    //         storage_id: findStorage.storage_id,
    //         article_id: findArticle.article_id
    //     }
    // })

    // if (!findStorageStatus) {
    //     res.status(404);
    //     throw new Error("Storage status was not found!");
    // }

    // const storageStatus = await StorageStatus.update({
    //     saldo: findStorageStatus.saldo + parseInt(saldo)
    // }, {
    //     where: {
    //         article_id: findArticle.article_id,
    //         storage_id: findStorage.storage_id
    //     },
    //     transaction: t
    // })

    // if (!storageStatus) {
    //     await t.rollback()
    //     res.status(500);
    //     throw new Error("Storage status was not updated, please try again!");
    // }

    switch(condition) {
        case "400":
            res.status(400)
            throw new Error("Please add all fields!")
        case "INVOICE_ARTICLE_404":
            res.status(404)
            throw new Error("Invoice article was not found!")
        case "STORAGE_404":
            res.status(404)
            throw new Error("Storage was not found!")
        case "ARTICLE_404":
            res.status(404)
            throw new Error("Article was not found!")
        case "INVOICE_ARTICLE_500":
            res.status(500)
            throw new Error("Invoice article was not updated, please try again!")
        case "STORAGE_MOVEMENT_404":
            res.status(500)
            throw new Error("Storage movement was not found!")
        case "STORAGE_MOVEMENT_500":
            res.status(500)
            throw new Error("Storage movement was not updated, please try again!")
        case "DELETE_INVOICE_ARTICLE":
            res.status(500)
            throw new Error("Invoice article was not deleted, please try again!")
        case "DELETE_STORAGE_MOVEMENT":
            res.status(500)
            throw new Error("Storage movement was not deleted, please try again!")
        case "OK":
            await t.commit()
            res.status(200).json({message: "OK"})
    }

});

const updateStorageMovementType = asyncHandler(async (req, res) => {

    const {
        storage_movement_id,
        storage_id,
        article_id
    } = req.params

    const t = await db.sequelize.transaction();

    const storage = await Storage.findOne({
        where: {
            storage_id,
            valid: "Y"
        }
    })

    if (!storage) {
        res.status(404)
        throw new Error("Storage was not found!");
    }

    const article = await Article.findOne({
        where: {
            article_id,
            valid: "Y"
        }
    })

    if (!article) {
        res.status(404)
        throw new Error("Article was not found!");
    }

    const findStorageMovement = await StorageMovement.findOne({
        where: {
            storage_movement_id,
            valid: "Y"
        }
    })

    if (!findStorageMovement) {
        res.status(404)
        throw new Error("Storage movement was not found!")
    }

    const findStorageStatus = await StorageStatus.findOne({
        where: {
            storage_id: storage.storage_id,
            article_id: article.article_id
        }
    })

    if (!findStorageStatus) {
        res.status(404)
        throw new Error("Storage status was not found!")
    }

    if (findStorageMovement.article_out > findStorageStatus.saldo) {
        res.status(400)
        throw new Error("Nema dovoljno u skladistu!");
    }

    const storageStatusUpdate = await StorageStatus.update({
        saldo: findStorageStatus.saldo - findStorageMovement.article_out
    }, {
        where: {
            storage_status_id: findStorageStatus.storage_status_id
        }
    }, {
        transaction: t
    })

    if (!storageStatusUpdate) {
        await t.rollback()
        res.status(400)
        throw new Error("Saldo was not updated, please try again!")
    }

    const storageMovementUpdate = await StorageMovement.update({
        type_of_movement: "RESOLVED"
    }, {
        where: {
            storage_movement_id: findStorageMovement.storage_movement_id
        }
    }, {
        transaction: t
    })

    if (!storageMovementUpdate) {
        await t.rollback()
        res.status(500)
        throw new Error("Storage movement type was not updated, please try again!")
    }

    await t.commit()

    res.status(200).json({
        message: "Storage movement type was successfully updated!"
    })

})

const deleteInvoiceArticleById = asyncHandler(async (req, res) => {

    const { invoice_article_id } = req.params

    const findInvoiceArticle = await InvoiceArticle.findOne({where: {invoice_article_id, valid: 'Y'}})

    if (!findInvoiceArticle) {
        res.status(404)
        throw new Error("Invoice article was not found!")
    }

    const deleteInvoiceArticle = await InvoiceArticle.update({valid: 'N'}, {where: {invoice_article_id: findInvoiceArticle.invoice_article_id}})

    if (!deleteInvoiceArticle) {
        res.status(500)
        throw new Error("Invoice article was not deleted, please try again!")
    }

    res.status(200).json({message: "Successfully deleted invoice article!"})
})

const deleteAllInvoiceArticlesFromInvoice = asyncHandler(async (req, res) => {

    const { invoice_id } = req.params

    const findInvoice = await Invoice.findOne({where: {invoice_id}})

    if (!findInvoice) {
        res.status(404)
        throw new Error("Invoice was not found!")
    }

    const findInvoiceArticles = await findInvoice.getInvoice_articles()

    if (!findInvoiceArticles || findInvoiceArticles.length === 0) {
        res.status(404)
        throw new Error("There are no invoice articles associated with this invoice!")
    }

    let invoiceArticleIds = []

    for (let i = 0; i < findInvoiceArticles.length; i++) {
        invoiceArticleIds.push(findInvoiceArticles[i].invoice_article_id)
    }

    console.log(invoiceArticleIds)

    const deleteAllInvoiceArticles = await InvoiceArticle.update({
        valid: "N"
    }, {where: {
        invoice_article_id: {
            [Op.in]: invoiceArticleIds
        }
    }})

    if (!deleteAllInvoiceArticles) {
        res.status(500)
        throw new Error("An error occured while deleting invoice articles from the given invoice!")
    }

    res.status(200).json({message: "Successfully deleted invoice articles!"})
})

const dataFetch = asyncHandler(async (req, res) => {

    const fetchData = await db.sequelize.query("SELECT * FROM erp.mad_articles;")

    if (!fetchData) {
        res.status(404)
        throw new Error("Cannot get!")
    }

    res.status(200).json(fetchData[0])
})

const insertion = asyncHandler(async (req, res) => {

    const data = await db.sequelize.query("SELECT * FROM erp.mad_articles;")

    if (data) {
        data[0].forEach(async (i) => {

            try {

                // await db.sequelize.query(`INSERT INTO erp.article(article_id,article,name,sale_price,total_stock,code,unit_of_measure, created_at, updated_at) VALUES (${i.article_id}, "${i.article}", "${i.name}", ${i.sale_price}, ${i.total_stock}, "${i.code}", "KOM", "2022-12-23 15:14:04", "2022-12-23 15:14:04")`)
    
                // await db.sequelize.query(`INSERT INTO erp.storage_status(storage_id,article_id,saldo, created_at, updated_at) VALUES (1, ${i.article_id}, ${i.total_stock}, "2022-12-23 15:14:04", "2022-12-23 15:14:04")`)
        
                await db.sequelize.query(`INSERT INTO erp.storage_movement(storage_id,storage_name,article_id,article_name,article_in, created_at, updated_at) VALUES (1, "MAD Zenica", ${i.article_id}, "${i.name}", ${i.total_stock}, "2022-12-23 15:14:04", "2022-12-23 15:14:04")`)

            } catch (err) {
                console.log(err)
            }
        })
    }
    
})

module.exports = {
    getAllinvoiceArticles,
    createinvoiceArticle,
    updateinvoiceArticle,
    getOneinvoiceArticle,
    cancellationinvoiceArticle,
    updateStorageMovementType,
    deleteInvoiceArticleById,
    deleteAllInvoiceArticlesFromInvoice,
    dataFetch,
    insertion
};