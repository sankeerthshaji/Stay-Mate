const express = require("express");

const {
  loginAdmin,
  fetchUsers,
  blockUser,
  unblockUser,
  removeAsResident,
  fetchResidentDetails,
  fetchGuestDetails,
  fetchHostelMenu,
  fetchMenuDetails,
  updateMenuDetails,
  fetchAllRooms,
  getReviews,
  approveReview,
  rejectReview,
  getLeaveLetters,
  getComplaints,
  getComplaintDetails,
  updateComplaintDetails,
  getPaidRents,
  getUnpaidRents,
  fetchRooms,
  assignRoom,
  getVacatingLetters
} = require("../controllers/adminController");
const { requireAuthAdmin } = require("../middlewares/authorization");
const AdminComplaintValidationMiddleware = require("../middlewares/validations/adminComplaintSchema");

const router = express.Router();

router.post("/login", loginAdmin);

router.get("/users", requireAuthAdmin, fetchUsers);

router.post("/blockUser", requireAuthAdmin, blockUser);

router.post("/unblockUser", requireAuthAdmin, unblockUser);

router.post("/removeAsResident", requireAuthAdmin, removeAsResident);

router.get("/residentDetails/:id", requireAuthAdmin, fetchResidentDetails);

router.get("/guestDetails/:id", requireAuthAdmin, fetchGuestDetails);

router.get("/fetchHostelMenu", requireAuthAdmin, fetchHostelMenu);

router
  .route("/hostelMenu/:id")
  .get(requireAuthAdmin, fetchMenuDetails)
  .put(requireAuthAdmin, updateMenuDetails);

router.get("/rooms", requireAuthAdmin, fetchAllRooms);

router.get("/reviews", requireAuthAdmin, getReviews);

router.put("/reviews/:id/approve", requireAuthAdmin, approveReview);

router.put("/reviews/:id/reject", requireAuthAdmin, rejectReview);

router.get("/leaveLetters", requireAuthAdmin, getLeaveLetters);

router.get("/complaints", requireAuthAdmin, getComplaints);

router.get("/complaint/:id", requireAuthAdmin, getComplaintDetails);

router.patch("/complaint/:id", requireAuthAdmin, AdminComplaintValidationMiddleware, updateComplaintDetails);

router.get("/paidRents", requireAuthAdmin, getPaidRents);

router.get("/unpaidRents", requireAuthAdmin, getUnpaidRents);

router.get("/rooms/:id", requireAuthAdmin, fetchRooms);

router.patch("/assignRoom", requireAuthAdmin, assignRoom);

router.get("/vacatingLetters", requireAuthAdmin, getVacatingLetters);

module.exports = router;
