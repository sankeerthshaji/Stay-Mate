const express = require("express");
const {
  getRoomTypes,
  admission,
  verifySignupOtp,
  loginUser,
  forgotPassword,
  changePassword,
  getRoomDetails,
  createOrder,
  verifyPayment,
  //   createRoom,
  fetchUserDetails,
} = require("../controllers/userController");
const admissionValidationMiddleware = require("../middlewares/validations/user");
const multer = require("multer");
const { storage } = require("../cloudinary");
const { requireAuthGuest, requireAuthResident } = require("../middlewares/authorization");
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

router.post("/changePassword", changePassword);

router.get("/roomDetails/:id", getRoomDetails);

router.post("/orders", requireAuthGuest, createOrder);

router.post("/verifyPayment", requireAuthGuest, verifyPayment);

// router.post("/createRoom", createRoom)

router.get("/userProfile/:id", requireAuthResident , fetchUserDetails);

module.exports = router;
