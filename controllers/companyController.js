const asyncHandler = require('express-async-handler');
const { groups } = require('../config/db');
const db = require('../config/db');
const Companies = db.companies;
const Group = db.groups;
const Function = db.functions;
const Users = db.users;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Op = db.Op;
const { uploadS3 } = require('../utilities/s3');



// Get working hours
const getCompaniesWorkingHours = (req, res) => {
    const companies_id = req.params.companies_id;

    Companies.findOne({
        where: {
            companies_id
        },
        attributes: ["shifts", "working_hours_shift_1", "working_hours_shift_2", "working_hours_shift_3"]
    })
        .then(companie => {
            res.status(200).json(
                companie
            )
        })
        .catch(err => {
            res.status(500);
            throw new Error('Can`t get companies data please try later.')
        })
}


// GET ALL COMPANIES
const getCompanies = (req, res) => {
    Companies.findAll({
        include: [
            {
                model: db.organizationalUnits,
                include: [
                    {
                        model: db.placesOfExpenses
                    }
                ]
            }
        ]
    })
        .then(companies => {
            res.status(200).json(
                companies
            )
        })
        .catch(err => {
            res.status(500);
            throw new Error('Can`t get companies please try later.')
        })
}



// GET COMPANY BY NAME
const getCompanyByName = (req, res) => {
    const name = req.params.name;

    if (!name) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    Companies.findOne({
        where: {
            name
        },
        include: [
            {
                model: db.organizationalUnits,
                include: [
                    {
                        model: db.placesOfExpenses
                    }
                ]
            }
        ]
    })
        .then(company => {
            res.status(200).json({
                company
            }
            )
        })
        .catch(err => {
            res.status(500);
            throw new Error("Can`t get company lease try latter.");
        });
}



