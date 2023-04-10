const express = require("express");

const {
  loginAdmin,
  fetchUsers,
  blockUser,
  unblockUser,
  removeAsResident,
  fetchUserDetails,
  fetchHostelMenu,
  fetchMenuDetails,
  updateMenuDetails,
  fetchRooms,
} = require("../controllers/adminController");
const { requireAuthAdmin } = require("../middlewares/authorization");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/users", requireAuthAdmin, fetchUsers);

router.post("/blockUser", requireAuthAdmin, blockUser);

router.post("/unblockUser", requireAuthAdmin, unblockUser);

router.post("/removeAsResident", requireAuthAdmin, removeAsResident);

router.get("/userDetails/:id", requireAuthAdmin, fetchUserDetails);

router.get("/fetchHostelMenu", requireAuthAdmin, fetchHostelMenu);

router.get("/hostelMenu/:id", requireAuthAdmin, fetchMenuDetails);

router.put("/hostelMenu/:id", requireAuthAdmin, updateMenuDetails);

router.get("/rooms", requireAuthAdmin, fetchRooms);

module.exports = router;
