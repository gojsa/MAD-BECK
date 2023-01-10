
module.exports = (sequelize, Sequelize) => {

    const article_configurator = sequelize.define('article_configurator', {
        configurator_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        unit_of_measure : {
            type: Sequelize.STRING
        },
        inventory_valuation : {
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
        way_the_article_was_created : {
            type: Sequelize.STRING
        },
        origin : {
            type: Sequelize.STRING
        },
        item_movement_types : {
            type: Sequelize.STRING
        },
        movement_documents : {
            type: Sequelize.STRING
        },
        supplier_status : {
            type: Sequelize.STRING
        },
        book_group_supplier : {
            type: Sequelize.STRING
        },
        book_groups_of_buyers : {
            type: Sequelize.STRING
        },
        sales_channel : {
            type: Sequelize.STRING
        },
        vat_group : {
            type: Sequelize.STRING
        },
        status_of_the_purchase_order : {
            type: Sequelize.STRING
        },
        type_of_purchase_order : {
            type: Sequelize.STRING
        },
        purchase_order_line_type : {
            type: Sequelize.STRING
        },
        organizational_units : {
            type: Sequelize.STRING
        },
        cost_centers : {
            type: Sequelize.STRING
        },
        work_centers : {
            type: Sequelize.STRING
        },
        type_of_warehouse : {
            type: Sequelize.STRING
        }
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return article_configurator;
}

