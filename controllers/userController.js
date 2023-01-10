const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const db = require("../config/db");
const { uploadS3 } = require("../utilities/s3");
const Users = db.users;
const UsersArchives = db.usersArchives;
const Functions = db.functions;
const Companies = db.companies;
const Groups = db.groups;
const FamilyMembers = db.familyMembers;
const Booklets = db.booklets;
const PlacesOfExpenses = db.placesOfExpenses;
const OrganizationalUnits = db.organizationalUnits;
const Suspensions = db.suspensions;
const Op = db.Op;
const UserLogs = db.userLogs;
const SuspensionLogs = db.suspensionLogs;



const sql = require("mysql2");

const WORKERS_JOIN = {
  model: PlacesOfExpenses,
  attributes: ['name'],
  through: { attributes: [] },
  required: true,
  include: [
    {
      model: OrganizationalUnits,
      attributes: ['name'],
      required: true,
      include: [
        {
          model: Companies,
          attributes: ['name'],
          required: true
        }
      ]
    },

  ]
}

/*
    @desc    Get me 
    @route   GET /api/users/me
    @access  Private
*/
const getUsersWithData = asyncHandler(async (req, res) => {
  const users_id = req.params.users_id;

  Users.findByPk(users_id, {
    include: [
      {
        model: FamilyMembers,
      },
      {
        model: Booklets,
      },
      {
        model: Suspensions,
      },
      {
        model: PlacesOfExpenses,
        attributes: ['places_of_expenses_id', 'name'],
        through: { attributes: [] },
        required: true,
        include: [
          {
            model: OrganizationalUnits,
            attributes: ['organizational_units_id', 'name'],
            required: true,
            include: [
              {
                model: Companies,
                attributes: ['name'],
                required: true
              }
            ]
          },
        ]
      }
    ],
  })
    .then((users) => {
      res.status(200).json({
        data: users,
      });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t get user data please try latter");
    });
});

/*
    @desc    Get all users
    @route   GET /api/users
    @access  Private
*/
const getUsersByCompany = asyncHandler(async (req, res) => {
  const company = req.params.company;
  //const offset = parseInt(req.params.offset);

  Users.findAll({
    include: [
      {
        model: db.companies,
        where: {
          name: company,
        },
        attributes: [],
        through: { attributes: [] },
      },
      {
        model: db.groups,
        attributes: ["name"],
      },
    ],
    //offset,
    //limit: 10,
    attributes: ["users_id", "name", "email", "jmbg", "created_at", "updated_at"],
  })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t get users please try latter");
    });
});




/**** INSERT USER ****/

const createUserAndUserData = asyncHandler(async (req, res) => {
  const { main, family, booklets, suspensions } = req.body.data;


  // Main data
  const { users_id, message } = await addUsersMain(main);

  if (message) {
    res.status(400);
    throw new Error(message);
  }

  // Family
  const familyMessage = await addUsersFamily(users_id, family);

  if (familyMessage) {
    res.status(400);
    throw new Error(familyMessage);
  }

  // Booklets
  const bookletMessage = await addUsersBooklets(users_id, booklets);

  if (bookletMessage) {
    res.status(400);
    throw new Error(bookletMessage);
  }

  // Suspenions
  const suspensionsMessage = await addUsersSuspensions(users_id, suspensions, main.created_by);

  if (suspensionsMessage) {
    res.status(400);
    throw new Error(suspensionsMessage);
  }

  res.status(200).json({
    message: "User created",
  });
});



/**** UPDATE USER ****/

const updateUser = asyncHandler(async (req, res) => {
  const { main, family, booklets, suspensions } = req.body;

  const users_id = updateMainUser(main);

  if (!users_id || users_id == "Can`t update user main") {
    res.status(500);
    throw new Error("Can`t update user please try latter");
  }

  const familyMessage = updateUsersFamily(family);

  if (!familyMessage) {
    res.status(500);
    throw new Error("Can`t update user family try latter");
  }

  const bookletsMessage = updateUsersBooklets(booklets);

  if (!bookletsMessage) {
    res.status(500);
    throw new Error("Can`t update user booklets try latter");
  }


  const suspensionsMessage = updateUsersSuspensions(suspensions, main.updated_by);

  if (!suspensionsMessage) {
    res.status(500);
    throw new Error("Can`t update user suspensions try latter");
  }

  res.status(201).json({ message: "User and users data updated" });
});

/*
    @desc    Get me 
    @route   GET /api/users/me
    @access  Private
*/
const getMe = asyncHandler(async (req, res) => {
  const { users_id, user_name, email } = req.user;

  Users.findOne({
    where: {
      email,
    },
    include: [
      {
        model: PlacesOfExpenses,
        attributes: ['name'],
        through: { attributes: [] },
        required: false,
        include: [
          {
            model: OrganizationalUnits,
            attributes: ['name'],
            required: false,
            include: [
              {
                model: Companies,
                attributes: ['name'],
                required: true
              }
            ]
          },

        ]
      }
    ],
  })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t get user data please try latter");
    });
});

/*
    @desc    Get all users
    @route   GET /api/users
    @access  Private
*/
const getUsers = asyncHandler(async (req, res) => {
  Users.findAll({
    include: [
      {
        model: db.companies,
      },
    ],
  })
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t get users please try latter");
    });
});



