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
  getReviews,
  approveReview,
  rejectReview,
  getLeaveLetters
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

router
  .route("/hostelMenu/:id")
  .get(requireAuthAdmin, fetchMenuDetails)
  .put(requireAuthAdmin, updateMenuDetails);

router.get("/rooms", requireAuthAdmin, fetchRooms);

router.get("/reviews", requireAuthAdmin, getReviews);

router.put("/reviews/:id/approve", requireAuthAdmin, approveReview);

router.put("/reviews/:id/reject", requireAuthAdmin, rejectReview);

router.get("/leaveLetters", requireAuthAdmin, getLeaveLetters)

module.exports = router;
