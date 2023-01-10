module.exports = (sequelize, Sequelize) => {

    const article = sequelize.define('article', {
        article_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        article : {
            type: Sequelize.STRING,
            allowNull: false 
        },
        code : {
            type: Sequelize.STRING,
            allowNull: false 
        },
        name : {
            type: Sequelize.STRING
        },
        description : {
            type: Sequelize.STRING
        },
        unit_of_measure : {
            type: Sequelize.STRING
        },
        negative_stock : {
            type: Sequelize.STRING
        },
        stock_type : {
            type: Sequelize.STRING
        },
        book_groups : {
            type: Sequelize.STRING
        },
        type_of_goods : {
            type: Sequelize.STRING
        },
        type_of_service : {
            type: Sequelize.STRING
        },
        type_z_t : {
            type: Sequelize.STRING
        },
        customs_tariff_group : {
            type: Sequelize.STRING
        },
        goods_with_origin : {
            type: Sequelize.STRING
        },
        inventory_account : {
            type: Sequelize.STRING
        },
        account_expense : {
            type: Sequelize.STRING
        },
        average_entry_price : {
            type: Sequelize.STRING
        },
        sale_price : {
            type: Sequelize.STRING
        },
        last_entry_price : {
            type: Sequelize.STRING
        },
        average_selling_price : {
            type: Sequelize.STRING
        },
        last_sale_price : {
            type: Sequelize.STRING
        },
        total_stock : {
            type: Sequelize.STRING
        },
        quantity_on_the_production_order : {
            type: Sequelize.STRING
        },
        quantity_on_the_sales_order : {
            type: Sequelize.STRING
        },
        quantity_on_the_purchase_order : {
            type: Sequelize.STRING
        },
        procurement_time : {
            type: Sequelize.STRING
        },
        way_the_article_was_created : {
            type: Sequelize.STRING
        },
        component_number : {
            type: Sequelize.STRING
        },
        operation_plan_number : {
            type: Sequelize.STRING
        },
        inventory_valuation : {
            type: Sequelize.STRING
        },
        type_of_article : {
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

    return article;
}