/*
    @desc    Login user
    @route   POST /api/users/login
    @access  Public
*/
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add all fields");
  }

  const user = await Users.findOne({
    where: {
      [Op.or]: [{ email }, { user_name: email }],
    },
    include: [
      {
        model: Groups,
      },
      {
        model: Companies,
        attributes: ["companies_id", "name"],
        through: { attributes: [] },
      },
      {
        model: PlacesOfExpenses,
        attributes: ["places_of_expenses_id", "name"],
        through: { attributes: [] },
        // required: true,
        include: [
          {
            model: OrganizationalUnits,
            attributes: ["organizational_units_id", "name", "companies_id"],
            // required: true
          },
        ],
      },
    ],
  });

  if (!user) {
    res.status(404);
    throw new Error("Wrong credentials");
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (matchPassword) {
    let authorities = [];

    const group_functions = await Groups.findByPk(user.groups_id, {
      include: [
        {
          model: Functions,
        },
      ],
    });

    if (!group_functions && group_functions.length <= 0) {
      res.status(400);
      throw new Error("Group functions does not exist");
    }

    group_functions.functions.forEach((element) => {
      authorities.push(element.dataValues.name);
    });

    res.status(200).json({
      users_id: user.users_id,
      name: user.name,
      user_name: user.user_name,
      email: user.email,
      token: generateToken(user.users_id),
      functions: authorities,
      companies: user.companies,
      placeOfExpense: user.places_of_expenses,
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});

/*
    @desc    Change user password
    @route   GET /api/users/password
    @access  Private
*/
const changePassword = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    res.status(400);
    throw new Error("Please add all parameters");
  }

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user) {
    res.status(400);
    throw new Error("Can`t find user at this time");
  }

  const matchPassword = await bcrypt.compare(oldPassword, user.password);

  if (matchPassword) {
    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const newUser = await Users.update(
      { password: hashedPassword },
      {
        where: { email },
      }
    );

    if (!newUser) {
      res.status(400);
      throw new Error("Can`t update pasword");
    }

    res.status(200).json({
      message: "Password updated",
    });
  } else {
    res.status(400);
    throw new Error("Wrong credentials");
  }
});



// Upload profile picture

const uploadProfileImage = asyncHandler(async (req, res) => {
  const { email } = req.user;
  const { user_name, folder } = req.body;

  // Upload photo
  const result = await uploadS3(req.file.buffer, folder, user_name, req.file.originalname);

  const newUser = await Users.update(
    { photo: result.Location },
    {
      where: { email },
    }
  );

  if (!newUser) {
    res.status(400);
    throw new Error("Can`t update profile");
  }

  res.status(200).json({
    message: "Profile updated",
  });
});

//Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

/***************************** ADD USER AND DATA  *****************************/

// Add user main data
const addUsersMain = asyncHandler(async (main) => {
  let message;
  let users_id;

  const {
    name, user_name, email, password, groups_id, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name,
    parents_name, tax_region, county, tax_number, citizenship,
    marital_status, date_of_birth, municipality_of_birth,
    place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name,
    type_of_emplyoment, working_permit, working_permin_number, working_permit_from, working_permit_to,
    issuer, valid, tax_relief, residence_permit, resident, residence_permit_from, residence_permit_to, payment_type,
    salary_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
    net_salary, gross_salary, meal_allowances, meal_allowances_natural, meal_allowances_taxable,
    transportation_fee, transportation_type, transportation_fee_natural, amount_of_personal_deduction,
    years_of_service, months_of_service, days_of_service, cell_phone_use,
    car_use, profession, degree_of_education, degree_of_expretise,
    degree_of_proffesional_qualification, disability, disability_description,
    cause, date_of_disability, percentage_of_disability, description_of_disability,
    condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract,
    /* stimulation,
    disincentives, inovation, other, suggestion_for_promotion, years_in_company, start_of_employment,
    end_of_employment,*/ places_of_expenses_id, individual_party, rfid_card_number,
    created_by, internal_suspension
  } = main;

  let companies_name = main.companies_name;

  // Check if user exist
  const userExist = await Users.findOne({
    where: {
      [Op.or]: [{ email }, { user_name }],
    },
  });

  if (userExist) {
    message = "User with that email or username already exist";
    return { users_id, message };
  }

  // Check if company exist
  companies_name = companies_name.toUpperCase();
  const company = await Companies.findOne({
    where: {
      name: companies_name,
    },
  });

  if (!company) {
    message = "There is no company with that name";
    return { users_id, message };
  }


  if (!name || !user_name || !email || !password || !groups_id || !jmbg || !tax_region || !municipal_code || !bank_account || !bank_name || !type_of_emplyoment || !payment_type
    || !date_of_birth || !municipality_of_birth || !place_of_birth || !zip_code || !state || !gender || !tax_number || !citizenship) {
    message = "Please input all required fields";
    return { users_id, message };
  }


  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await Users.create({
    name, user_name, email, password: hashedPassword, groups_id, active,
    jmbg, phone_number, identification_number, gender, address, maiden_name, parents_name,
    tax_region, county, tax_number, citizenship, marital_status, date_of_birth,
    municipality_of_birth, place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name, type_of_emplyoment,
    working_permit, working_permin_number, working_permit_from, working_permit_to, issuer, valid, tax_relief,
    residence_permit, residence_permit_from, residence_permit_to, resident, salary_type, payment_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate, net_salary,
    gross_salary, meal_allowances, meal_allowances_natural, meal_allowances_taxable, transportation_fee, transportation_type,
    transportation_fee_natural, amount_of_personal_deduction, years_of_service,
    months_of_service, days_of_service, cell_phone_use, car_use, profession,
    degree_of_education, degree_of_expretise, degree_of_proffesional_qualification,
    disability, disability_description, cause, date_of_disability, percentage_of_disability,
    description_of_disability, condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, individual_party, rfid_card_number,
    /* stimulation,
    disincentives, inovation, other, suggestion_for_promotion, years_in_company, start_of_employment,
    end_of_employment,*/ created_by, internal_suspension
  });

  if (!user) {
    message = "Can`t add user please try latter";
    return { users_id, message };
  }



  const userLogs = await UserLogs.create({
    name, user_name, email, groups_id, active,
    jmbg, phone_number, identification_number, gender, address, maiden_name, parents_name,
    tax_region, county, tax_number, citizenship, marital_status, date_of_birth,
    municipality_of_birth, place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name, type_of_emplyoment,
    working_permit, working_permin_number, working_permit_from, working_permit_to, issuer, valid, tax_relief,
    residence_permit, residence_permit_from, residence_permit_to, resident, salary_type, payment_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate, net_salary,
    gross_salary, meal_allowances, meal_allowances_natural, meal_allowances_taxable, transportation_fee, transportation_type,
    transportation_fee_natural, amount_of_personal_deduction, years_of_service,
    months_of_service, days_of_service, cell_phone_use, car_use, profession,
    degree_of_education, degree_of_expretise, degree_of_proffesional_qualification,
    disability, disability_description, cause, date_of_disability, percentage_of_disability,
    description_of_disability, condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, individual_party, rfid_card_number,
    updated_by: created_by, internal_suspension, users_id: user.users_id
  });

  // Set company for user
  await user.addCompanies(company).catch((err) => {
    message = "Can`t add company to user please try latter";
    return { users_id, message };
  });

  // Set places of expense
  const placeOfExpense = await db.placesOfExpenses.findByPk(places_of_expenses_id);
  await user.addPlaces_of_expenses(placeOfExpense);

  users_id = user.users_id;

  return { users_id, message };
});

