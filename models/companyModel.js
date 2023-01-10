
module.exports = (sequelize, Sequelize) => {

    const Company = sequelize.define('companies', {
        companies_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        address: {
            type: Sequelize.STRING
        },
        location: {
            type: Sequelize.STRING
        },
        id_number: {
            type: Sequelize.STRING
        },
        tax_number: {
            type: Sequelize.STRING
        },
        tax_region: {
            type: Sequelize.STRING
        },
        county: {
            type: Sequelize.STRING
        },
        municipal_code: {
            type: Sequelize.STRING
        },
        zip_code: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        bank_name_1: {
            type: Sequelize.STRING
        },
        bank_name_2: {
            type: Sequelize.STRING
        },
        bank_number_1: {
            type: Sequelize.STRING
        },
        bank_number_2: {
            type: Sequelize.STRING
        },
        working_hours: {
            type: Sequelize.DECIMAL(4, 2)
        },
        working_hours_str: {
            type: Sequelize.STRING
        },
        shifts: {
            type: Sequelize.INTEGER
        },
        working_hours_shift_1: {
            type: Sequelize.INTEGER
        },
        working_hours_shift_1_from: {
            type: Sequelize.STRING
        },
        working_hours_shift_1_to: {
            type: Sequelize.STRING
        },
        working_hours_shift_2: {
            type: Sequelize.INTEGER
        },
        working_hours_shift_2_from: {
            type: Sequelize.STRING
        },
        working_hours_shift_2_to: {
            type: Sequelize.STRING
        },
        working_hours_shift_3: {
            type: Sequelize.INTEGER
        },
        working_hours_shift_3_from: {
            type: Sequelize.STRING
        },
        working_hours_shift_3_to: {
            type: Sequelize.STRING
        },
        units: {
            type: Sequelize.STRING
        },
        logo: {
            type: Sequelize.STRING
        },
        past_work_type: {
            type: Sequelize.STRING
        },
        records_type: {
            type: Sequelize.STRING
        },

        /* leaves */

        marriage: {
            type: Sequelize.INTEGER
        },
        paid_holiday: {
            type: Sequelize.INTEGER
        },
        paid_religious_holiday: {
            type: Sequelize.INTEGER
        },
        unpaid_religious_holiday: {
            type: Sequelize.INTEGER
        },
        birth_of_child: {
            type: Sequelize.INTEGER
        },
        care_for_member_of_family: {
            type: Sequelize.INTEGER
        },
        family_member_death: {
            type: Sequelize.INTEGER
        },
        voluntary_blood_donation: {
            type: Sequelize.INTEGER
        },
        exam: {
            type: Sequelize.INTEGER
        },

        /* leaves */


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

        /* Configurator of decreases and increases: (in percentages % ) */




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


        client_id: {
            type: Sequelize.STRING
        },
        client_token: {
            type: Sequelize.STRING
        },
        api: {
            type: Sequelize.STRING
        },
        activity_code: {
            type: Sequelize.STRING
        },
        activity_name: {
            type: Sequelize.STRING
        },
        municipality: {
            type: Sequelize.STRING
        },

// sve ili sve osim robnog
        application_use: {
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
                    name: 'companies_name_inx',
                    using: 'BTREE',
                    unique: false,
                    fields: [
                        'name'
                    ]
                }
            ]
        });

    return Company;
}
