const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const StorageConfigurator = db.storageConfigurator;
const Op = db.Op;

// Get all Storage
const getAllStorageConfigurator = (req, res) => {
    StorageConfigurator.findAll()
    .then((storageConfigurator) => {
      res.status(200).json(storageConfigurator);
    })
    .catch((err) => {
      throw new Error("'Can`t get storageConfigurator please try later.'");
    });
};
// Get one Storage Configurator by column name
const getOneStorageConfigurator = asyncHandler(async(req, res) => {
  const column = req.params.column;
  const storageConfig = await StorageConfigurator.findAll({
    where:{
      [column]: {
        [Op.ne]: null
      }
      
    },
   attributes:[column],
    
  })

  if (!storageConfig) {
    res.status(404)
    throw new Error("Cannot find storage configurator!")
  }

  res.status(200).json(storageConfig)
});
// Create storageConfigurator
const createStorageConfigurator = asyncHandler(async (req, res) => {
  let {
    storage_number,
    storage_name,
    storage_movement_types,
    link_document,
    work_satus,
    valid,
  } = req.body;

  const storageConfigurator = await StorageConfigurator.create({
    storage_number,
    storage_name,
    storage_movement_types,
    link_document,
    work_satus,
    valid,
  });

  if (!storage) {
    throw new Error("Can't create storage Configurator please try again");
  }

  res.status(201).json({
    storageConfigurator: storageConfigurator.name,
  });
});

//Update storage

const updateStorageConfigurator = asyncHandler(async (req, res) => {
  let {
    storage_number,
    storage_name,
    storage_movement_types,
    link_document,
    work_satus,
    valid,
  } = req.body;

  if (!storage_configurator_id) {
    res.status(500);
    throw new Error("Please add all fields");
  }

  const storageConfigurator = await StorageConfigurator.update(
    {
      storage_number,
      storage_name,
      storage_movement_types,
      link_document,
      work_satus,
      valid,
    },
    {
      where: {
        storage_configurator_id,
      },
    }
  );

  if (!storageConfigurator) {
    res.status(500);
    throw new Error("Can't update storage Configurator please try again.");
  }

  res.status(201).json({ message: "storage Configurator updated." });
});
module.exports = {
  getAllStorageConfigurator,
  createStorageConfigurator,
  updateStorageConfigurator,
  getOneStorageConfigurator
};