// Add users family memebers
const addUsersFamily = asyncHandler(async (users_id, familyArr) => {
  let familyMessage;

  if (!users_id) {
    familyMessage = "Can`t add family member please try latter";
    return familyMessage;
  }

  familyArr.forEach(async (family) => {
    const newFamilyMember = await FamilyMembers.create({
      users_id,
      name: family.name,
      maiden_name: family.maiden_name,
      place_of_birth: family.place_of_birth,
      tax_number: family.tax_number,
      sex: family.sex,
      jmbg: family.jmbg,
      state: family.state,
      insurance_from: family.insurance_from,
      insurance_to: family.insurance_to,
      insurance_number: family.insurance_number,
      tutor: family.tutor,
      realtionship: family.realtionship,
      residence_address: family.residence_address,
      post_number: family.post_number,
      municipality: family.municipality,
      temporary_residence: family.temporary_residence,
    });

    if (!newFamilyMember) {
      familyMessage = "Can`t add family member please try latter";
      return familyMessage;
    }
  }
  );
});

// Add users booklets
const addUsersBooklets = asyncHandler(async (users_id, bookletsArr) => {
  let bookletMessage;

  if (!users_id) {
    bookletMessage = "Can`t add booklet please try latter";
    return bookletMessage;
  }

  bookletsArr.forEach(async (booklet) => {
    const newBooklet = await Booklets.create({
      users_id,
      type: booklet.type,
      name: booklet.name,
      active: booklet.active,
      number: booklet.number,
      serial_number: booklet.serial_number,
      issuer: booklet.issuer,
      sate_of_issue: booklet.sate_of_issue,
      place_of_issue: booklet.place_of_issue,
      expiry_date: booklet.expiry_date,
    });

    if (!newBooklet) {
      bookletMessage = "Can`t add booklet please try latter";
      return bookletMessage;
    }
  }
  );
});

const addUsersSuspensions = asyncHandler(async (users_id, suspensionsArr, created_by) => {
  let suspensionsMessage;

  if (!users_id) {
    suspensionsMessage = "Can`t add suspensions please try latter";
    return suspensionsMessage;
  }

  suspensionsArr.forEach(async (suspension) => {
    const newSuspension = await Suspensions.create({
      users_id,
      name: suspension.name,
      the_party: suspension.the_party,
      suspension_amount: suspension.suspension_amount,
      the_amount_of_installment: suspension.the_amount_of_installment,
      suspension_installment_number: suspension.suspension_installment_number,
      suspension_payment_start_date: suspension.suspension_payment_start_date,
      suspension_payment_completion_date: suspension.suspension_payment_completion_date,
      number_of_previous_installments: suspension.suspension_payment_start_date,
      the_amount_of_installments_previously_paid: suspension.the_amount_of_installments_previously_paid,
      the_remaining_amount_of_the_suspension: suspension.the_remaining_amount_of_the_suspension,
      the_remaining_number_of_installments: suspension.the_remaining_number_of_installments,
      suspension_payment_invoice: suspension.suspension_payment_invoice,
      call_number_when_paying: suspension.call_number_when_paying, created_by
    });

    if (!newSuspension) {
      suspensionsMessage = "Can`t add suspensions please try latter";
      return suspensionsMessage;
    }

    await SuspensionLogs.create({
      users_id,
      name: suspension.name,
      the_party: suspension.the_party,
      suspension_amount: suspension.suspension_amount,
      the_amount_of_installment: suspension.the_amount_of_installment,
      suspension_installment_number: suspension.suspension_installment_number,
      suspension_payment_start_date: suspension.suspension_payment_start_date,
      suspension_payment_completion_date: suspension.suspension_payment_completion_date,
      number_of_previous_installments: suspension.suspension_payment_start_date,
      the_amount_of_installments_previously_paid: suspension.the_amount_of_installments_previously_paid,
      the_remaining_amount_of_the_suspension: suspension.the_remaining_amount_of_the_suspension,
      the_remaining_number_of_installments: suspension.the_remaining_number_of_installments,
      suspension_payment_invoice: suspension.suspension_payment_invoice,
      call_number_when_paying: suspension.call_number_when_paying, suspensions_id: newSuspension.suspensions_id, created_by
    });


  }
  );
});






