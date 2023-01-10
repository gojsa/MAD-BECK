
module.exports = (sequelize, Sequelize) => {
    const PlacesOfExpenses = sequelize.define('places_of_expenses', {
        places_of_expenses_id : {
            type : Sequelize.INTEGER,
            autoIncrement : true,
            primaryKey : true,
            allowNull : false
        },
        name : {
            type : Sequelize.STRING,
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
            name: 'places_of_expenses_name_inx',
            using: 'BTREE',
            unique: false,
            fields: [
                'name'
            ]
        }
    ]
    });

    return PlacesOfExpenses;
}