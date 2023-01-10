
module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define('users', {
        users_id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        user_type: {
            type: Sequelize.STRING,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        user_name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        },
        active: {
            type: Sequelize.STRING
        },
        jmbg: {
            type: Sequelize.STRING
        },
        phone_number: {
            type: Sequelize.STRING
        },
        gender: {
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        maiden_name: {
            type: Sequelize.STRING
        },
        parents_name: {
            type: Sequelize.STRING
        },
        tax_region: {
            type: Sequelize.STRING
        },
        county: {
            type: Sequelize.STRING
        },
        tax_number: {
            type: Sequelize.STRING
        },
        citizenship: {
            type: Sequelize.STRING
        },
        marital_status: {
            type: Sequelize.STRING
        },
        date_of_birth: {
            type: Sequelize.DATEONLY
        },
        municipality_of_birth: {
            type: Sequelize.STRING
        },
        place_of_birth: {
            type: Sequelize.STRING
        },
        municipal_code: {
            type: Sequelize.STRING
        },
        zip_code: {
            type: Sequelize.STRING
        },
        state: {
            type: Sequelize.STRING
        },
        permanent_residence: {
            type: Sequelize.STRING
        },
        temporary_residence: {
            type: Sequelize.STRING
        },
        works_in: {
            type: Sequelize.STRING
        },
        bank_account: {
            type: Sequelize.STRING
        },
        bank_name: {
            type: Sequelize.STRING
        },
        type_of_emplyoment: {
            type: Sequelize.STRING
        },
        photo: {
            type: Sequelize.STRING
        },
        /*
            Foregin 
        */
        working_permit: {
            type: Sequelize.STRING
        },
        working_permin_number: {
            type: Sequelize.STRING
        },
        working_permit_from: {
            type: Sequelize.DATEONLY
        },
        working_permit_to: {
            type: Sequelize.DATEONLY
        },
        issuer: {
            type: Sequelize.STRING
        },
        valid: {
            type: Sequelize.STRING
        },
        tax_relief: {
            type: Sequelize.STRING
        },
        residence_permit: {
            type: Sequelize.STRING
        },
        residence_permit_from: {
            type: Sequelize.DATEONLY
        },
        residence_permit_to: {
            type: Sequelize.DATEONLY
        },
        resident: {
            type: Sequelize.STRING
        },
        /*
            Foregin 
        */

        /*
            Education
        */
        profession: {
            type: Sequelize.STRING,
        },
        degree_of_education: {
            type: Sequelize.STRING,
        },
        degree_of_expretise: {
            type: Sequelize.STRING,
        },
        degree_of_proffesional_qualification: {
            type: Sequelize.STRING,
        },
        /*
            Education
        */


        /* Salary */

        payment_type: {
            type: Sequelize.STRING,
        },
        salary_type: {
            type: Sequelize.STRING,
        },
        salary_base: {
            type: Sequelize.DECIMAL(8, 2),
        },
        coefficient_of_complexity: {
            type: Sequelize.DECIMAL(6, 2),
        },
        stimulation_coefficient: {
            type: Sequelize.DECIMAL(6, 2),
        },
        net_hourly_rate: {
            type: Sequelize.DECIMAL(6, 2),
        },
        gross_hourly_rate: {
            type: Sequelize.DECIMAL(8, 4),
        },
        net_salary: {
            type: Sequelize.DECIMAL(8, 2),
        },
        gross_salary: {
            type: Sequelize.DECIMAL(10, 4),
        },
        meal_allowances: {
            type: Sequelize.DECIMAL(6, 2),
        },
        meal_allowances_natural: {
            type: Sequelize.DECIMAL(6, 2),
        },
        meal_allowances_taxable: {
            type: Sequelize.DECIMAL(6, 2),
        },
        transportation_fee: {
            type: Sequelize.DECIMAL(6, 2),
        },
        transportation_type: {
            type: Sequelize.STRING
        },
        transportation_fee_natural: {
            type: Sequelize.DECIMAL(6, 2),
        },
        amount_of_personal_deduction: {
            type: Sequelize.INTEGER,
        },
        years_of_service: {
            type: Sequelize.INTEGER,
        },
        months_of_service: {
            type: Sequelize.INTEGER,
        },
        days_of_service: {
            type: Sequelize.INTEGER,
        },
        cell_phone_use: {
            type: Sequelize.DECIMAL(6, 2),
        },
        car_use: {
            type: Sequelize.DECIMAL(6, 2),
        },
        internal_suspension: {
            type: Sequelize.DECIMAL(6, 2),
        },

        /* Salary */




        /*
            Health condition
        */
        disability: {
            type: Sequelize.STRING
        },
        disability_description: {
            type: Sequelize.STRING
        },
        cause: {
            type: Sequelize.STRING
        },
        date_of_disability: {
            type: Sequelize.DATE
        },
        percentage_of_disability: {
            type: Sequelize.STRING
        },
        description_of_disability: {
            type: Sequelize.STRING
        },
        condition_on_date: {
            type: Sequelize.DATE
        },
        conclusion: {
            type: Sequelize.STRING
        },
        date_of_conclusion: {
            type: Sequelize.DATE
        },

        /*
            Health condition
        */

        /*
            Other
        */
        /*  stimulation: {
              type: Sequelize.STRING
          },
          disincentives: {
              type: Sequelize.STRING
          },
          inovation: {
              type: Sequelize.STRING
          },
          other: {
              type: Sequelize.STRING
          },
          suggestion_for_promotion: {
              type: Sequelize.STRING
          },
          years_in_company: {
              type: Sequelize.STRING
          },
          start_of_employment: {
              type: Sequelize.DATE
          },
          end_of_employment: {
              type: Sequelize.DATE
          },*/
        individual_party: {
            type: Sequelize.STRING
        },
        start_of_employment: {
            type: Sequelize.DATE
        },
        end_of_employment_contract: {
            type: Sequelize.DATE
        },
        rfid_card_number:{
            type: Sequelize.STRING
        },
        isDay: {
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
                    name: 'users_jmbg_inx',
                    using: 'BTREE',
                    unique: false,
                    fields: [
                        'jmbg'
                    ]
                },
                {
                    name: 'users_name_inx',
                    using: 'BTREE',
                    unique: false,
                    fields: [
                        'name'
                    ]
                },
                {
                    name: 'users_email_inx',
                    using: 'BTREE',
                    unique: true,
                    fields: [
                        'email'
                    ]
                },
                {
                    name: 'users_user_name_inx',
                    using: 'BTREE',
                    unique: true,
                    fields: [
                        'user_name'
                    ]
                },
                {
                    name: 'users_multi_inx',
                    using: 'BTREE',
                    unique: true,
                    fields: [
                        'email', 'user_name'
                    ]
                }
            ]
        });

    return User;
}

