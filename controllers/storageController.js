const asyncHandler = require("express-async-handler");
const { sequelize } = require("../config/db");
const db = require("../config/db");
const Storage = db.storage;
const StorageStatus = db.storageStatus;
const StorageMovement = db.storageMovement;
const Article = db.articles;
const Op = db.Op;

// Get all Storage
const getAllStorage = (req, res) => {
const org_unit = req.params.org_unit
  Storage.findAll()
    .then((storage) => {
      res.status(200).json(storage);
    })
    .catch((err) => {
      throw new Error("'Cant get storage please try later.'");
    });
};

// Get storage by org unit id
const getByOrg = (req, res) => {
  const org_unit = req.params.org_id
  console.log(org_unit) 
  Storage.findOne({
      where:{
        org_unit
      }
    })
      .then((storage) => {
        res.status(200).json(storage);
      })
      .catch((err) => {
        throw new Error("'Cant get storage please try later.'");
      });
  };
  

const getAllStorageWithType = (req, res) => {
  const type_of_storage = req.params.type_of_storage
  const org_unit = req.params.org_unit
  Storage.findAll({
    where:{
      type_of_storage,
      org_unit
    }
  })
    .then((storage) => {
      res.status(200).json(storage);
    })
    .catch((err) => {
      throw new Error("'Cant get storage please try later.'");
    });
};
// Get one Storage
const getOneStorage = (req, res) => {
  const storage_id = req.params.storage_id;
  Storage.findOne({
    where: {
      storage_id,
      valid: "Y",
    },
  })
    .then((storage) => {
      res.status(200).json(storage);
    })
    .catch((err) => {
      throw new Error("'Cant get storage Order please try later.'");
    });
};

// Get all movement for one article
const getMovementArticle = (req, res) => {
  const storage_id = req.params.storage_id;
  const article_id = req.params.article_id;
  StorageMovement.findAll({
    where: {
      storage_id,
      article_id,
    },
  })
    .then((storage) => {
      res.status(200).json(storage);
    })
    .catch((err) => {
      throw new Error("'Cant get storage Order please try later.'");
    });
};
const getStorageArticles = (req, res) => {
  const storage_id = req.params.storage_id;
  StorageStatus.findAll({
    attributes: ['saldo', [sequelize.col('Article.article'), 'name_of_article'],[sequelize.col('Article.article_id'), 'article_id'], [sequelize.col('Storage.name'), 'name_of_storage'],[sequelize.col('Storage.storage_id'), 'storage_id'],[sequelize.col('Article.unit_of_measure'), 'unit_of_measure']],
    include: [
      {
        model: Article,
        attributes: []
      },
      {
        model: Storage,
        attributes: []
      }
      
    ],where:{
      storage_id
    }
  })
 
    .then((storage) => {
      res.status(200).json(storage);
    })
    .catch((err) => {
      console.log(err)
      throw new Error("'Cant get storage please try later.'");
    });
};


// Create storage
const createStorage = asyncHandler(async (req, res) => {
  let {
    storage_number,
    name,
    description,
    responsible,
    email,
    satus,
    org_unit,
    org_name,
    cost_center,
    cost_center_name,
    type_of_storage,
    valid,
  } = req.body;

  const storage = await Storage.create({
    storage_number,
    name,
    description,
    responsible,
    email,
    satus,
    org_unit,
    org_name,
    cost_center,
    cost_center_name,
    type_of_storage,
    valid,
  });

  if (!storage) {
    throw new Error("Can't create storage please try again");
  }

  res.status(201).json({
    storage: storage.name,
  });
});

//Update storage

const updateStorage = asyncHandler(async (req, res) => {

  let {
    storage_id,
    storage_number,
    name,
    description,
    responsible,
    email,
    satus,
    org_unit,
    org_name,
    cost_center,
    cost_center_name,
    type_of_storage,
    valid,
  } = req.body;

  if (!storage_id) {
    res.status(500);
    throw new Error("Please add all fields");
  }

  const storage = await Storage.update(
    {
      storage_number,
      name,
      description,
      responsible,
      email,
      satus,
      org_unit,
      org_name,
      cost_center,
      cost_center_name,
      type_of_storage,
      valid,
    },
    {
      where: {
        storage_id,
      },
    }
  );

  if (!storage) {
    res.status(500);
    throw new Error("Can't update storage please try again.");
  }

  res.status(201).json({ message: "storage updated." });
});