/********************* ADD USER SINGLE DATA *********************/


// Add users family memebers
const addUsersFamilySingle = asyncHandler(async (req, res) => {
  const { users_id, name, maiden_name, place_of_birth, tax_number, sex, jmbg,
    state, insurance_from, insurance_to, insurance_number, tutor, realtionship,
    residence_address, post_number, municipality, temporary_residence } = req.body;

  if (!users_id) {
    res.status(400);
    throw new Error("Please add all parameters");
  }


  const newFamilyMember = await FamilyMembers.create({
    users_id, name, maiden_name, place_of_birth, tax_number, sex, jmbg,
    state, insurance_from, insurance_to, insurance_number, tutor, realtionship,
    residence_address, post_number, municipality, temporary_residence
  });

  if (!newFamilyMember) {
    res.status(500);
    throw new Error("Can`t add family member please try latter");
  }

  res.status(200).json(newFamilyMember);

});

// Add users booklets
const addUsersBookletsSingle = asyncHandler(async (req, res) => {
  const { users_id, type, name, active, number, serial_number,
    issuer, sate_of_issue, place_of_issue, expiry_date } = req.body;

  if (!users_id) {
    res.status(400);
    throw new Error("Please add all parameters");
  }

  const newBooklet = await Booklets.create({
    users_id, type, name, active, number, serial_number,
    issuer, sate_of_issue, place_of_issue, expiry_date
  });

  if (!newBooklet) {
    res.status(500);
    throw new Error("Can`t add booklet please try latter");
  }

  res.status(200).json(newBooklet);
});

const addUsersSuspensionsSingle = asyncHandler(async (req, res) => {

  const { users_id, name, the_party, suspension_amount, the_amount_of_installment, suspension_installment_number,
    suspension_payment_start_date, suspension_payment_completion_date, number_of_previous_installments,
    the_amount_of_installments_previously_paid, the_remaining_amount_of_the_suspension,
    the_remaining_number_of_installments, suspension_payment_invoice, call_number_when_paying, created_by  } = req.body;

  if (!users_id) {
    res.status(400);
    throw new Error("Please add all parameters");
  }


  const newSuspension = await Suspensions.create({
    users_id, name, the_party, suspension_amount, the_amount_of_installment, suspension_installment_number,
    suspension_payment_start_date, suspension_payment_completion_date, number_of_previous_installments,
    the_amount_of_installments_previously_paid, the_remaining_amount_of_the_suspension,
    the_remaining_number_of_installments, suspension_payment_invoice, call_number_when_paying, created_by 
  });

  if (!newSuspension) {
    res.status(500);
    throw new Error("Can`t add suspensions please try latter");
  }


  await SuspensionLogs.create({
    users_id, name, the_party, suspension_amount, the_amount_of_installment, suspension_installment_number,
    suspension_payment_start_date, suspension_payment_completion_date, number_of_previous_installments,
    the_amount_of_installments_previously_paid, the_remaining_amount_of_the_suspension,
    the_remaining_number_of_installments, suspension_payment_invoice, call_number_when_paying, suspensions_id: newSuspension.suspensions_id, created_by 
  });

  res.status(200).json(newSuspension);
});



/********************* ADD USER SINGLE DATA *********************/









/********************* UPDATE USER **************************/

