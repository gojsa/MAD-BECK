
module.exports = (sequelize, Sequelize) => {

    const storage_status = sequelize.define('storage_status', {
        storage_status_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        storage_id : {
            type: Sequelize.INTEGER
        },
        article_id : {
            type: Sequelize.INTEGER
        },
        saldo : {
            type: Sequelize.INTEGER
        },
        saldo_value : {
            type: Sequelize.INTEGER
        }
        
    },
    { 
        timestamps: true,
        createdAt: "created_at", 
        updatedAt: "updated_at"
      });

    return storage_status;
}

