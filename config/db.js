
const { Sequelize, Op } = require('sequelize');
const bcrypt = require("bcryptjs");

const sequelize = new Sequelize(process.env.DB, "root", process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: 'mysql',
    define: {
        freezeTableName: true
    },
    logging: false,
    dialectOptions: {
        dateStrings: true,
        typeCast: true,
        decimalNumbers: true
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 100*1000,
        idle: 10000
    },
    timezone: "+01:00",
});



const db = {};

db.Sequelize = Sequelize;
db.Op = Op;
db.sequelize = sequelize;

//Models
db.articles = require("../models/articles")(sequelize, Sequelize);
db.articleConfigurator = require("../models/articleConfigurator")(sequelize, Sequelize);





db.methodOdPayment = require("../models/methodOfPayment")(sequelize, Sequelize);
db.invoiceMethodOfPayment = require("../models/invoiceMethodOfPayment")(sequelize, Sequelize);
db.storage = require("../models/storage")(sequelize, Sequelize);
db.storageConfigurator = require("../models/storageConfigurator")(sequelize, Sequelize);


db.storageStatus = require("../models/storageStatus")(sequelize, Sequelize);
db.storageMovement = require("../models/storageMovement")(sequelize, Sequelize);


db.invoice = require("../models/invoice")(sequelize, Sequelize);
db.invoiceArticle = require("../models/invoiceArticle")(sequelize, Sequelize);


db.cashRegister = require("../models/cashRegister")(sequelize, Sequelize);
db.cashRegisterCommand = require("../models/cashRegisterCommand")(sequelize, Sequelize);



/* USER MANAGEMENT */

db.companies = require("../models/companyModel")(sequelize, Sequelize);
db.organizationalUnits = require("../models/organizationalUnitsModel")(
    sequelize,
    Sequelize
  );
  db.placesOfExpenses = require("../models/placesOfExpensesModel")(
    sequelize,
    Sequelize
  );

db.users = require("../models/userModel")(sequelize, Sequelize);

db.functions = require("../models/functionModel")(sequelize, Sequelize);
db.groups = require("../models/groupsModel")(sequelize, Sequelize);

/* USER MANAGEMENT */



/* FINANCE */



/* FINANCE */




/* USER MANAGEMENT RELATIONS */

db.users.belongsTo(db.groups, { foreignKey: 'groups_id', targetKey: 'groups_id' });


//COMPANY ORG. UNITS
db.companies.hasMany(db.organizationalUnits, {
    foreignKey: "companies_id",
  });
  db.organizationalUnits.belongsTo(db.companies, {
    foreignKey: "companies_id",
  });


//ORG. UNITS PLACES OF EXPENSES
db.organizationalUnits.hasMany(db.placesOfExpenses, {
    foreignKey: "organizational_units_id",
  });
  db.placesOfExpenses.belongsTo(db.organizationalUnits, {
    foreignKey: "organizational_units_id",
  });





// Payment Accounts

// Types Of Income









// Groups functions
db.functions.belongsToMany(db.groups, {
    through: "groups_functions",
    foreignKey: "functions_id",
    otherKey: "groups_id"
});

db.groups.belongsToMany(db.functions, {
    through: "groups_functions",
    foreignKey: "groups_id",
    otherKey: "functions_id"
});

// Users Companies
db.companies.belongsToMany(db.users, {
    through: "users_companies",
    foreignKey: "companies_id",
    otherKey: "users_id"
});

db.users.belongsToMany(db.companies, {
    through: "users_companies",
    foreignKey: "users_id",
    otherKey: "companies_id"
});

// Users Places of Expense
db.placesOfExpenses.belongsToMany(db.users, {
    through: "users_places_of_expenses",
    foreignKey: "places_of_expenses_id",
    otherKey: "users_id",
  });
  
  db.users.belongsToMany(db.placesOfExpenses, {
    through: "users_places_of_expenses",
    foreignKey: "users_id",
    otherKey: "places_of_expenses_id",
  });
  
  // Users Org Units
  db.organizationalUnits.belongsToMany(db.users, {
    through: "users_org_units",
    foreignKey: "organizational_units_id",
    otherKey: "users_id",
  });
  
  db.users.belongsToMany(db.organizationalUnits, {
    through: "users_org_units",
    foreignKey: "users_id",
    otherKey: "organizational_units_id",
  });




/* USER MANAGEMENT RELATIONS */



















db.storage.hasMany(db.storageMovement, {
    foreignKey: "storage_id"
});
db.storageMovement.belongsTo(db.storage, {
    foreignKey: "storage_id"
});

db.articles.hasMany(db.storageMovement, {
    foreignKey: "article_id"
});