const updateMainUser = asyncHandler(async (main) => {
  const {
    name, user_name, email, groups_id, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name, parents_name,
    tax_region, county, tax_number, citizenship, marital_status, date_of_birth,
    municipality_of_birth, place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name, type_of_emplyoment,
    working_permit, working_permin_number, working_permit_from, working_permit_to, issuer, valid, tax_relief, residence_permit, residence_permit_from, residence_permit_to,
    resident, salary_type, payment_type, salary_base, coefficient_of_complexity, stimulation_coefficient,
    net_hourly_rate, gross_hourly_rate, net_salary, gross_salary, meal_allowances,
    meal_allowances_natural, meal_allowances_taxable, transportation_fee, transportation_type, transportation_fee_natural,
    amount_of_personal_deduction, years_of_service, months_of_service, days_of_service,
    cell_phone_use, car_use, disability, disability_description, cause,
    date_of_disability, percentage_of_disability, description_of_disability, condition_on_date,
    conclusion, date_of_conclusion, profession, degree_of_education, degree_of_expretise, degree_of_proffesional_qualification,
    updated_by, companies_id, places_of_expenses_id, start_of_employment, end_of_employment_contract, individual_party, rfid_card_number, internal_suspension
  } = main;

  if (!email) {
    return "Can`t update user main";
  }

  let newUser;
  try {

    newUser = await Users.update(
      {
        name, user_name, email, groups_id, active, jmbg, phone_number,
        identification_number, gender, address, maiden_name, parents_name, tax_region, county,
        tax_number, citizenship, marital_status, date_of_birth, municipality_of_birth,
        place_of_birth, zip_code, municipal_code, state, permanent_residence, temporary_residence,
        works_in, bank_account, bank_name, type_of_emplyoment, working_permit,
        working_permin_number, working_permit_from, working_permit_to, issuer, valid, tax_relief, residence_permit, residence_permit_from, residence_permit_to,
        resident, salary_type, payment_type, salary_base, coefficient_of_complexity,
        stimulation_coefficient, net_hourly_rate, gross_hourly_rate, net_salary,
        gross_salary, meal_allowances, meal_allowances_natural, meal_allowances_taxable, transportation_fee, transportation_type,
        transportation_fee_natural, amount_of_personal_deduction, years_of_service,
        months_of_service, days_of_service, cell_phone_use, car_use, disability,
        disability_description, cause, date_of_disability, percentage_of_disability,
        description_of_disability, condition_on_date, conclusion,
        date_of_conclusion, profession, degree_of_education, degree_of_expretise, degree_of_proffesional_qualification, updated_by, start_of_employment, end_of_employment_contract,
        individual_party, rfid_card_number, internal_suspension
      },
      {
        where: { email },
      }
    );



    // Set places of expense
    if (places_of_expenses_id) {
      // newUser.removePlaces_of_expenses()

      const user = await Users.findOne({
        attributes: ['users_id'],
        where: {
          email,
          // [Op.and]: [
          //   { '$places_of_expenses.organizational_unit.company.companies_id$': companies_id }
          // ]
        },
        include: [
          {
            model: PlacesOfExpenses,
            attributes: ['places_of_expenses_id'],
            through: { attributes: [] },
            include: [
              {
                model: OrganizationalUnits,
                attributes: [],
                include: [
                  {
                    model: Companies,
                    attributes: []
                  }
                ]
              },

            ]
          }
        ]
      });

      let users = (user).toJSON();

      if (users.places_of_expenses[0].places_of_expenses_id) {
        await user.removePlaces_of_expenses(users.places_of_expenses[0].places_of_expenses_id);
        await user.addPlaces_of_expenses(places_of_expenses_id);
      }
    }

  } catch (err) {
    return "Can`t update user main";
  }

  if (newUser || newUser.length > 0) {


    const user = await Users.findOne({
      attributes: ['users_id'],
      where: {
        email
      }
    });

    const userLogs = await UserLogs.create({
      name, user_name, email, groups_id, active, jmbg, phone_number,
      identification_number, gender, address, maiden_name, parents_name, tax_region, county,
      tax_number, citizenship, marital_status, date_of_birth, municipality_of_birth,
      place_of_birth, zip_code, municipal_code, state, permanent_residence, temporary_residence,
      works_in, bank_account, bank_name, type_of_emplyoment, working_permit,
      working_permin_number, working_permit_from, working_permit_to, issuer, valid, tax_relief, residence_permit, residence_permit_from, residence_permit_to,
      resident, salary_type, payment_type, salary_base, coefficient_of_complexity,
      stimulation_coefficient, net_hourly_rate, gross_hourly_rate, net_salary,
      gross_salary, meal_allowances, meal_allowances_natural, meal_allowances_taxable, transportation_fee, transportation_type,
      transportation_fee_natural, amount_of_personal_deduction, years_of_service,
      months_of_service, days_of_service, cell_phone_use, car_use, disability,
      disability_description, cause, date_of_disability, percentage_of_disability,
      description_of_disability, condition_on_date, conclusion,
      date_of_conclusion, profession, degree_of_education, degree_of_expretise, degree_of_proffesional_qualification, updated_by, start_of_employment, end_of_employment_contract,
      individual_party, rfid_card_number, internal_suspension, users_id: user.users_id
    });

    return user.users_id;
  } else {
    return "Can`t update user main";
  }
});

// Update users family memebers
const updateUsersFamily = asyncHandler(async (familyArr) => {

  if (familyArr && familyArr.length > 0) {
    familyArr.forEach(async (family) => {
      try {

        const newFamilyMember = await FamilyMembers.update(
          {
            name: family.name,
            maiden_name: family.maiden_name,
            place_of_birth: family.place_of_birth,
            tax_number: family.tax_number,
            sex: family.sex,
            jmbg: family.jmbg,
            state: family.state,
            insurance_from: family.insurance_from,
            insurance_to: family.insurance_to,
            insurance_number: family.insurance_number,
            tutor: family.tutor,
            realtionship: family.realtionship,
            residence_address: family.residence_address,
            post_number: family.post_number,
            municipality: family.municipality,
            temporary_residence: family.temporary_residence,
          },
          {
            where: {
              family_members_id: family.family_members_id,
            },
          }
        );
      } catch (err) {
        return "Can`t update family member please try latter";

      }

    }
    );
  }
});

// Update users booklets
const updateUsersBooklets = asyncHandler(async (bookletsArr) => {
  if (bookletsArr && bookletsArr.length > 0) {
    bookletsArr.forEach(async (booklet) => {
      try {
        const newBooklet = await Booklets.update(
          {
            type: booklet.type,
            name: booklet.name,
            active: booklet.active,
            number: booklet.number,
            serial_number: booklet.serial_number,
            issuer: booklet.issuer,
            sate_of_issue: booklet.sate_of_issue,
            place_of_issue: booklet.place_of_issue,
            expiry_date: booklet.expiry_date,
          },
          {
            where: {
              booklets_id: booklet.booklets_id,
            },
          }
        );
      } catch (err) {
        return "Can`t update booklet please try latter";

      }
    }
    );
  }
});


