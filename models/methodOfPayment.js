
module.exports = (sequelize, Sequelize) => {

    const method_of_payment = sequelize.define('method_of_payment', {
        method_of_payment_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name : {
            type: Sequelize.STRING
        }
       
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return method_of_payment;
}

