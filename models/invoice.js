
module.exports = (sequelize, Sequelize) => {

    const invoice = sequelize.define('invoice', {
        invoice_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        invoice_number : {
            type: Sequelize.STRING,
        },
        customer_number : {
            type: Sequelize.STRING
        },
        customer_name : {
            type: Sequelize.STRING
        },
        date : {
            type: Sequelize.DATE
        },
        date_of_order: {
            type: Sequelize.DATE
        },
        date_of_delivery : {
            type: Sequelize.DATE
        },
        required_delivery_date : {
            type: Sequelize.DATE
        },
        customer_order_number : {
            type: Sequelize.STRING
        },
        status : {
            type: Sequelize.STRING
        },
        currency : {
            type: Sequelize.STRING
        },
        subtotal_without_vat : {
            type: Sequelize.STRING
        },
        discount : {
            type: Sequelize.STRING
        },
        vat : {
            type: Sequelize.STRING
        },
        total_invoice : {
            type: Sequelize.INTEGER
        },
        invoice_type : {
            type: Sequelize.STRING
        },
        // method_of_payment : {
        //     type: Sequelize.STRING
        // },
        organisation_unit_id : {
            type: Sequelize.INTEGER
        },
        fiscal_number : {
            type: Sequelize.INTEGER
        },
        fiscal_status : {
            type: Sequelize.STRING,
            defaultValue: "N"
        },
        isLocked : {
            type: Sequelize.STRING,
            defaultValue: "N"
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

    return invoice;
}

