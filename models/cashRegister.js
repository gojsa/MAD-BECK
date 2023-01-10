
module.exports = (sequelize, Sequelize) => {

    const cash_register = sequelize.define('cash_register', {
        cash_register_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        cash_register_name : {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return cash_register;
}

