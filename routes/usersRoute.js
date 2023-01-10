const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const {
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
} = require("../controllers/userController");
const { protect } = require('../middlewares/authMiddleware');
const { admin } = require('../middlewares/adminMiddleware');


router.post("/", protect , createUser);
router.put("/company", protect , addUsersCompany);
router.put("/real_user", protect ,  updateRealUser);
router.post("/login", loginUser);
router.post("/family", protect , addUsersFamilySingle);
router.post("/booklets", protect , addUsersBookletsSingle);
router.post("/suspensions", protect , addUsersSuspensionsSingle);
router.get("/me", protect , getMe);
router.patch("/password/", protect , changePassword);
router.get("/test", test);
router.post("/ced", protect , createUserAndUserData);
router.get("/get_by_company/:company", protect , getUsersByCompany);
router.patch("/profile/", [protect , upload.single('image')], uploadProfileImage);
router.put("/", protect , updateUser);
router.get('/userdata/:email', protect , getUsersFamilyAndBooklets);
router.get('/user_all/:users_id', protect , getUsersWithData);
router.get("/get_by_company_data/:companies_id", protect , getUsersByCompanySpecData);
router.get("/get_real_users_company/:companies_id", protect , getRealUsersByCompany);
router.get("/get_real_users/", protect , getRealUsers);
router.get("/get_real_users_by_id/:users_id", protect , getRealUserById);



router.get("/get_workers/", protect , getWorkers);
router.get("/get_workers_company/:companies_id", protect , getWorkersByCompany);

router.delete("/family/:family_members_id", protect , deleteUsersFamilySingle);
router.delete("/booklets/:booklets_id", protect , deleteUsersBookletsSingle);
router.delete("/suspensions/:suspensions_id", protect , deleteUsersSuspensionsSingle);






// todo add securty
router.get("/", getUsers);

module.exports = router;
