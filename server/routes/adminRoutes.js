const express = require("express");

const { loginAdmin , fetchUsers , blockUser , unblockUser, removeAsResident, fetchUserDetails } = require("../controllers/adminController");
const { requireAuthAdmin } = require("../middlewares/authorization");

const router = express.Router();

router.post("/login", loginAdmin)

router.get("/users", requireAuthAdmin, fetchUsers)

router.post("/blockUser", requireAuthAdmin, blockUser)

router.post("/unblockUser", requireAuthAdmin, unblockUser)

router.post("/removeAsResident", requireAuthAdmin, removeAsResident)

router.get("/userDetails/:id", requireAuthAdmin, fetchUserDetails)

module.exports = router;