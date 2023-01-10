module.exports = (sequelize, Sequelize) => {
  const storage_configurator = sequelize.define(
    "storage_configurator",
    {
      storage_configurator_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      storage_number: {
        type: Sequelize.STRING,
      },
      storage_name: {
        type: Sequelize.STRING,
      },
      storage_movement_types: {
        type: Sequelize.STRING,
      },
      link_document: {
        type: Sequelize.STRING,
      },
      work_satus: {
        type: Sequelize.STRING,
      },
      valid: {
        type: Sequelize.STRING,
      },
    },
    {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  return storage_configurator;
};
