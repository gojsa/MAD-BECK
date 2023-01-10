const db = require("../config/db");
const asyncHandler = require("express-async-handler");
const Storage = db.storage;
const StorageStatus = db.storageStatus;
const StorageMovement = db.storageMovement;
const Article = db.articles;
const createStorageMovement = async (
  storage_id,
  article_id,
  article_in,
  article_out,
  price_in,
  price_out,
  type_of_movement,
  status,
  belongs_to,
  belongs_to_id
) => {
  let check = true;
  const t = await db.sequelize.transaction();
  let saldoArticle, saldoStatus;

  try {
    const storageStatusCheck = await StorageStatus.findOne({
      where: {
        article_id,
        storage_id,
      },
    });

    if (!storageStatusCheck) {
      const storageStatusCreate = await StorageStatus.create({
        storage_id,
        article_id,
        saldo: 0,
      });
    }
    let newSaldoStatus, newSaldoArticle;

    const storageStatus = await StorageStatus.findOne({
      where: {
        article_id,
        storage_id,
      },
    });
    article_in
      ? (newSaldoStatus = Number(storageStatus.saldo) + Number(article_in))
      : (newSaldoStatus = Number(storageStatus.saldo) - Number(article_out));
    if (article_out > storageStatus.saldo) {
      
      throw new Error("Not enough in storage");
    }

    if (type_of_movement.toUpperCase() !== "RESERVED") {
    await storageStatus.update(
      {
        saldo: newSaldoStatus,
      },
      { transaction: t }
    );
  }
    const article = await Article.findOne({
      where: {
        article_id,
      },
    });
    article_in
      ? (newSaldoArticle = Number(article.total_stock) + Number(article_in))
      : (newSaldoArticle = Number(article.total_stock) - Number(article_out));
    await article.update(
      {
        total_stock: newSaldoArticle,
      },
      { transaction: t }
    );
    const storage = await Storage.findOne({
      where: {
        storage_id,
      },
    });
    const storageMovement = await StorageMovement.create(
      {
        storage_id,
        article_id,
        storage_name: storage.name,
        article_name: article.name,
        article_in,
        article_out: "-" + article_out,
        price_out,
        price_in,
        valid: "Y",
        type_of_movement,
        status,
        belongs_to,
        belongs_to_id
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    return true;
  } catch (err) {
    await t.rollback();
    return false;
  }
};
module.exports = { createStorageMovement };