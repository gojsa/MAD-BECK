const db = require("../config/db");
const orderBook = db.orderBook;

const orderBookInsert = async (analytical_account_id, document_number, description, subject, owes, demand) => {

    const orderBooks = await orderBook.create({
        analytical_account_id, document_number, description, subject, owes, demand
    });

    if (!orderBooks) {
        res.status(500);
        throw new Error('Can`t create order book please try later.')
    }

   return { success : true };
}



module.exports = { orderBookInsert }