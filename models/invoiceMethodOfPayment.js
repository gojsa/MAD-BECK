
module.exports = (sequelize, Sequelize) => {

    const invoice_method_of_payment = sequelize.define('invoice_method_of_payment', {
        total : {
            type: Sequelize.INTEGER
        }
       
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return invoice_method_of_payment;
}