// CREATE COMPANY
const createCompany = asyncHandler(async (req, res) => {

    let { name, email, address, location, id_number, tax_number, tax_region, county, municipal_code, zip_code, phone_number, bank_name_1,
        bank_number_1, working_hours, shifts,
        working_hours_shift_1, working_hours_shift_2, working_hours_shift_3, units, records_type, created_by, folder, user_name,
        marriage, paid_holiday, paid_religious_holiday, unpaid_religious_holiday, birth_of_child, care_for_member_of_family,
        family_member_death, voluntary_blood_donation, exam, past_work_type, past_work_percentage,
        contributions_from_salary_pio_rate, contributions_from_salary_health_rate, contributions_from_salary_unemployment_rate, contributions_on_salary_pio_rate,
        contributions_on_salary_health_rate, contributions_on_salary_unemployment_rate, income_tax_rate,
        contributions_for_salary_pio_rate, contributions_for_salary_health_rate, contributions_for_salary_unemployment_rate, contributions_for_child_protection_rate,
        contribution_for_solidarity_rate, activity_code, activity_name, municipality,
        working_hours_shift_1_from, working_hours_shift_1_to, working_hours_shift_2_from, working_hours_shift_2_to, working_hours_shift_3_from, working_hours_shift_3_to,
        injury_at_work, sick_leave, client_id, client_token, api, application_use

    } = req.body;

    if (!name || !address || !location || !id_number || !tax_number || !created_by) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    name = name.toUpperCase();

    let working_hours_str;
    let intHours = Math.floor(working_hours);
    let str = working_hours + '';
    let decimal = str.substring(str.indexOf('.') + 1);

    if (intHours < 10) {
        working_hours_str = `0${intHours}:${decimal}`;
    } else {
        working_hours_str = `${intHours}:${decimal}`;
    }

    const companyExist = await Companies.findAll({
        where: {
            name
        }
    });

    if (companyExist && companyExist.length) {
        res.status(500);
        throw new Error("Company already exist");
    }

    // upload photo Amazon S3
    let result;
    if (req.file && folder && user_name) {
        result = await uploadS3(req.file.buffer, folder, user_name, req.file.originalname);
    }

    let logo;
    if (result) {
        logo = result.Location;
    }




    const company = await Companies.create({
        name, email, address, location, id_number, tax_number, tax_region, county, municipal_code, zip_code, phone_number, bank_name_1,
        bank_number_1, working_hours, working_hours_str, shifts,
        working_hours_shift_1, working_hours_shift_2, working_hours_shift_3, units, logo, records_type, created_by,
        marriage, paid_holiday, paid_religious_holiday, unpaid_religious_holiday, birth_of_child, care_for_member_of_family,
        family_member_death, voluntary_blood_donation, exam, past_work_type, past_work_percentage,
        contributions_from_salary_pio_rate, contributions_from_salary_health_rate, contributions_from_salary_unemployment_rate, contributions_on_salary_pio_rate,
        contributions_on_salary_health_rate, contributions_on_salary_unemployment_rate, income_tax_rate,
        contributions_for_salary_pio_rate, contributions_for_salary_health_rate, contributions_for_salary_unemployment_rate, contributions_for_child_protection_rate,
        contribution_for_solidarity_rate, activity_code, activity_name, municipality,
        working_hours_shift_1_from, working_hours_shift_1_to, working_hours_shift_2_from, working_hours_shift_2_to, working_hours_shift_3_from, working_hours_shift_3_to,
        injury_at_work, sick_leave, client_id, client_token, api, application_use
    });

    // console.log(company)
    const banks = [
        { name: 'PBS', account: '1010000000001687' },
        { name: 'NLB', account: '1327300000000566' },
        { name: 'ASA', account: '1340100000000120' },
        { name: 'SBERBANK', account: '1401010004795616' },
        { name: 'BBI', account: '1410010099999987' },
        { name: 'INTESA', account: '1540010000001910' },
        { name: 'RAIFFEISEN', account: '1610000000000011' },
        { name: 'SPARKASSE', account: '1990000000000023' },
        { name: 'UNICREDIT FBIH', account: '3385502504460645' },
        { name: 'UNICREDIT RS', account: '5510009999999932' },
        { name: 'ADDIKO', account: '3060410000039477' },
        { name: 'ATOS', account: '5671209900000198' },
        { name: 'NOVA', account: '5540017777777756' },
        { name: 'ZIRAAT', account: '1861440320002661' },
        { name: 'PROCREDIT', account: '1941410265304194' },
        { name: 'UNION', account: '1020000000000023' }
    ];

    for (i = 0; i < banks.length; i++) {
        await company.createBank_account({
            name: banks[i].name,
            number: banks[i].account,
            account_type: 'TRANSACTION',
            created_by,
            updated_by: created_by
        })
    }

    // PAYMENT ACCOUNTS
    await db.paymentAccounts.bulkCreate([
        { "name": "Budžet Federacije", "account_number": 1020500000106698, "bank": "UNION", companies_id: company.companies_id },
        { "name": "Budžet Unsko-sanskog kantona", "account_number": 3380002210005877, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Budžet Posavskog kantona", "account_number": 3380002210457121, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Budžet Tuzlanskog kantona", "account_number": 1321000256000080, "bank": "NLB", companies_id: company.companies_id },
        { "name": "Budžet Zeničko-dobojskog kantona", "account_number": 1340100000001672, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Budžet Bosansko-podrinjskog kantona", "account_number": 1327310410293154, "bank": "NLB", companies_id: company.companies_id },
        { "name": "Budžet Srednje-bosanskog kantona", "account_number": 3380002205003005, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Budžet Hercegovačko-neretvanskog kantona", "account_number": 3380002200005953, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Budžet Zapadno-hercegovačkog kantona", "account_number": 3380002200004013, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Budžet Kantona Sarajevo", "account_number": 1411965320008475, "bank": "BBI", companies_id: company.companies_id },
        { "name": "Budžet Kantona 10", "account_number": 1610200033560061, "bank": "RAIFFEISEN", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja i reosiguranja FBiH", "account_number": 1401021110000860, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Unsko-sanskog kantona", "account_number": 3385002275166153, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Posavskog kantona", "account_number": 1610800002640020, "bank": "RAIFFEISEN", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Tuzlanskog kantona", "account_number": 3384402212469166, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Zeničko-dobojskog kantona", "account_number": 1340100000002157, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Bosansko-podrinjskog kantona", "account_number": 1346201008266897, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Srednje-bosanskog kantona", "account_number": 1344811008243153, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Hercegovačko-neretvanskog kantona", "account_number": 5550000004873298, "bank": "NOVA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Zapadno-hercegovačkog kantona", "account_number": 3060030000648268, "bank": "ADDIKO", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Kantona Sarajevo", "account_number": 1549212014617245, "bank": "INTESA", companies_id: company.companies_id },
        { "name": "Zavod zdravstvenog osiguranja Kantona 10", "account_number": 1549212004824610, "bank": "INTESA", companies_id: company.companies_id },
        { "name": "Federalni zavod za zapošljavanje", "account_number": 1610000028570003, "bank": "RAIFFEISEN", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Unsko-sanskog kantona", "account_number": 3380002210012958, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Posavskog kantona", "account_number": 3060420000958697, "bank": "ADDIKO", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Tuzlanskog kantona", "account_number": 1321000311020032, "bank": "NLB", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Zeničko-dobojskog kantona", "account_number": 1340100000107596, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Bosansko-podrinjskog kantona", "account_number": 1011400000463822, "bank": "PBS", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Srednje-bosanskog kantona", "account_number": 3380002210028187, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Hercegovačko-neretvanskog kantona", "account_number": 1610200013800191, "bank": "RAIFFEISEN", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Zapadno-hercegovačkog kantona", "account_number": 3380002200010221, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Kantona Sarajevo", "account_number": 1549212010171056, "bank": "INTESA", companies_id: company.companies_id },
        { "name": "Zavod za zapošljavanje Kantona 10", "account_number": 3380002200034471, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "name": "Fond za profesionalnu rehabilitaciju i zapošljavanje lica sa invaliditetom u Federaciji Bosne i Heregovina", "account_number": 1344701000753837, "bank": "ASA", companies_id: company.companies_id },
        { "name": "Fond za profesionalnu rehabilitaciju i zapošljavanje lica sa invaliditetom u Federaciji Bosne i Heregovina", "account_number": 3386902296358521, "bank": "UNICREDIT", companies_id: company.companies_id },
        { "account_number": 1990550021351975, "name": "Zavod za zapošljavanje Brčko Distrikta", companies_id: company.companies_id },
        { "account_number": 3383702261303269, "name": "Zavod za zdravstveno osiguranje Brčko Distrikta", companies_id: company.companies_id },
        { "account_number": 1401010310000878, "name": "Budžet Brčko Distrikta", companies_id: company.companies_id },
        { "account_number": 1020500000106698, "name": "PIO/MIO FBIH", companies_id: company.companies_id },
        { "account_number": 5620990000055687, "name": "Budžet javnih prihoda RS", companies_id: company.companies_id },
        { "account_number": 5710100000258084, "name": "Fond solidarnosti za dijagnostiku i liječenje", companies_id: company.companies_id },
    ]).then(() => console.log("Payment accounts have been saved"));


    // TYPES OF INCOMES
    await db.typesOfIncome.bulkCreate([
        { "name": "Porez na dohodak od nesamostalne djelatnosti", "type": 716111, "use_in": "PLATA", companies_id: company.companies_id },
        { "name": "Porez na dohodak od drugih samostalnih djelatnosti", "type": 716116, "use_in": "UGOVOR O DJELU", companies_id: company.companies_id },
        { "name": "Opća vodna naknada", "type": 722529, "use_in": "", companies_id: company.companies_id },
        { "name": "Posebna naknada za zaštitu od prirodnih i drugih nesreća gdje je osnovica zbirni iznos neto plaća", "type": 722581, "use_in": "PLATA", companies_id: company.companies_id },
        { "name": "Posebna naknada za zaštitu od prirodnih i drugih nesreća gdje je osnovica zbirni iznos neto primitaka po osnovu druge samostalne djelatnosti i povremenog samostalnog rada", "type": 722582, "use_in": "UGOVOR O DJELU", companies_id: company.companies_id },
        { "name": "Doprinos za penzijsko i invalidsko osiguranje", "type": 712112, "use_in": "PLATA", companies_id: company.companies_id },
        { "name": "Doprinos za penzijsko i invalidsko osiguranje na primitke od druge samostalne djelatnosti i povremenog samostalnog rada", "type": 712126, "use_in": "UGOVOR O DJELU", companies_id: company.companies_id },
        { "name": "Dodatni doprinos za penzijsko i invalidsko osiguranje", "type": 712114, "use_in": "", companies_id: company.companies_id },
        { "name": "Doprinosi za zdravstveno osiguranje", "type": 712111, "use_in": "PLATA", companies_id: company.companies_id },
        { "name": "Doprinosi za zdravstveno osiguranje iz primitaka od druge samostalne djelatnosti i povremenog samostalnog rada", "type": 712116, "use_in": "UGOVOR O DJELU", companies_id: company.companies_id },
        { "name": "Doprinosi za zdravstveno osiguranje poljoprivrednika", "type": 712132, "use_in": "", companies_id: company.companies_id },
        { "name": "Dodatni doprinos za zdravstveno osiguranje", "type": 712115, "use_in": "", companies_id: company.companies_id },
        { "name": "Doprinosi za zdravstveno osiguranje radnika na radu u inostranstvu", "type": 712191, "use_in": "", companies_id: company.companies_id },
        { "name": "Doprinosi za osiguranje od nezaposlenosti", "type": 712113, "use_in": "", companies_id: company.companies_id },
        { "type": 713113, "name": "Porez na dohodak - plaća", companies_id: company.companies_id },
        { "type": 711118, "name": "Porez na dohodak - ugovori o djelu", companies_id: company.companies_id },
        { "type": 712129, "name": "Ostali doprinosi - na ovu šifru prihoda se uplaćuje PIO po osnovu ugovora o djelu, te PIO radnika iz FBIH koji rade u RS-u", companies_id: company.companies_id },
        { "type": 712169, "name": "Doprinosi za dječiju zaštitu koja se obračunava za radnike iz FBIH koji rade u RS-u;", companies_id: company.companies_id },
        { "type": 722569, "name": "Naknada za invalide", companies_id: company.companies_id },
        { "type": 712173, "name": "Doprinos Fonda solidarnosti za dijagnostiku i liječenje oboljele djece", companies_id: company.companies_id },
        { "type": 712113, "name": "Doprinos za nezaposlenost Brčko Distrikt", companies_id: company.companies_id },
        { "type": 712111, "name": "Doprinos za zdravstvo Brčko Distrikt", companies_id: company.companies_id },
        { "type": 713111, "name": "Porez na dohodak Brčko Distrikt", companies_id: company.companies_id },
        { "type": 712199, "name": "Doprinos za PIO - prema RS-u", companies_id: company.companies_id },
        { "type": 712149, "name": "Doprinos za Zdravstvo RS", companies_id: company.companies_id },
        { "type": 712159, "name": "Doprinos za nezaposlenost RS", companies_id: company.companies_id }

    ]).then(() => console.log("Types of income have been saved"));


    // CREATE GRUOPS FUNCTIONS AND ADMIN USER
    const group = await Group.create({
        name: name + '_ADMIN',
        created_by: name
    })

    const functions = await Function.findOne({
        where: {
            name : 'ADMIN',
        }
    });

    group.addFunction(functions);

    const password = '123654';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
  
    await Users.create({
      name : 'ADMIN', user_type: "USER", user_name: `${name}_ADMIN`, email : `${name}_ADMIN@${name}.ba`, password: hashedPassword, groups_id: group.groups_id, active : "Y"
    });



    if (!company) {
        res.status(500);
        throw new Error("Can`t create company please try latter.");
    }

    res.status(201).json({
        name: company.name,
        created_by: company.created_by,
        updated_by: company.updated_by
    });

});




// Update COMPANY
const updateCompany = asyncHandler(async (req, res) => {
    let { name, email, address, location, id_number, companies_id, tax_number, tax_region, county, municipal_code, zip_code, phone_number, working_hours, shifts,
        working_hours_shift_1, working_hours_shift_2, working_hours_shift_3, units, records_type, created_by,
        marriage, paid_holiday, paid_religious_holiday, unpaid_religious_holiday, birth_of_child, care_for_member_of_family,
        family_member_death, voluntary_blood_donation, exam, night_shift, overtime, work_on_holidays, business_trip, sick_leave_over_42_days,
        maternity_leave, pregnancy_leave, strike, standby_time, on_duty, difficult_working_conditions, work_on_weekly_rest_days, past_work_type, past_work_percentage,
        contributions_from_salary_pio_rate, contributions_from_salary_health_rate, contributions_from_salary_unemployment_rate, contributions_on_salary_pio_rate,
        contributions_on_salary_health_rate, contributions_on_salary_unemployment_rate, income_tax_rate,
        contributions_for_salary_pio_rate, contributions_for_salary_health_rate, contributions_for_salary_unemployment_rate, contributions_for_child_protection_rate,
        contribution_for_solidarity_rate, activity_code, activity_name, municipality,
        working_hours_shift_1_from, working_hours_shift_1_to, working_hours_shift_2_from, working_hours_shift_2_to, working_hours_shift_3_from, working_hours_shift_3_to,
        injury_at_work, sick_leave, client_id, client_token, api, application_use
    } = req.body;



    if (!companies_id) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    if (name) {
        name = name.toUpperCase();
    }

    let working_hours_str;
    if (working_hours) {
        let intHours = Math.floor(working_hours);
        let str = working_hours + '';
        let decimal = str.substring(str.indexOf('.') + 1);

        if (intHours < 10) {
            working_hours_str = `0${intHours}:${decimal}`;
        } else {
            working_hours_str = `${intHours}:${decimal}`;
        }
    }

    const company = await Companies.update(
        {
            name, email, address, location, id_number, tax_number, tax_region, county, municipal_code, zip_code, phone_number, working_hours, working_hours_str, shifts,
            working_hours_shift_1, working_hours_shift_2, working_hours_shift_3, units, records_type, created_by,
            marriage, paid_holiday, paid_religious_holiday, unpaid_religious_holiday, birth_of_child, care_for_member_of_family,
            family_member_death, voluntary_blood_donation, exam, night_shift, overtime, work_on_holidays, business_trip, sick_leave_over_42_days,
            maternity_leave, pregnancy_leave, strike, standby_time, on_duty, difficult_working_conditions, work_on_weekly_rest_days, past_work_type, past_work_percentage,
            contributions_from_salary_pio_rate, contributions_from_salary_health_rate, contributions_from_salary_unemployment_rate, contributions_on_salary_pio_rate,
            contributions_on_salary_health_rate, contributions_on_salary_unemployment_rate, income_tax_rate,
            contributions_for_salary_pio_rate, contributions_for_salary_health_rate, contributions_for_salary_unemployment_rate, contributions_for_child_protection_rate,
            contribution_for_solidarity_rate, activity_code, activity_name, municipality,
            working_hours_shift_1_from, working_hours_shift_1_to, working_hours_shift_2_from, working_hours_shift_2_to, working_hours_shift_3_from, working_hours_shift_3_to,
            injury_at_work, sick_leave, client_id, client_token, api, application_use
        },
        {
            where: {
                companies_id
            }
        }
    );

    if (!company) {
        res.status(500);
        throw new Error("Can`t update company please try latter.");
    }

    res.status(201).json({ message: "Company updated" });

});


// DELETE COMPANY
const removeCompany = asyncHandler(async (req, res) => {
    const companies_id = req.params.companies_id;


    if (!companies_id) {
        res.status(400);
        throw new Error("Please add all fields");
    }

    const company = await Companies.destroy({
        where: {
            companies_id
        }
    });

    if (!company) {
        res.status(400);
        throw new Error("Company does not exist");
    }

    res.status(200).json({ message: 'Company removed' });

});


module.exports = { getCompanies, getCompanyByName, getCompaniesWorkingHours, createCompany, updateCompany, removeCompany };