const express = require("express");

const { loginAdmin , fetchUsers , blockUser , unblockUser, removeAsResident } = require("../controllers/adminController");
const { requireAuthAdmin } = require("../middlewares/authorization");

const router = express.Router();

router.post("/login", loginAdmin)

router.get("/users", requireAuthAdmin, fetchUsers)

router.post("/blockUser", requireAuthAdmin, blockUser)

router.post("/unblockUser", requireAuthAdmin, unblockUser)

router.post("/removeAsResident", requireAuthAdmin, removeAsResident)

module.exports = router;