db.cashRegister.hasMany(db.cashRegisterCommand, {
    foreignKey: "cash_register_id"
})
db.cashRegisterCommand.belongsTo(db.cashRegister, {
    foreignKey: "cash_register_command_id"
})

db.companies.belongsToMany(db.cashRegister, {
    through: "companies_cash_registers",
    foreignKey: "company_id",
    otherKey: "cash_register_id"
})

db.cashRegister.belongsToMany(db.companies, {
    through: "companies_cash_registers",
    foreignKey: "cash_register_id",
    otherKey: "company_id",
})

db.invoice.hasMany(db.invoiceArticle, {
    foreignKey: "invoice_id"
});
db.invoiceArticle.belongsTo(db.invoice, {
    foreignKey: "invoice_id"
});

db.users.hasMany(db.invoice, {
    foreignKey: "user_id"
})
db.invoice.belongsTo(db.users, {
    foreignKey: "user_id"
})

// Storage status
db.articles.hasMany(db.storageStatus, {
    foreignKey: "article_id"
});
db.storageStatus.belongsTo(db.articles, {
    foreignKey: "article_id"
});
db.storage.hasMany(db.storageStatus, {
    foreignKey: "storage_id"
});
db.storageStatus.belongsTo(db.storage, {
    foreignKey: "storage_id"
});

db.invoice.belongsToMany(db.methodOdPayment, {
    through: db.invoiceMethodOfPayment,
    foreignKey: "invoice_id",
    otherKey: "method_of_payment_id"
})

db.methodOdPayment.belongsToMany(db.invoice, {
    through: db.invoiceMethodOfPayment,
    foreignKey: "method_of_payment_id",
    otherKey: "invoice_id",
})

// const companiesArr = ['MMSCODE', 'CONRA', 'INP'];
// const regionArr = ['FBiH', 'RS', 'BD'];
// const salaryArr = ['gross', 'gross_hourly', 'net', 'net_hourly', 'osn_ks_ks', 'osn_ks', 'ns_fs_ks', 'bs_fs_ks'];
// const functionsArr = ['ADMIN', 'SUPERADMIN', 'USER', 'KADROVI', 'SIHTARICA', 'OBRACUN UGOVORA', 'EVIDENCIJA', 'OBRACUN PLATE', 'OBRACUNATE PLATE', 'KALKULATOR PLATA',
//     'REFUNDACIJA BOLOVANJA', 'PUTNI NALOG ZA OSOBU', 'PUTNI NALOG ZA VOZILO', 'FBIH', 'RS', 'BD'];
// const nameArr = ['BOJAN', 'ASIR', 'AZEM', 'AHMED', 'ELZIN'];
// const lastNameArr = ['PETROVIC', 'BEGIC', 'SMAJLIC', 'MIHAJLOVIC', 'HAJRIC'];
// const addressArr = ['CARICE MILICE', 'LUKE RADOJCICA', 'PATRIOTSKE LIGE', 'BRACE MAKSIMOVIC', 'BRACE POBRIC'];
// const locationArr = ['BANJA LUKA', 'PETROVO', 'TESANJ', 'SARAJEVO', 'DOBOJ'];
// const dateFromArr = ['2020-01-05', '2020-02-10', '2020-03-15', '2020-04-20', '2020-04-25'];
// const dateToArr = ['2021-01-05', '2021-02-10', '2021-03-15', '2021-04-20', '2021-05-25'];

// // Education
// const professionArr = ['MAJSTOR', 'PROGRAMER', 'EKONOMISTA'];
// const degreeEducationArr = ['1', '2', '3'];
// const degreeExpretiseArr = ['NSS', 'SSS', 'VSS'];
// const degreeProffesionalQualification = ['OSNOVNA', 'SREDNJA', 'FAKULTET'];

// // Booklets
// const numberArr = ['1212312', '4634634', '7867876'];
// const serialNumberArr = ['J01E123', 'B01C124', 'M01S145'];
// const issuerArr = ['MUP PETROVO', 'MUP BANJA LUKA', 'MUP TESANJ'];
// const stateIssuerArr = ['PETROVO', 'BANJA LUKA', 'TESANJ'];


// // Leaves
// const leaveTypeArr = ['PAID', 'NOT PAID'];
// const leaveStatusArr = ['PENDING', 'APPROVED'];
// const leaveDateFromArr = ['2022-01-05', '2022-02-10', '2022-03-15', '2022-04-20', '2022-05-25'];
// const leaveDateToArr = ['2022-01-10', '2022-02-15', '2022-03-20', '2022-04-24', '2022-05-28'];


// // Org. Units
// const orgUnitsTypeArr = ['RACUNOVODSTVO', 'ODRZAVANJE', 'PROIZVODNJA', 'RUKOVODSTVO'];


