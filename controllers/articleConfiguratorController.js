const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const Configurator = db.articleConfigurator;
const Op = db.Op;

// Get all Configurator
const getAllConfigurator = (req, res) => {
  Configurator.findAll()
    .then((configurator) => {
      res.status(200).json(configurator);
    })
    .catch((err) => {
      throw new Error("'Can`t get configurator please try later.'");
    });
};
// Get one configurator by column name
const getOneConfigurator = (req, res) => {
  const column = req.params.column;
  Configurator.findAll({
    where:{
      [column]: {
        [Op.ne]: null
      }
      
    },
   attributes:[column],
    
  })
    .then((configurator) => {
      res.status(200).json(configurator);
    })
    .catch((err) => {
      throw new Error("'Can`t get configurator please try later.'");
    });
};
// Create configurator
const createConfigurator = asyncHandler(async (req, res) => {
  let {
    unit_of_measure,
    inventory_valuation,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    way_the_article_was_created,
    origin,
    item_movement_types,
    movement_documents,
    supplier_status,
    book_group_supplier,
    book_groups_of_buyers,
    sales_channel,
    vat_group,
    status_of_the_purchase_order,
    type_of_purchase_order,
    purchase_order_line_type,
    organizational_units,
    cost_centers,
    work_centers,
    type_of_warehouse,
  } = req.body;

  const configurator = await Configurator.create({
    unit_of_measure,
    inventory_valuation,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    way_the_article_was_created,
    origin,
    item_movement_types,
    movement_documents,
    supplier_status,
    book_group_supplier,
    book_groups_of_buyers,
    sales_channel,
    vat_group,
    status_of_the_purchase_order,
    type_of_purchase_order,
    purchase_order_line_type,
    organizational_units,
    cost_centers,
    work_centers,
    type_of_warehouse,
  });

  if (!configurator) {
    throw new Error("Can't create configurator please try again");
  }

  res.status(201).json({
    configurator: configurator.unit_of_measure,
  });
});

//Update configurator

const updateConfigurator = asyncHandler(async (req, res) => {
  let {
    configurator_id,
    unit_of_measure,
    inventory_valuation,
    stock_type,
    book_groups,
    type_of_goods,
    type_of_service,
    type_z_t,
    way_the_article_was_created,
    origin,
    item_movement_types,
    movement_documents,
    supplier_status,
    book_group_supplier,
    book_groups_of_buyers,
    sales_channel,
    vat_group,
    status_of_the_purchase_order,
    type_of_purchase_order,
    purchase_order_line_type,
    organizational_units,
    cost_centers,
    work_centers,
    type_of_warehouse,
  } = req.body;

  if (!configurator_id) {
    res.status(500);
    throw new Error("Please add all fields");
  }

  const configurator = await Configurator.update(
    {
        unit_of_measure,
        inventory_valuation,
        stock_type,
        book_groups,
        type_of_goods,
        type_of_service,
        type_z_t,
        way_the_article_was_created,
        origin,
        item_movement_types,
        movement_documents,
        supplier_status,
        book_group_supplier,
        book_groups_of_buyers,
        sales_channel,
        vat_group,
        status_of_the_purchase_order,
        type_of_purchase_order,
        purchase_order_line_type,
        organizational_units,
        cost_centers,
        work_centers,
        type_of_warehouse,
    },
    {
      where: {
        configurator_id,
      },
    }
  );

  if (!configurator) {
    res.status(500);
    throw new Error("Can't update configurator please try again.");
  }

  res.status(201).json({ message: "configurator updated." });
});
module.exports = {
  getAllConfigurator,
  createConfigurator,
  updateConfigurator,
  getOneConfigurator
};
