
module.exports = (sequelize, Sequelize) => {

    const invoice_article = sequelize.define('invoice_article', {
        invoice_article_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        storage_id : {
            type: Sequelize.INTEGER
        },
        article_name : {
            type: Sequelize.STRING
        },
        article_id : {
            type: Sequelize.INTEGER
        },
        storage_movement_id : {
            type: Sequelize.INTEGER
        },
        description : {
            type: Sequelize.STRING
        },
        value_with_vat : {
            type: Sequelize.STRING
        },
        type_of_good : {
            type: Sequelize.STRING
        },
        source : {
            type: Sequelize.STRING
        },
        source_number : {
            type: Sequelize.STRING
        },
        storage_location : {
            type: Sequelize.STRING
        },
        amount : {
            type: Sequelize.STRING
        },
        unit_of_measure : {
            type: Sequelize.STRING
        },
        selling_price : {
            type: Sequelize.STRING
        },
        discount : {
            type: Sequelize.STRING
        },
        sale_value : {
            type: Sequelize.STRING
        },
        vat : {
            type: Sequelize.STRING
        },
        sale_value_with_vat : {
            type: Sequelize.STRING
        },
        type : {
            type: Sequelize.STRING
        },
        valid : {
            type: Sequelize.STRING
        }
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return invoice_article;
}