// // Places ofExpense
// const placesOfExpensesArr = ['OBRACUN PLATA', 'CISCENJE', 'WEB DEVELOPMENT', 'HR'];


// // SUSPENSIONS
// const randPartyArr = ['NLB', 'NOVA', 'MICROFIN'];
// const randAmountArr = ['250', '500', '750'];
// const randInstallmentsArr = [3, 6, 9];


// const groupNum = 10;
// const userNum = 5;

// // Create random for test
// db.startDB = async () => {

//     //insert into production order configurator
   
//     const workCenterConfig = await db.workCenterConfigurator.bulkCreate([
//     {
//         status: 'U PRIPREMI',
//         waste_percentage: '3',
//         valid: 'Y'
           
//     },
//     {
//         status: 'U IZRADI',
//         waste_percentage: null,
//         valid: 'Y'
           
//     },
//     {
//         status: 'ZATVOREN',
//         waste_percentage: null,
//         valid: 'Y'
           
//     }
// ])
//     workCenterConfig ? console.log('work center  configurator have been saved successfully') : console.log('Something went wrong')

//     // insert into tables
//     for (c = 0; c < companiesArr.length; c++) {
//         let randAddLoc = randomIntFromInterval(1, 10);
//         let randUser = randomIntFromInterval(0, 4);
//         let randOrg = randomIntFromInterval(0, 3);
//         let randRegion = randomIntFromInterval(0, 2);


//         company = await db.companies.create({
//             name: companiesArr[c],
//             address: addressArr[randAddLoc],
//             location: locationArr[randAddLoc],
//             id_number: "131416245687" + randAddLoc,
//             tax_number: "7989789" + randAddLoc,
//             tax_region: regionArr[randRegion],
//             bank_name_1: "NLB RAZVOJNA",
//             bank_name_2: "UNICREDIT",
//             bank_number_1: "1244345475708" + randAddLoc,
//             bank_number_2: "1244345475708",
//             address: 'Mese Selimovica br 25',
//             location: 'Tešanj',
//             working_hours: 24,
//             shifts: 3,
//             working_hours_shift_1: 8,
//             working_hours_shift_2: 8,
//             working_hours_shift_3: 8,
//             logo: `https://identicon-api.herokuapp.com/${nameArr[randUser]}/50?format=png`,
//             county: 'ZDK',
//             municipal_code: '025',
//             marriage: 5,
//             paid_holiday: 20,
//             paid_religious_holiday: 2,
//             unpaid_religious_holiday: 2,
//             birth_of_child: 5,
//             care_for_member_of_family: 10,
//             family_member_death: 5,
//             voluntary_blood_donation: 2,
//             exam: 1,
//             night_shift: 10,
//             overtime: 20,
//             work_on_holidays: 10,
//             business_trip: 20,
//             sick_leave_over_42_days: 15,
//             maternity_leave: 10,
//             pregnancy_leave: 20,
//             strike: 15,
//             standby_time: 10,
//             on_duty: 15,
//             difficult_working_conditions: 20,
//             work_on_weekly_rest_days: 10,

//             past_work_type: 'current',
//             records_type: 'daily ',
//             past_work_percentage: 0.4,

//             contributions_from_salary_pio_rate: 17,
//             contributions_from_salary_health_rate: 12.5,
//             contributions_from_salary_unemployment_rate: 1.5,
//             contributions_on_salary_pio_rate: 6,
//             contributions_on_salary_health_rate: 4,
//             contributions_on_salary_unemployment_rate: 0.5,
//             income_tax_rate: 10,
//             contributions_for_salary_pio_rate: 18.5,
//             contributions_for_salary_health_rate: 10.2,
//             contributions_for_salary_unemployment_rate: 0.6,
//             contributions_for_child_protection_rate: 1.7,
//             contribution_for_solidarity_rate: 0.25,

//             created_by: "BOJANT",
//             updated_by: 'BOJANT'
//         });
//         const org = await db.organizationalUnits.create({
//             companies_id: company.companies_id,
//             name: orgUnitsTypeArr[randOrg]
//         });


//         await db.placesOfExpenses.create({
//             organizational_units_id: org.organizational_units_id,
//             name: placesOfExpensesArr[randOrg]
//         });

//         await company.createBank_account({
//             name: 'UNICREDIT',
//             account_type: 'TRANSACTION',
//             number: '1020500000106698'
//         });
//     }

//     functionsArr.forEach(el => {
//         db.functions.create({
//             name: el,
//             created_by: 'BOJANT',
//             updated_by: 'BOJANT'
//         });
//     });


//     // create admin group
//     await db.groups.create({
//         name: `GROUP_ADMIN`,
//         created_by: 'BOJANT',
//         updated_by: 'BOJANT'
//     }).then(async groupe => {

