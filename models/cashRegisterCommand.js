
module.exports = (sequelize, Sequelize) => {

    const cash_register_command = sequelize.define('cash_register_command', {
        cash_register_command_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        cash_register_command_name : {
            type: Sequelize.STRING
        }
    },
    {
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return cash_register_command;
}

