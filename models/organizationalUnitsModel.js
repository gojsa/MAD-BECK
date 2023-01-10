
module.exports = (sequelize, Sequelize) => {
    const OrganizationalUnits = sequelize.define('organizational_units', {
        organizational_units_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
        },

        /* POSLOVNICE KOLONE */

        id_number: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        municipality: {
            type: Sequelize.STRING
        },
        municipal_code: {
            type: Sequelize.STRING
        },
        county: {
            type: Sequelize.STRING
        },
        tax_region: {
            type: Sequelize.STRING
        },
        type: {
            type: Sequelize.STRING
        },

        /* POSLOVNICE KOLONE */

        
        /* Configurator of decreases and increases: (in percentages % ) */

        night_shift: {
            type: Sequelize.INTEGER
        },
        overtime: {
            type: Sequelize.INTEGER
        },
        work_on_holidays: {
            type: Sequelize.INTEGER
        },
        business_trip: {
            type: Sequelize.INTEGER
        },
        sick_leave: {
            type: Sequelize.INTEGER
        },
        sick_leave_over_42_days: {
            type: Sequelize.INTEGER
        },
        maternity_leave: {
            type: Sequelize.INTEGER
        },
        pregnancy_leave: {
            type: Sequelize.INTEGER
        },
        strike: {
            type: Sequelize.INTEGER
        },
        standby_time: {
            type: Sequelize.INTEGER
        },
        on_duty: {
            type: Sequelize.INTEGER
        },
        difficult_working_conditions: {
            type: Sequelize.INTEGER
        },
        work_on_weekly_rest_days: {
            type: Sequelize.INTEGER
        },
        past_work_percentage: {
            type: Sequelize.DECIMAL(5, 2)
        },
        injury_at_work: {
            type: Sequelize.INTEGER
        },

        past_work_type: {
            type: Sequelize.STRING
        },
        records_type: {
            type: Sequelize.STRING
        },


                /* CONTRIBUTIONS */

                contributions_from_salary_pio_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_from_salary_health_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_from_salary_unemployment_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_on_salary_pio_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_on_salary_health_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_on_salary_unemployment_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                income_tax_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_for_salary_pio_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_for_salary_health_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_for_salary_unemployment_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contributions_for_child_protection_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                contribution_for_solidarity_rate: {
                    type: Sequelize.DECIMAL(6, 3)
                },
                /* CONTRIBUTIONS */

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
                    name: 'organizational_units_name_inx',
                    using: 'BTREE',
                    unique: false,
                    fields: [
                        'name'
                    ]
                }
            ]
        });

    return OrganizationalUnits;
}