
module.exports = (sequelize, Sequelize) => {

    const storage_movement = sequelize.define('storage_movement', {
        storage_movement_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        storage_id : {
            type: Sequelize.INTEGER
        },
        storage_name : {
            type: Sequelize.STRING
        },
        article_id : {
            type: Sequelize.INTEGER
        },
        article_name : {
            type: Sequelize.STRING
        },
        article_number : {
            type: Sequelize.STRING
        },
        accounting_date : {
            type: Sequelize.STRING
        },
        article_in : {
            type: Sequelize.STRING
        },
        article_out : {
            type: Sequelize.STRING
        },
        price_in : {
            type: Sequelize.STRING
        },
        price_out : {
            type: Sequelize.STRING
        },
        input_value : {
            type: Sequelize.STRING
        },
        output_value : {
            type: Sequelize.STRING
        },
        description : {
            type: Sequelize.STRING
        },
        posting_date : {
            type: Sequelize.STRING
        },
        type_of_movement : {
            type: Sequelize.STRING
        },
        type_of_document : {
            type: Sequelize.STRING
        },
        document_number : {
            type: Sequelize.STRING
        },
        lot : {
            type: Sequelize.STRING
        },
        type_of_good : {
            type: Sequelize.STRING
        },
        storage_location : {
            type: Sequelize.STRING
        },
        unit_of_measure : {
            type: Sequelize.STRING
        },
        amount : {
            type: Sequelize.STRING
        },
        average_price : {
            type: Sequelize.STRING
        },
        purchase_price : {
            type: Sequelize.STRING
        },
        book_value : {
            type: Sequelize.STRING
        },
        sale_price : {
            type: Sequelize.STRING
        },
        sale_value : {
            type: Sequelize.STRING
        },
        user : {
            type: Sequelize.STRING
        },
        customer : {
            type: Sequelize.STRING
        },
        supplier : {
            type: Sequelize.STRING
        },
        currency : {
            type: Sequelize.STRING
        },
        production_order_id : {
            type: Sequelize.INTEGER
        },
        status : {
            type: Sequelize.STRING
        },
        valid : {
            type: Sequelize.STRING
        },
        
        
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return storage_movement;
}

