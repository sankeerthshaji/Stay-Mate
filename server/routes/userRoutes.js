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
  fetchHostelMenu
} = require("../controllers/userController");
const admissionValidationMiddleware = require("../middlewares/validations/admission");
const updateProfileValidationMiddleware = require("../middlewares/validations/updateProfile")
const multer = require("multer");
const { storage } = require("../cloudinary");
const {
  requireAuthGuest,
  requireAuthResident,
} = require("../middlewares/authorization");
const { create } = require("../models/roomType");
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

router.get("/fetchHostelMenu", requireAuthResident, fetchHostelMenu)

module.exports = router;