// Update users suspensions 
const updateUsersSuspensions = asyncHandler(async (suspensionsArr, updated_by) => {
  if (suspensionsArr && suspensionsArr.length > 0) {
    suspensionsArr.forEach(async (suspension) => {

      let newSuspension;
      try {
        newSuspension = await Suspensions.update(
          {
            name: suspension.name,
            the_party: suspension.the_party,
            suspension_amount: suspension.suspension_amount,
            the_amount_of_installment: suspension.the_amount_of_installment,
            suspension_installment_number: suspension.suspension_installment_number,
            suspension_payment_start_date: suspension.suspension_payment_start_date,
            suspension_payment_completion_date: suspension.suspension_payment_completion_date,
            number_of_previous_installments: suspension.number_of_previous_installments,
            the_amount_of_installments_previously_paid: suspension.the_amount_of_installments_previously_paid,
            the_remaining_amount_of_the_suspension: suspension.the_remaining_amount_of_the_suspension,
            the_remaining_number_of_installments: suspension.the_remaining_number_of_installments,
            suspension_payment_invoice: suspension.suspension_payment_invoice,
            call_number_when_paying: suspension.call_number_when_paying, updated_by
          },
          {
            where: {
              suspensions_id: suspension.suspensions_id,
            },
          }
        );

        await SuspensionLogs.create({
          name: suspension.name,
          the_party: suspension.the_party,
          suspension_amount: suspension.suspension_amount,
          the_amount_of_installment: suspension.the_amount_of_installment,
          suspension_installment_number: suspension.suspension_installment_number,
          suspension_payment_start_date: suspension.suspension_payment_start_date,
          suspension_payment_completion_date: suspension.suspension_payment_completion_date,
          number_of_previous_installments: suspension.number_of_previous_installments,
          the_amount_of_installments_previously_paid: suspension.the_amount_of_installments_previously_paid,
          the_remaining_amount_of_the_suspension: suspension.the_remaining_amount_of_the_suspension,
          the_remaining_number_of_installments: suspension.the_remaining_number_of_installments,
          suspension_payment_invoice: suspension.suspension_payment_invoice,
          call_number_when_paying: suspension.call_number_when_paying, suspensions_id: suspension.suspensions_id, updated_by, users_id: suspension.users_id
        });

      } catch (err) {
        return "Can`t update suspension please try latter";
      }
    }
    );
  }
});

// Get users data
const getUsersFamilyAndBooklets = asyncHandler(async (req, res) => {
  const email = req.params.email;

  const userData = await Users.findOne({
    where: { email },
    include: [
      {
        model: FamilyMembers,
      },
      {
        model: Booklets,
      },
    ],
  });

  if (!userData) {
    res.status(500);
    throw new Error("Can`t get user data please try latter");
  }

  res.status(200).json({
    userData,
  });
});





const test = asyncHandler(async (req, res) => {
  const email = 'mail1@gmail.com';
  const companies_id = 2;
  /*
    const user = await Users.findOne({
      order: [['users_id', 'DESC']]
    })
    console.log(user)
  
    res.status(200).send(user) */

  /*
const connection = sql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
});

const user_name = "USER1";
const querString = "SELECT * FROM financial.users WHERE (user_name LIKE ? OR ? IS NULL);";
console.log(querString);
connection.query(querString, ["%" + user_name + "%", user_name], function (err, results) {
  res.status(200).send(results);
});
*/

  const user = await Users.findOne({
    attributes: ['users_id'],
    where: {
      email,
      [Op.and]: [
        { '$places_of_expenses.organizational_unit.company.companies_id$': companies_id }
      ]
    },
    include: [
      {
        model: PlacesOfExpenses,
        attributes: ['places_of_expenses_id'],
        through: { attributes: [] },
        include: [
          {
            model: OrganizationalUnits,
            attributes: [],
            include: [
              {
                model: Companies,
                attributes: []
              }
            ]
          },

        ]
      }
    ]
  });

  let users = (user).toJSON();

  await user.removePlaces_of_expenses(users.places_of_expenses[0].places_of_expenses_id);

  res.json(user)
});



const getUsersByCompanySpecData = asyncHandler(async (req, res) => {

  const companies_id = req.params.companies_id;

  const users = await Users.findAll({
    attributes: ['users_id', 'name', 'permanent_residence', 'date_of_birth'],
    where: {
      [Op.and]: [
        { '$places_of_expenses.organizational_unit.company.companies_id$': companies_id }
      ]
    },
    include: [
      {
        model: PlacesOfExpenses,
        attributes: ['name'],
        through: { attributes: [] },
        include: [
          {
            model: OrganizationalUnits,
            attributes: ['name'],
            include: [
              {
                model: Companies,
                attributes: []
              }
            ]
          },

        ]
      }
    ]
  });

  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);

})


/*
    @desc    Create user
    @route   POST /api/users
    @access  Public
*/