//         const functions = await db.functions.findAll({
//             where: {
//                 name: [functionsArr[0], functionsArr[2]]
//             }
//         });
//         groupe.addFunctions(functions);
//     });


//     for (i = 1; i <= groupNum; i++) {
//         let randFunction = randomIntFromInterval(0, 12);
//         let functionName = functionsArr[2];

//         db.groups.create({
//             name: `GROUP_${i}`,
//             created_by: 'BOJANT',
//             updated_by: 'BOJANT'
//         }).then(async groupe => {

//             const functions = await db.functions.findAll({
//                 where: {
//                     name: functionName
//                 }
//             });
//             groupe.addFunction(functions);
//         });
//     }


//     for (u = 1; u <= userNum; u++) {
//         let randGroup = randomIntFromInterval(1, 10);
//         let randCompany = randomIntFromInterval(0, 2);
//         let randName = randomIntFromInterval(0, 4);
//         let randLast = randomIntFromInterval(0, 4);
//         let name = nameArr[randName];
//         let lastName = lastNameArr[randLast];
//         let compnayName = companiesArr[randCompany];

//         //Hash password
//         let password = '123654';
//         let salt = await bcrypt.genSalt(10);
//         let hashedPassword = await bcrypt.hash(password, salt);

//         const companySet = await db.companies.findOne({
//             where: {
//                 name: compnayName
//             },
//             include: [
//                 {
//                     model: db.organizationalUnits,
//                     include: [
//                         {
//                             model: db.placesOfExpenses
//                         }
//                     ]
//                 }
//             ]
//         });


//         const placeOfExpense = await db.placesOfExpenses.findByPk(companySet.organizational_units[0].places_of_expenses[0].places_of_expenses_id);

//         let groups_id = randGroup;
//         if (u == 1) {
//             groups_id = 1;
//         }

//         let randSal = randomIntFromInterval(0, 7);
//         await db.users.create({
//             name: `${name} ${lastName}`,
//             user_name: `USER${u}`,
//             email: `mail${u}@gmail.com`,
//             password: hashedPassword,
//             groups_id,
//             active: 'Y',
//             jmbg: `123456789146${u}`,
//             gender: "M",
//             address: "address",
//             county: 'ZDK',
//             municipal_code: '028',
//             maiden_name: "No",
//             parents_name: nameArr[randLast],
//             tax_region: regionArr[randCompany],
//             tax_number: "tax_number",
//             citizenship: "citizenship",
//             marital_status: "marital_status",
//             date_of_birth: "1989-01-25",
//             municipality_of_birth: "municipality_of_birth",
//             place_of_birth: "place_of_birth",
//             zip_code: "78000",
//             state: "state",
//             permanent_residence: "permanent_residence",
//             temporary_residence: "temporary_residence",
//             works_in: "works_in",
//             bank_account: "1405010016664918",
//             bank_name: "UNICREDIT",
//             type_of_emplyoment: "type_of_emplyoment",
//             working_permit: "working_permit",
//             working_permin_number: "working_permin_number",
//             issuer: "issuer",
//             valid: "valid",
//             tax_relief: "tax_relief",
//             residence_permit: "residence_permit",
//             resident: "resident",
//             salary_type: salaryArr[randSal],
//             gross_salary: 3458.50,
//             salary_base: 500,
//             coefficient_of_complexity: 1.17,
//             stimulation_coefficient: 1.05,
//             net_hourly_rate: 10,
//             gross_hourly_rate: 15,
//             net_salary: 1500,
//             amount_of_personal_deduction: 50,
//             meal_allowances: 6,
//             transportation_fee: 10,
//             profession: professionArr[randCompany],
//             degree_of_education: degreeEducationArr[randCompany],
//             degree_of_expretise: degreeExpretiseArr[randCompany],
//             degree_of_proffesional_qualification: degreeProffesionalQualification[randCompany],
//             disability: "disability",
//             disability_description: "disability_description",
//             cause: "cause",
//             date_of_disability: "2022-03-20T00:00:00.000Z",
//             percentage_of_disability: "percentage_of_disability",
//             description_of_disability: "description_of_disability",
//             condition_on_date: "2022-04-30T00:00:00.000Z",
//             conclusion: "conclusion",
//             date_of_conclusion: "2022-04-29T00:00:00.000Z",
//             start_of_employment: "2022-01-01T00:00:00.000Z",
//             payment_type: 'individual',
//             /*  stimulation: "stimulation",
//               disincentives: "disincentives",
//               inovation: "inovation",
//               other: "other",
//               suggestion_for_promotion: "suggestion_for_promotion",
//               years_in_company: "years_in_company",
//               end_of_employment: "2022-01-30T00:00:00.000Z", */
//             created_by: "BOKA"
//         }).then(async user => {

