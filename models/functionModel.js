
module.exports = (sequelize, Sequelize) => {
    const Function = sequelize.define('functions', {
        functions_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING
        },
        created_by: {
            type: Sequelize.STRING
        },
        updated_by: {
            type: Sequelize.STRING
        }
    },
    { 
      timestamps: true,
      createdAt: "created_at", 
      updatedAt: "updated_at",
      indexes: [
        {
            name: 'functions_name_inx',
            using: 'BTREE',
            unique: false,
            fields: [
                'name'
            ]
        }
    ]
    });

    return Function;
}