// Create real users
const createUser = asyncHandler(async (req, res) => {
  let {
    name, user_name, email, password, groups_id, companies_name, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name,
    parents_name, tax_region, county, tax_number, citizenship,
    marital_status, date_of_birth, municipality_of_birth,
    place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name,
    type_of_emplyoment, working_permit, working_permin_number,
    issuer, valid, tax_relief, residence_permit, resident, payment_type,
    salary_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
    net_salary, gross_salary, meal_allowances, meal_allowances_natural,
    transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
    years_of_service, months_of_service, days_of_service, cell_phone_use,
    car_use, profession, degree_of_education, degree_of_expretise,
    degree_of_proffesional_qualification, disability, disability_description,
    cause, date_of_disability, percentage_of_disability, description_of_disability,
    condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, created_by, internal_suspension
  } = req.body;

  if (!name || !user_name || !password || !companies_name || !groups_id) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  companies_name = companies_name.toUpperCase();

  //Check if user exist
  const userExist = await Users.findOne({
    where: {
      [Op.or]: [{ email }, { user_name }],
    },
  });

  if (userExist) {
    res.status(400);
    throw new Error("User with that email or username already exist");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await Users.create({
    name, user_type: "USER", user_name, email, password: hashedPassword, groups_id, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name,
    parents_name, tax_region, county, tax_number, citizenship,
    marital_status, date_of_birth, municipality_of_birth,
    place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name,
    type_of_emplyoment, working_permit, working_permin_number,
    issuer, valid, tax_relief, residence_permit, resident, payment_type,
    salary_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
    net_salary, gross_salary, meal_allowances, meal_allowances_natural,
    transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
    years_of_service, months_of_service, days_of_service, cell_phone_use,
    car_use, profession, degree_of_education, degree_of_expretise,
    degree_of_proffesional_qualification, disability, disability_description,
    cause, date_of_disability, percentage_of_disability, description_of_disability,
    condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, created_by, internal_suspension
  });


  const userLogs = await UserLogs.create({
    name, user_type: "USER", user_name, email, groups_id, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name,
    parents_name, tax_region, county, tax_number, citizenship,
    marital_status, date_of_birth, municipality_of_birth,
    place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name,
    type_of_emplyoment, working_permit, working_permin_number,
    issuer, valid, tax_relief, residence_permit, resident, payment_type,
    salary_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
    net_salary, gross_salary, meal_allowances, meal_allowances_natural,
    transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
    years_of_service, months_of_service, days_of_service, cell_phone_use,
    car_use, profession, degree_of_education, degree_of_expretise,
    degree_of_proffesional_qualification, disability, disability_description,
    cause, date_of_disability, percentage_of_disability, description_of_disability,
    condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, updated_by: created_by, internal_suspension, users_id: user.users_id
  });

  if (!user) {
    res.status(500);
    throw new Error("Can`t add user please try latter");
  }

  const company = await Companies.findOne({
    where: {
      name: companies_name,
    },
  });

  if (!company) {
    res.status(400);
    throw new Error("There is no company with that name");
  }

  await user
    .addCompanies(company)
    .then(() => {
      res.send({ user });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t add company to user please try latter");
    });
});



// REAL USER UPDATE

const updateRealUser = asyncHandler(async (req, res) => {
  let {
    users_id, name, user_name, email, active, jmbg, phone_number,
    identification_number, gender, address, maiden_name,
    parents_name, tax_region, county, tax_number, citizenship,
    marital_status, date_of_birth, municipality_of_birth,
    place_of_birth, zip_code, municipal_code, state, permanent_residence,
    temporary_residence, works_in, bank_account, bank_name,
    type_of_emplyoment, working_permit, working_permin_number,
    issuer, valid, tax_relief, residence_permit, resident, payment_type,
    salary_type, salary_base, coefficient_of_complexity,
    stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
    net_salary, gross_salary, meal_allowances, meal_allowances_natural,
    transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
    years_of_service, months_of_service, days_of_service, cell_phone_use,
    car_use, profession, degree_of_education, degree_of_expretise,
    degree_of_proffesional_qualification, disability, disability_description,
    cause, date_of_disability, percentage_of_disability, description_of_disability,
    condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, groups_id, internal_suspension, updated_by
  } = req.body;

  if (users_id) {

    //Check if user exist
    const userExist = await Users.findOne({
      where: {
        users_id,
      },
    });

    if (!userExist) {
      res.status(400);
      throw new Error("User with that email or username does not exist");
    }

    //Hash password
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);

    //Update user
    const user = await Users.update(
      {
        name, user_name, email, active, jmbg, phone_number,
        identification_number, gender, address, maiden_name,
        parents_name, tax_region, county, tax_number, citizenship,
        marital_status, date_of_birth, municipality_of_birth,
        place_of_birth, zip_code, municipal_code, state, permanent_residence,
        temporary_residence, works_in, bank_account, bank_name,
        type_of_emplyoment, working_permit, working_permin_number,
        issuer, valid, tax_relief, residence_permit, resident, payment_type,
        salary_type, salary_base, coefficient_of_complexity,
        stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
        net_salary, gross_salary, meal_allowances, meal_allowances_natural,
        transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
        years_of_service, months_of_service, days_of_service, cell_phone_use,
        car_use, profession, degree_of_education, degree_of_expretise,
        degree_of_proffesional_qualification, disability, disability_description,
        cause, date_of_disability, percentage_of_disability, description_of_disability,
        condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, groups_id, internal_suspension, updated_by
      },
      {
        where: { users_id },
      }
    );


    const userLogs = await UserLogs.create({
      name, user_name, email, active, jmbg, phone_number,
      identification_number, gender, address, maiden_name,
      parents_name, tax_region, county, tax_number, citizenship,
      marital_status, date_of_birth, municipality_of_birth,
      place_of_birth, zip_code, municipal_code, state, permanent_residence,
      temporary_residence, works_in, bank_account, bank_name,
      type_of_emplyoment, working_permit, working_permin_number,
      issuer, valid, tax_relief, residence_permit, resident, payment_type,
      salary_type, salary_base, coefficient_of_complexity,
      stimulation_coefficient, net_hourly_rate, gross_hourly_rate,
      net_salary, gross_salary, meal_allowances, meal_allowances_natural,
      transportation_fee, transportation_fee_natural, amount_of_personal_deduction,
      years_of_service, months_of_service, days_of_service, cell_phone_use,
      car_use, profession, degree_of_education, degree_of_expretise,
      degree_of_proffesional_qualification, disability, disability_description,
      cause, date_of_disability, percentage_of_disability, description_of_disability,
      condition_on_date, conclusion, date_of_conclusion, start_of_employment, end_of_employment_contract, groups_id, internal_suspension, updated_by, users_id: user.users_id
    });

    if (!user) {
      res.status(500);
      throw new Error("Can`t update user please try latter");
    }

    res.status(201).send({ user });
  }
});