//             await user.addPlaces_of_expenses(placeOfExpense);

//             await user.addCompanies(companySet);


//             // set superior of org unit to be every 5th user 
//             if (u % 5 == 0) {
//                 await user.addOrganizational_units(companySet.organizational_units[0]);
//             } else if (u == 1) {
//                 await user.addOrganizational_units(companySet.organizational_units[0]);
//             }

//             // members
//             await createSetMembers(user);

//             // booklets
//             await createSetBooklets(user);

//             // suspensions
//             await createSetSuspensions(user);
//         })
//     }

//     const crInstance = await db.cashRegister.create({cash_register_name: "TRING"})

//     const crcInstance = await db.cashRegisterCommand.create({cash_register_command_name: "SPI"})

//     await crInstance.addCash_register_commands(crcInstance)

//     await company.addCash_registers(crInstance)
// }

// // familiy memebers
// async function createSetMembers(user) {

//     const randDateFrom = randomIntFromInterval(0, 4);
//     const randDateTo = randomIntFromInterval(0, 4);
//     const dateFrom = dateFromArr[randDateFrom];
//     const dateTo = dateToArr[randDateTo];
//     const name = nameArr[randDateFrom];
//     const lastName = lastNameArr[randDateTo];
//     const address = addressArr[randDateFrom];
//     const place = locationArr[randDateFrom];

//     await db.familyMembers.create({
//         name: `${name} ${lastName}`,
//         maiden_name: "nema",
//         place_of_birth: place,
//         tax_number: "123123" + randDateFrom,
//         sex: "M",
//         jmbg: "24141411233" + randDateFrom,
//         state: "BIH",
//         insurance_from: dateFrom,
//         insurance_to: dateTo,
//         insurance_number: "4345435" + randDateFrom,
//         tutor: "tutor",
//         realtionship: "SON",
//         residence_address: address,
//         residence: "residence",
//         post_number: "78000",
//         municipality: "municipality",
//         temporary_residence: "temporary_residence",
//         users_id: user.users_id
//     });
// }



// async function createSetBooklets(user) {

//     const todayDate = new Date().toISOString().slice(0, 10);
//     const randId = randomIntFromInterval(0, 2);
//     const randVHC = randomIntFromInterval(0, 2);

//     const book1 = await db.booklets.create({
//         type: "ID",
//         name: user.name,
//         active: "Y",
//         number: numberArr[randId],
//         serial_number: serialNumberArr[randId],
//         issuer: issuerArr[randId],
//         sate_of_issue: leaveDateFromArr[randId],
//         place_of_issue: stateIssuerArr[randId],
//         expiry_date: todayDate,
//         users_id: user.users_id
//     });

//     await db.booklets.create({
//         type: "VEHICLE ID",
//         name: user.name,
//         active: "Y",
//         number: numberArr[randVHC],
//         serial_number: serialNumberArr[randVHC],
//         issuer: issuerArr[randVHC],
//         sate_of_issue: leaveDateFromArr[randVHC],
//         place_of_issue: stateIssuerArr[randVHC],
//         expiry_date: todayDate,
//         users_id: user.users_id
//     });
// }



// // SUSPENSIONS
// async function createSetSuspensions(user) {

//     const randParty = randomIntFromInterval(0, 2);

//     await db.suspensions.create({
//         name: 'Kredit',
//         // the_party: randPartyArr[randParty], 
//         the_party: 'UNICREDIT',
//         suspension_amount: randAmountArr[randParty],
//         the_amount_of_installment: randAmountArr[randParty] / randInstallmentsArr[randParty],
//         suspension_installment_number: 3,
//         suspension_payment_start_date: leaveDateFromArr[randParty],
//         suspension_payment_completion_date: leaveDateToArr[randParty],
//         suspension_payment_invoice: '555-224758-23152',
//         call_number_when_paying: '066833068',
//         the_remaining_number_of_installments: 3,
//         number_of_previous_installments: 0,
//         the_amount_of_installments_previously_paid: 0,
//         the_remaining_amount_of_the_suspension: randAmountArr[randParty],
//         users_id: user.users_id
//     });
// }





