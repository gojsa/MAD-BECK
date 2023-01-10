
module.exports = (sequelize, Sequelize) => {

    const storage = sequelize.define('storage', {
        storage_id : {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        storage_number : {
            type: Sequelize.INTEGER
        },
        name : {
            type: Sequelize.STRING
        },
        description : {
            type: Sequelize.STRING
        },
        responsible : {
            type: Sequelize.STRING
        },
        email : {
            type: Sequelize.STRING
        },
        satus : {
            type: Sequelize.STRING
        },
        org_unit : {
            type: Sequelize.INTEGER
        },
        org_name : {
            type: Sequelize.STRING
        },
        cost_center : {
            type: Sequelize.STRING
        },
        cost_center_name : {
            type: Sequelize.STRING
        },
        type_of_storage : {
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

    return storage;
}

