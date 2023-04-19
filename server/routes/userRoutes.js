const express = require("express");
const {
  getRoomTypes,
  admission,
  verifySignupOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getRoomDetails,
  createOrder,
  verifyPayment,
  //   createRoom,
  createMenu,
  fetchUserDetails,
  updateProfile,
  changePassword,
  fetchHostelMenu,
  getRoomTypeDetails,
  postHostelReview,
  getHostelReview,
  updateHostelReview,
  deleteHostelReview,
  getLeaveLetters,
  postLeaveLetter,
  getComplaints,
  postComplaint
} = require("../controllers/userController");
const admissionValidationMiddleware = require("../middlewares/validations/admission");
const updateProfileValidationMiddleware = require("../middlewares/validations/updateProfile");
const multer = require("multer");
const { storage } = require("../cloudinary");
const {
  requireAuthGuest,
  requireAuthResident,
} = require("../middlewares/authorization");
const { create } = require("../models/roomType");
const reviewValidationMiddleware = require("../middlewares/validations/review");
const LeaveLetterValidationMiddleware = require("../middlewares/validations/leaveLetter");
const ComplaintValidationMiddleware = require("../middlewares/validations/complaintSchema");
const upload = multer({ storage });

const router = express.Router();

router.get("/roomTypes", getRoomTypes);

router.post(
  "/admission",
  upload.single("image"),
  admissionValidationMiddleware,
  admission
);

router.post("/verifyOtp", verifySignupOtp);

router.post("/login", loginUser);

router.post("/forgotPassword", forgotPassword);

router.post("/resetPassword", resetPassword);

router.get("/roomDetails/:id", getRoomDetails);

router.post("/orders", requireAuthGuest, createOrder);

router.post("/verifyPayment", requireAuthGuest, verifyPayment);

// router.post("/createRoom", createRoom)

router.get("/userProfile/:id", requireAuthResident, fetchUserDetails);

router.patch(
  "/updateProfile/:id",
  requireAuthResident,
  upload.single("image"),
  updateProfileValidationMiddleware,
  updateProfile
);

router.post("/changePassword/:id", requireAuthResident, changePassword);

router.post("/createMenu", createMenu);

router.get("/fetchHostelMenu", requireAuthResident, fetchHostelMenu);

router.get("/roomTypeDetails", requireAuthResident, getRoomTypeDetails);

router.post(
  "/hostelReview",
  requireAuthResident,
  reviewValidationMiddleware,
  postHostelReview
);

router
  .route("/hostelReview/:id")
  .get(requireAuthResident, getHostelReview)
  .put(requireAuthResident, updateHostelReview)
  .delete(requireAuthResident, deleteHostelReview);

router
  .route("/leaveLetters")
  .get(requireAuthResident, getLeaveLetters)
  .post(requireAuthResident, LeaveLetterValidationMiddleware, postLeaveLetter);

  router.get("/complaints", requireAuthResident, getComplaints);

  router.post("/complaints", requireAuthResident, ComplaintValidationMiddleware, postComplaint)

module.exports = router;