// // Popunjavanje fiksnih tabela
// db.insertStaticDate = async () => {
//     await db.articleConfigurator.bulkCreate([
//         { "unit_of_measure": "kg", "inventory_valuation": "Prosjecna cijena", "stock_type": "Zaliha", "book_groups": "DOBRA", "type_of_goods": "Materijal", "type_of_service": "Usluga redovnog odrzavanja", "type_z_t": "ZT Carina", "way_the_article_was_created": "Proizvodni nalog", "origin": "DA", "item_movement_types": "Nabavka", "movement_documents": "Narudzbenica", "supplier_status": "Obveznik PDV-a", "book_group_supplier": "A-Domaći dobavljač obveznik (D-DOM-PDV)", "book_groups_of_buyers": "H-Domaći kupac neobveznik (K-DOM-PDV NE)", "sales_channel": "Web prodaja", "vat_group": "0%", "status_of_the_purchase_order": "otvorena", "type_of_purchase_order": "Poslovna svrha", "purchase_order_line_type": "Konto", "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": "kom", "inventory_valuation": "Planska cijena", "stock_type": "Nije Zaliha", "book_groups": "USLUGE", "type_of_goods": "Proizvod", "type_of_service": "Usluga servisiranja", "type_z_t": "ZT Spedicija", "way_the_article_was_created": "Nalog sastavljanja", "origin": "NE", "item_movement_types": "Proizvodni nalog", "movement_documents": "Proivodni nalog", "supplier_status": "Neobveznik PDV-a", "book_group_supplier": "B-Domaći dobavljači neobveznici (D-DOM-PDV NE)", "book_groups_of_buyers": "I-Domaću kupac neobveznik BD (K-DOM-BD)", "sales_channel": "Maloprodaja", "vat_group": "17%", "status_of_the_purchase_order": "u obradi", "type_of_purchase_order": "Neposlovna svrha", "purchase_order_line_type": "Dobra", "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": "m2", "inventory_valuation": "FIFO", "stock_type": null, "book_groups": "ZT NABAVKA", "type_of_goods": "poluproizvod", "type_of_service": "Usluga podugovaranja", "type_z_t": "ZT prevoz", "way_the_article_was_created": "Narudzbenica", "origin": null, "item_movement_types": "Odobrenje", "movement_documents": "Faktura", "supplier_status": null, "book_group_supplier": "C-Domaći dobavljač neobveznik BD (D-DOM- BD)", "book_groups_of_buyers": "J-Domaći kupaca neobveznik RS (K-DOM-RS)", "sales_channel": "Veleprodaja", "vat_group": null, "status_of_the_purchase_order": "zatvorena", "type_of_purchase_order": "Miks", "purchase_order_line_type": "USLUGA", "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": "m3", "inventory_valuation": "LIFO", "stock_type": null, "book_groups": null, "type_of_goods": "Rezervni dijelovi", "type_of_service": "Usloga farbanja", "type_z_t": "ZT ostalo", "way_the_article_was_created": null, "origin": null, "item_movement_types": "Terecenje", "movement_documents": "Faktura", "supplier_status": null, "book_group_supplier": "D-Domaći dobavljač neobveznik RS (D-DOM-RS)", "book_groups_of_buyers": "K-Inostarni kupac (K-INO)", "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": "otkazana", "type_of_purchase_order": null, "purchase_order_line_type": "ZT NABAVKA", "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": "gr", "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": "Ambalaza", "type_of_service": "Izvor Kontni plan", "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Visak", "movement_documents": "Invertura", "supplier_status": null, "book_group_supplier": "E-Inostrani dobavljač (D-INO)", "book_groups_of_buyers": "L-Inostrani kupac Prfoma (K-INO-PROF)", "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": "poslata dobavljacu", "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": "m", "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": "Sitan invertar", "type_of_service": "Usluga zakupa", "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Manjak", "movement_documents": "Invertura", "supplier_status": null, "book_group_supplier": "F-Inostrani dobavljač proforma (D-INO-PROF)", "book_groups_of_buyers": null, "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": null, "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": null, "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": "Roba", "type_of_service": "Usluga transporta", "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Prenosi-transferi", "movement_documents": "Nalozi kretanja", "supplier_status": null, "book_group_supplier": "G-Domaći kupac (K-DOM-PDV)", "book_groups_of_buyers": null, "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": null, "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": null, "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": "Skart", "type_of_service": null, "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Nalog sastavljanja", "movement_documents": "Nalozi kretanja", "supplier_status": null, "book_group_supplier": "LJ-Inventurni manjak (INT-MANJAK-PDV)", "book_groups_of_buyers": null, "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": null, "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": null, "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": null, "type_of_service": null, "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Prodaja", "movement_documents": "Prodajni nalog", "supplier_status": null, "book_group_supplier": "M-Inventurni manjak kalo (INT-MANJAK-PDV NE)", "book_groups_of_buyers": null, "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": null, "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null },
//         { "unit_of_measure": null, "inventory_valuation": null, "stock_type": null, "book_groups": null, "type_of_goods": null, "type_of_service": null, "type_z_t": null, "way_the_article_was_created": null, "origin": null, "item_movement_types": "Povrat Kupca", "movement_documents": "Odobrenje Kupcu", "supplier_status": null, "book_group_supplier": "N-UIO usklađenje PDV-a (UIO-PDV)", "book_groups_of_buyers": null, "sales_channel": null, "vat_group": null, "status_of_the_purchase_order": null, "type_of_purchase_order": null, "purchase_order_line_type": null, "organizational_units": null, "cost_centers": null, "work_centers": null, "type_of_warehouse": null }

