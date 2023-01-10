const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const Articles = db.articles;
const Storage = db.storage;
const StorageStatus = db.storageStatus;
const Op = db.Op;


// Get all articles
const getAllArticles = asyncHandler(async (req, res) => {

  const articles = await Articles.findAll({
    where: {
      valid: "Y",
     
    }
  })

  if (!articles) {
    res.status(404)
    throw new Error("Articles were not found!")
  }

  res.status(200).json(articles)

})

const getAllArticlesWIthType = asyncHandler(async (req, res) => {
  const type_of_article = req.params.type_of_article
    const articles = await Articles.findAll({
      where: {
        valid: "Y",
        type_of_article
      }
    })
  
    if (!articles) {
      res.status(404)
      throw new Error("Articles were not found!")
    }
  
    res.status(200).json(articles)
  
  })
// Get one article
const getOneArticle = asyncHandler(async (req, res) => {

  const { article_id } = req.params
  
  const article = await Articles.findOne({
    where: {
      article_id,
      valid: "Y",
    },
  })

  if (!article) {
    res.status(404)
    throw new Error("Article was not found!")
  }

  res.status(200).json(article)

})
// Create artical
const createArtical = asyncHandler(async (req, res) => {
  let {
    article,
    code,
    name,
    description,
    unit_of_measure,
    negative_stock,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    customs_tariff_group,
    goods_with_origin,
    inventory_account,
    account_expense,
    average_entry_price,
    sale_price,
    last_entry_price,
    average_selling_price,
    last_sale_price,
    total_stock,
    quantity_on_the_production_order,
    quantity_on_the_sales_order,
    quantity_on_the_purchase_order,
    procurement_time,
    way_the_article_was_created,
    component_number,
    operation_plan_number,
    inventory_valuation,
    type_of_article,
    valid,
  } = req.body;

  const articles = await Articles.create({
    article,
    code,
    name,
    description,
    unit_of_measure,
    negative_stock,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    customs_tariff_group,
    goods_with_origin,
    inventory_account,
    account_expense,
    average_entry_price,
    sale_price,
    last_entry_price,
    average_selling_price,
    last_sale_price,
    total_stock,
    quantity_on_the_production_order,
    quantity_on_the_sales_order,
    quantity_on_the_purchase_order,
    procurement_time,
    way_the_article_was_created,
    component_number,
    operation_plan_number,
    inventory_valuation,
    type_of_article,
    valid,
  });

  if (!articles) {
    res.status(500)
    throw new Error("Can't create Article please try again");
  }

  res.status(201).json({
    article: articles.article,
  });
});

//Update article

const updateArticle = asyncHandler(async (req, res) => {
  let {
    article_id,
    article,
    code,
    name,
    description,
    unit_of_measure,
    negative_stock,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    customs_tariff_group,
    goods_with_origin,
    inventory_account,
    account_expense,
    average_entry_price,
    sale_price,
    last_entry_price,
    average_selling_price,
    last_sale_price,
    total_stock,
    quantity_on_the_production_order,
    quantity_on_the_sales_order,
    quantity_on_the_purchase_order,
    procurement_time,
    way_the_article_was_created,
    component_number,
    operation_plan_number,
    inventory_valuation,
    type_of_article,
    valid,
  } = req.body;

  if (!article_id) {
    res.status(500);
    throw new Error("Please add all fields");
  }

  const articles = await Articles.update(
    {
      article,
      code,
      name,
      description,
      unit_of_measure,
      negative_stock,
      stock_type,
      book_groups,
      type_of_goods,
      type_of_service,
      type_z_t,
      customs_tariff_group,
      goods_with_origin,
      inventory_account,
      account_expense,
      average_entry_price,
      sale_price,
      last_entry_price,
      average_selling_price,
      last_sale_price,
      total_stock,
      quantity_on_the_production_order,
      quantity_on_the_sales_order,
      quantity_on_the_purchase_order,
      procurement_time,
      way_the_article_was_created,
      component_number,
      operation_plan_number,
      inventory_valuation,
      type_of_article,
      valid,
    },
    {
      where: {
        article_id,
      },
    }
  );

  if (!articles) {
    res.status(500);
    throw new Error("Can't update article please try again.");
  }

  res.status(201).json({ message: "Article updated." });
});




module.exports = {
  getAllArticles,
  createArtical,
  updateArticle,
  getOneArticle,
  getAllArticlesWIthType
};


