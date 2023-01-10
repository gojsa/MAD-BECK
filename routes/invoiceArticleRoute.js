const express = require("express");
const router = express.Router();

const {
  getAllinvoiceArticles,
  createinvoiceArticle,
  updateinvoiceArticle,
  getOneinvoiceArticle,
  cancellationinvoiceArticle,
  // updateStorageMovementType,
  deleteInvoiceArticleById,
  deleteAllInvoiceArticlesFromInvoice,
  dataFetch,
  insertion
} = require("../controllers/invoiceArticleController");

router.get("/get-all-invoice-articles/:invoice_id", getAllinvoiceArticles);
router.get("/get-invoice-article/:invoice_article_id", getOneinvoiceArticle);
router.post("/create-invoice-article/:invoice_id", createinvoiceArticle);
router.put("/update-invoice-article", updateinvoiceArticle);
router.put("/cancellationinvoice", cancellationinvoiceArticle);
// router.put("/update-storage-movement-type/:storage_movement_id/:storage_id/:article_id/", updateStorageMovementType);
router.delete("/delete-invoice-article/:invoice_article_id", deleteInvoiceArticleById)
router.delete("/delete-invoice-articles/:invoice_id", deleteAllInvoiceArticlesFromInvoice)
router.get("/fetch-data", dataFetch);
router.post("/add", insertion)

module.exports = router;