//     ]).then(() => console.log("Configurator have been saved successfully"))


//     await db.config.bulkCreate([
//         { "serial_number": null, "sort_of_maintenance": "Tekuce", "type_of_maintenance": "Redovno", "status": "planiran", "ownership_property": "Vlastito", "valid": "Y" },
//         { "serial_number": null, "sort_of_maintenance": "Investiciono", "type_of_maintenance": "Vanredno", "status": "Otvoren", "ownership_property": "Tudje", "valid": "Y" },
//         { "serial_number": null, "sort_of_maintenance": null, "type_of_maintenance": null, "status": "Zavrsen", "ownership_property": null, "valid": "Y" },
//         { "serial_number": null, "sort_of_maintenance": null, "type_of_maintenance": null, "status": "U toku", "ownership_property": null, "valid": "Y" },
//         { "serial_number": null, "sort_of_maintenance": null, "type_of_maintenance": null, "status": "Knjizen", "ownership_property": null, "valid": "Y" }
//     ]).then(() => console.log("config have been saved successfully"))

//     await db.travelOrdersGroups.bulkCreate([
//         { "name": "group_one", "valid": "Y" },
//         { "name": "group_two", "valid": "Y" },
//         { "name": "group_three", "valid": "Y" },
//         { "name": "group_four", "valid": "Y" },
//         { "name": "group_five", "valid": "Y" },
//         { "name": "group_six", "valid": "Y" },
//         { "name": "group_seven", "valid": "Y" },
//         { "name": "group_eight", "valid": "Y" },

//     ]).then(() => {
//         console.log("travel order group have been saved successfully")
//         db.travelOrdersGroups.findAll({
//             atributes: ["travel_orders_group_id"]
//         }).then((group) => {

//             db.travelOrdersGroupMembers.bulkCreate([
//                 { "name": "BIH", "travel_orders_group_id": group[0].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Bocvana", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Estonija", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kambodža", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "DR Kongo", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Laos", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Lesoto", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Makedonija", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Malezija", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Namibija", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Portoriko", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Somalija", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Tunis", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Venecuela", "travel_orders_group_id": group[1].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Afganistan", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Alžir", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Armenija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Benin", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Bjelorusija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Bolavija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Bugarska", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Burkina Faso", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Burundi", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Crna Gora", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Egipat", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Ekvador", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Gabon", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Gvajana", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Hondures", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Indija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Irak", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Iran", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Jemen", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kipar/Cipar", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kolumbija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kuba", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Latvija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Libanon", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Liberija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Libija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mađarska", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Madagaskar", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Malavi", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mali", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Malta", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Maroko", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mauritanija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Meksiko", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mjanmar", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Nikaragva", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Pakistan", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Panama", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Papua Nova Gvineja", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Paragvaj", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Peru", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Poljska", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Rumunija/Rumunjska", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "El Salvador", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sao Tome i Prinsipe", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sijera Leone", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sirija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sjeverna Koreja", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Srbija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Surinam", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Šri Lanka", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Tanzanija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Uganda", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Zambija", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Zimbabve", "travel_orders_group_id": group[2].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Albanija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Behrein", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Bangladeš", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Centralnoafrička R.", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Češka", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Čile", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Dominikanska Republika", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Džibuti", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Etiopija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Filipini", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Grčka", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Hrvatska", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Indonezija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Jordan", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kamerun", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Katar", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kenija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kostorika", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kuvajt", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Litvanija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mongolija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Niger", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Oman", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Portugal", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Ruanda", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Saudijska Arabija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Slovačka", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Slovenija", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sudan", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Tajland", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Togo", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Trinidad i Tobago", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Turska", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Ukrajina", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Vijetnam", "travel_orders_group_id": group[3].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Argentina", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Australija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Austrija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Belgija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Brazil", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Ekvatorijalna Gvineja", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Finska", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Francuska", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Gana", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Gvineja Bisao", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Haiti", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Italija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kanada", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Mozambik", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Nigerija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Njemačka", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Rusija", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Španija/Španjolska", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Ujedinjeni Arapski Emirati", "travel_orders_group_id": group[4].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Čad", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Irska", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Izrael", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Južna Koreja", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Kina", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Republika Kongo", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Luksemburg", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Nizozemska/Holadnija", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Norveška", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Novi Zeland", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Obala Slonovače", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sjedinjene Američke Države", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Sejšeli", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Singapur", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Švedska", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Tajvan", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Urugvaj", "travel_orders_group_id": group[5].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Angola", "travel_orders_group_id": group[6].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Danska", "travel_orders_group_id": group[6].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Hong Kong", "travel_orders_group_id": group[6].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Velika Britanija i Sjeverna Irska", "travel_orders_group_id": group[6].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Island", "travel_orders_group_id": group[7].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Japan", "travel_orders_group_id": group[7].travel_orders_group_id, "valid": "Y" },
//                 { "name": "Švicarska", "travel_orders_group_id": group[7].travel_orders_group_id, "valid": "Y" }