// Create storage status and movement
const createStorageStatus = asyncHandler(async (req, res) => {
  let {
    storage_id,
    storage_name,
    article_id,
    article_name,
    article_number,
    accounting_date,
    article_in,
    article_out,
    price_in,
    price_out,
    input_value,
    output_value,
    description,
    posting_date,
    type_of_movement,
    type_of_document,
    document_number,
    lot,
    type_of_good,
    storage_location,
    unit_of_measure,
    amount,
    average_price,
    purchase_price,
    book_value,
    sale_price,
    sale_value,
    user,
    customer,
    supplier,
    currency,
    production_order_id,
    valid,
  } = req.body;
  //  const t = await sequelize.transaction();

  let checker = true;
  try {
    const result = await sequelize.transaction(async (t) => {
      const storageStatus = await StorageStatus.findOne({
        where: { article_id, storage_id },
      });

      if (!storageStatus) {
        if (article_in) {

          const storageStatusCreate = await StorageStatus.create({
            storage_id,
            article_id,
            saldo: article_in,
          }, { transaction: t });
          if (!storageStatusCreate) {
            throw new Error("Can't create storage status please try again");
          }
        } else {
          checker = false;

          res.status(400).json({
            message: "The saldo must be a positive number",
          });
        }
      } else {
        let newSaldo;
        if (article_in) {

          newSaldo = storageStatus.saldo + Number(article_in);
        } else {
          newSaldo = storageStatus.saldo + Number(article_out);

        }
        if (newSaldo < 0) {
          checker = false;
          res.status(400).json({
            message: "The saldo must be a positive number",
          });

        } else {
          const storageStatusUpdate = await StorageStatus.update(
            {
              saldo: newSaldo,
            },
            { where: { article_id, storage_id }, }, { transaction: t }
          );

          if (!storageStatusUpdate) {
            throw new Error("Can't update storage status please try again");
          }
        }
      }
      if (checker) {
        let inputValue, outputValue, outPositiveNumber;
        if (article_in) {
          inputValue = price_in * article_in;
        } else {
          outputValue = price_out * article_out;
          outPositiveNumber = Math.abs(outputValue)
        }

        const storageMovement = await StorageMovement.create({
          storage_id,
          input_value: inputValue,
          output_value: outPositiveNumber,
          storage_name,
          article_id,
          article_name,
          article_number,
          accounting_date,
          article_in,
          article_out,
          price_in,
          price_out,
          description,
          posting_date,
          type_of_movement,
          type_of_document,
          document_number,
          lot,
          type_of_good,
          storage_location,
          unit_of_measure,
          amount,
          average_price,
          purchase_price,
          book_value,
          sale_price,
          sale_value,
          user,
          customer,
          supplier,
          currency,
          production_order_id,
          valid

        });

        if (!storageMovement) {

          throw new Error("Can't create storage movement please try again");
        }

        const storageAvg = await StorageMovement.findOne({
          attributes: [[db.Sequelize.fn('AVG', db.Sequelize.col('price_in')), 'priceAvg']],

          where: { article_id },
        });

        if (!storageAvg) {
          throw new Error("Can't get storage movement please try again");
        }
        const articleSum = await StorageStatus.findOne({
          attributes: [[db.Sequelize.fn('SUM', db.Sequelize.col('saldo')), 'sumSaldo']],

          where: { article_id },
        });

        if (!articleSum) {
          throw new Error("Can't get storage status please try again");
        }
        const sumArt = JSON.parse(JSON.stringify(articleSum));
        const artPrice = JSON.parse(JSON.stringify(storageAvg));

        const article = await Article.update({
          average_selling_price: artPrice.priceAvg,
          total_stock: sumArt.sumSaldo
        },
          {
            where: {
              article_id
            }
          }
        )

        res.status(201).json({
          storage: storageAvg,
          article: articleSum
        });


      }
    })
  } catch (error) {
    console.log(error)
  }

});


const getStorageArticleInfo = asyncHandler(async (req, res) => {
  
  const storage = await Article.findAll({
    attributes: ["article", "name", "type_of_goods", "total_stock", "unit_of_measure", "average_selling_price", [db.sequelize.literal('(total_stock * average_selling_price)'), 'value']],
    include: [
      {
        model: StorageMovement,

        include: [{
          model: Storage,
          attributes: ["storage_number", "name"]
        }]
      }

    ]
  })
  console.log(storage)
  res.status(201).json({
    article: storage,
  });
})

const getOneStorageArticleInfo = asyncHandler(async (req, res) => {
  const article_id = req.params.article_id;
  const storage_id = req.params.storage_id;

  const storageMovement = await StorageMovement.findAll({
    where: {
      article_id,
      storage_id
    }
  })
  res.status(201).json({
    storageMovement: storageMovement,
  });
})

module.exports = {
  getAllStorage,
  createStorage,
  updateStorage,
  getOneStorage,
  createStorageStatus,
  getStorageArticleInfo,
  getOneStorageArticleInfo,
  getStorageArticles,
  getMovementArticle,
  getAllStorageWithType,
  getByOrg
};