// REAL USER ADD COMPANY

const addUsersCompany = asyncHandler(async (req, res) => {
  const { users_id, companies_id } = req.body;

  if (!users_id || !companies_id) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  //companies_name = companies_name.toUpperCase();

  //Check if user exist
  const user = await Users.findByPk(users_id);

  if (!user) {
    res.status(500);
    throw new Error("Can`t add user company please try latter");
  }

  const company = await Companies.findByPk(companies_id);

  if (!company) {
    res.status(400);
    throw new Error("There is no company");
  }

  await user
    .addCompanies(company)
    .then(() => {
      res.send({ message: "Company added" });
    })
    .catch((err) => {
      res.status(500);
      throw new Error("Can`t add company to user please try latter");
    });
});




const getRealUsersByCompany = asyncHandler(async (req, res) => {

  const companies_id = req.params.companies_id;

  const users = await Users.findAll({
    attributes: ['users_id', 'name', 'email', 'created_at', 'updated_at'],
    where: {
      [Op.and]: [
        { '$companies.companies_id$': companies_id },
        { user_type: 'USER' }
      ]
    },
    include: [
      {
        model: Companies,
        attributes: ['name'],
        through: {
          attributes: []
        },
        required: true
      },
      {
        model: Groups,
        attributes: ['name']
      }
    ]
  });

  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);

})




const getRealUsers = asyncHandler(async (req, res) => {

  const users = await Users.findAll({
    attributes: ['users_id', 'name', 'email', 'created_at', 'updated_at'],
    where: {
      user_type: 'USER'
    },
    include: [
      {
        model: Companies,
        attributes: ['name'],
        through: {
          attributes: []
        },
        required: true
      },
      {
        model: Groups,
        attributes: ['name']
      }
    ]
  });

  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);

})



const getRealUserById = asyncHandler(async (req, res) => {

  const users_id = req.params.users_id;

  const users = await Users.findByPk(users_id);


  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);

})





const getWorkers = asyncHandler(async (req, res) => {


  const users = await Users.findAll({
    attributes: ['users_id', 'name', 'jmbg', 'email', 'created_at', 'updated_at'],
    include: [
      {
        model: Groups,
        attributes: ['name']
      },
      WORKERS_JOIN
    ]
  });

  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);


});


const getWorkersByCompany = asyncHandler(async (req, res) => {

  const companies_id = req.params.companies_id;

  const users = await Users.findAll({
    attributes: ['users_id', 'name', 'jmbg', 'email', 'created_at', 'updated_at'],
    where: {
      [Op.and]: [
        { '$places_of_expenses.organizational_unit.company.companies_id$': companies_id },
      ]
    },
    include: [
      {
        model: Groups,
        attributes: ['name']
      },
      WORKERS_JOIN
    ]
  });

  if (!users) {
    res.status(500);
    throw new Error("Can`t get users please try latter");
  }

  res.status(200).json(users);


});


/****************** DELETE USERS DATA ********************/



const deleteUsersFamilySingle = asyncHandler(async (req, res) => {
  const family_members_id = req.params.family_members_id;

  if (!family_members_id) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  try {
    const deleted = await FamilyMembers.destroy({
      where: {
        family_members_id
      }
    });

    if (!deleted) {
      res.status(500);
      throw new Error("Can`t delete Family Members please try latter.");
    } else {
      res.status(200).json({ message: 'Family Member deleted.' });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Can`t delete Family Members please try latter.");
  }
});


const deleteUsersBookletsSingle = asyncHandler(async (req, res) => {
  const booklets_id = req.params.booklets_id;

  if (!booklets_id) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  try {
    const deleted = await Booklets.destroy({
      where: {
        booklets_id
      }
    });


    if (!deleted) {
      res.status(500);
      throw new Error("Can`t delete booklets please try latter.");
    } else {
      res.status(200).json({ message: 'Booklet deleted.' });
    }
  } catch (err) {
    res.status(500);
    throw new Error("Can`t delete booklets please try latter.");
  }
});


const deleteUsersSuspensionsSingle = asyncHandler(async (req, res) => {
  const suspensions_id = req.params.suspensions_id;

  if (!suspensions_id) {
    res.status(400);
    throw new Error("Please add all required fields");
  }

  try {
    const deleted = await Suspensions.destroy({
      where: {
        suspensions_id
      }
    });

    if (!deleted) {
      res.status(500);
      throw new Error("Can`t delete suspensions please try latter.");
    } else {
      res.status(200).json({ message: 'Suspension deleted.' });
    }

  } catch (err) {
    res.status(500);
    throw new Error("Can`t delete suspensions please try latter.");
  }

});


/****************** DELETE USERS DATA ********************/


module.exports = {
  createUser,
  addUsersCompany,
  updateRealUser,
  loginUser,
  getMe,
  getUsers,
  changePassword,
  test,
  createUserAndUserData,
  getUsersByCompany,
  uploadProfileImage,
  updateUser,
  getUsersFamilyAndBooklets,
  getUsersWithData,
  getUsersByCompanySpecData,
  addUsersFamilySingle,
  addUsersBookletsSingle,
  addUsersSuspensionsSingle,
  deleteUsersFamilySingle,
  deleteUsersBookletsSingle,
  deleteUsersSuspensionsSingle,
  getRealUsersByCompany,
  getRealUsers,
  getWorkersByCompany,
  getWorkers,
  getRealUserById
};