//             ]).then(() => {
//                 console.log("travel order group member have been saved successfully")
//                 db.travelOrdersConfigurator.bulkCreate([
//                     { "travel_orders_group_id": group[0].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "25", "advance_payment_justification_days": "5", "valid": "Y" },
//                     { "travel_orders_group_id": group[1].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "90", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[2].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "100", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[3].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "110", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[4].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "120", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[5].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "130", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[6].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "140", "advance_payment_justification_days": null, "valid": "Y" },
//                     { "travel_orders_group_id": group[7].travel_orders_group_id, "amount_of_tax_allowable_daily_wage": "90", "advance_payment_justification_days": null, "valid": "Y" }
//                 ]).then(() => console.log("travel order configuration have been saved successfully"))
//             })

//         })
//     })

//     await db.storageConfigurator.bulkCreate([
//         { "storage_number": "SKL1", "storage_name": "Materijal", "storage_movement_types": "Nabavka", "link_document": "Primka", "work_satus": "Aktivno" },
//         { "storage_number": "SKL2", "storage_name": "Rezervni dijelovi", "storage_movement_types": "Prodaja", "link_document": "Otpremnica", "work_satus": "Blokirano" },
//         { "storage_number": "SKL3", "storage_name": "Plin", "storage_movement_types": "Rashodovanje", "link_document": "Interni dokumenti", "work_satus": null },
//         { "storage_number": "SKL4", "storage_name": "Gotovi proizvodi", "storage_movement_types": "Prenos", "link_document": "Prenosnica", "work_satus": null },
//         { "storage_number": "SKL5", "storage_name": "Skart", "storage_movement_types": "Interno", "link_document": "Interna faktura", "work_satus": null },
//         { "storage_number": "SKL6", "storage_name": null, "storage_movement_types": null, "link_document": null, "work_satus": null },
//         { "storage_number": "SKL7", "storage_name": null, "storage_movement_types": null, "link_document": null, "work_satus": null },

//     ]).then(() => console.log("Storage config have been saved successfully"))

//     await db.accountConfigurator.bulkCreate([
//         { "balance_sheet": null, "category": "Imovina", "subcategory": null, "side_bookkeeping": "Duguje", "account_type": "Zbirno", "valid": null },
//         { "balance_sheet": null, "category": "Obaveze", "subcategory": null, "side_bookkeeping": "Potrazuje", "account_type": "Podzbirno", "valid": null },
//         { "balance_sheet": null, "category": "Kapital", "subcategory": null, "side_bookkeeping": "DugPot", "account_type": "Knjizenja", "valid": null },
//         { "balance_sheet": null, "category": "Prihodi", "subcategory": null, "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi za prodato", "subcategory": null, "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi", "subcategory": null, "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Gotovina", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Kupci", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Preplaceni troskovi", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Zalihe", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Oprema", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Ispravke vrijednosti", "subcategory": "Imovina", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Kratkorocne obaveze", "subcategory": "Obaveze", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Dugorocne obaveze", "subcategory": "Obaveze", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Obaveze prema zaposlenim", "subcategory": "Obaveze", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Ostale obaveze", "subcategory": "Obaveze", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Dionice", "subcategory": "Kapital", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Zadrzana zarada", "subcategory": "Kapital", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Kapital", "subcategory": "Kapital", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Prihodi od prodaje", "subcategory": "Prihodi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Prihodi od usluga", "subcategory": "Prihodi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Prihodi od kamate", "subcategory": "Prihodi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi plata proizvodnje", "subcategory": "Troskovi za prodato", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi materijala", "subcategory": "Troskovi za prodato", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi prevoza", "subcategory": "Troskovi za prodato", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Troskovi pakovanja", "subcategory": "Troskovi za prodato", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Rentanje", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Reklama", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Kamata", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Taksa", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Osiguranje", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Plata", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Ostali troskovi", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Odrzavanje", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Putovanje", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//         { "balance_sheet": null, "category": "Vozila", "subcategory": "Troskovi", "side_bookkeeping": null, "account_type": null, "valid": null },
//     ]).then(() => console.log("account config have been saved successfully"))
// }





// // Min and max included 
// function randomIntFromInterval(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min)
// }




module.exports = db;