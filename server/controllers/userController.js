const RoomType = require("../models/roomType");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { transporter, OTP } = require("../middlewares/otp");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Razorpay = require("razorpay");
const Payment = require("../models/payment");
const Room = require("../models/room");
const Menu = require("../models/menu");
const Review = require("../models/review");
const LeaveLetter = require("../models/leaveLetter");
const Complaint = require("../models/complaint");
const RentDue = require("../models/rentDue");
const moment = require("moment");
const mongoose = require("mongoose");
const VacatingLetter = require("../models/vacatingLetter");
const cron = require("node-cron");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getRoomTypes = (req, res) => {
  RoomType.find({})
    .then((roomTypes) => {
      res.json(roomTypes);
    })
    .catch((error) => {
      res.status(500).json({ message: "Internal server error" });
    });
};

const admission = async (req, res) => {
  try {
    const values = JSON.parse(req.body.values);

    const file = req.file;

    let mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: values.email,
      subject: "OTP for admission",
      html:
        "<h3>Your OTP for registering in StayMate is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        OTP +
        "</h1>", // html body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });

    res.status(200).json({
      message: "Form submitted successfully",
      values: values,
      file: file,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifySignupOtp = async (req, res) => {
  try {
    const otp = parseInt(req.body.otp);
    const email = req.body.userEmail;
    const values = req.body.userData;
    const file = req.body.userImage;

    if (!values || (!file && email)) {
      verifyPasswordResetOtp(req, res, otp, email);
      return;
    }

    const exists = await User.find({
      $or: [{ email: values?.email }, { mobileNumber: values?.mobileNumber }],
    });
    if (exists.length > 0) {
      throw new Error("User already exists");
    }

    if (otp == OTP) {
      const hash = await bcrypt.hash(values.password, 10);
      const user = new User({
        ...values,
        password: hash,
        address: {
          houseName: values?.houseName,
          area: values?.area,
          landmark: values?.landmark,
          city: values?.city,
          state: values?.state,
          country: values?.country,
          pincode: values?.pincode,
        },
        image: {
          url: file?.path,
          filename: file?.filename,
        },
      });
      await user.save();

      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //check if user role is guest or resident
    if (user.role == "guest") {
      const token = createToken(user._id);
      res.status(200).json({ id: user._id, role: user.role, token });
      return;
    }

    //check if user is resident
    if (user.role == "resident") {
      const token = createToken(user._id);
      res.status(200).json({ id: user._id, role: user.role, token });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      throw new Error("Please enter your email address");
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Please check the Email address and try again.");
    }

    let mailOptions = {
      from: process.env.NODEMAILER_USER,
      to: email,
      subject: "Email Verification",
      html:
        "<h3>Your OTP for confirming your Email Address is </h3>" +
        "<h1 style='font-weight:bold;'>" +
        OTP +
        "</h1>", // html body,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
      } else {
      }
    });

    res
      .status(200)
      .json({ message: "OTP sent to your email address", email: email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyPasswordResetOtp = async (req, res, otp, email) => {
  try {
    if (otp == OTP) {
      res
        .status(200)
        .json({ message: "OTP verified successfully", email: email });
    } else {
      throw new Error("Invalid OTP");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
      throw new Error("Please enter the password");
    }
    if (!validator.isStrongPassword(password)) {
      throw new Error("Password not strong enough");
    }
    const user = await User.findOne({ email: email });
    const samePassword = await bcrypt.compare(password, user.password);
    if (samePassword) {
      throw new Error(
        "You used this password recently. Please choose a different one."
      );
    }
    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const hash = await bcrypt.hash(password, 10);
    user.password = hash;
    await user.save();
    res
      .status(200)
      .json({ message: "Your password has been changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoomDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const roomDetails = await RoomType.findById(id);

    // calculate the dynamic rent based on the current date
    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0
    ).getDate();
    const daysRemainingInMonth = daysInMonth - now.getDate() + 1;
    const rentPerDay = roomDetails.rent / daysInMonth;
    const dynamicRent = Math.round(rentPerDay * daysRemainingInMonth);
    const totalRent = dynamicRent + roomDetails.admissionFees;

    res.status(200).json({ roomDetails, dynamicRent, totalRent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Creating a razorpay order
const createBookingOrder = async (req, res) => {
  try {
    const { totalRent, roomTypeId, userId } = req.body;

    // Find a room document from rooms collection in which the status of every room document is available
    const availableRoom = await Room.findOne({
      roomType: roomTypeId,
      status: "available",
    });

    // If no available rooms found, return error
    if (!availableRoom) {
      throw new Error("No rooms available for booking.");
    }

    // Check if user already has a roomNo field
    const user = await User.findById(userId);

    if (user.roomNo) {
      throw new Error("You already have a room booked.");
    }

    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: totalRent * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `PAY-${Date.now()}`,
    };

    instance.orders.create(options, function (err, order) {
      if (err) {
      } else {
        res.status(200).json({ order: order });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Verifying the razorpay payment
const verifyBookingPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order,
      userId,
      roomTypeId,
    } = req.body;
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == razorpay_signature) {
      // Find a room document from rooms collection in which the status of every room document is available
      const availableRoom = await Room.findOne({
        roomType: roomTypeId,
        status: "available",
      });

      // If no available rooms found, return error
      if (!availableRoom) {
        throw new Error("No rooms available for booking.");
      }

      // Increase the no of occupants to 1 for occupants field in the selected document
      availableRoom.occupants += 1;

      // Check whether the no of occupants is equal to the capacity field in the document, if it is equal, then update the status to unavailable
      if (availableRoom.occupants === availableRoom.capacity) {
        availableRoom.status = "occupied";
      }

      // Save the updated room document
      await availableRoom.save();

      // Create a new field roomNo in user (assume I have user id) document
      const user = await User.findById(userId);

      // Check if user already has a roomNo field
      if (user.roomNo) {
        throw new Error("You already have a room booked.");
      }

      user.roomNo = availableRoom.roomNo;

      // Update the field - role - in user document from "guest" to "resident"
      user.role = "resident";

      // create dateOfAdmission field in user document
      user.dateOfAdmission = new Date();

      // Save the updated user document
      await user.save();

      // Check if the status of all the rooms of the roomType is 'occupied' and update the status field accordingly
      const roomsOfType = await Room.find({ roomType: roomTypeId });
      const allOccupied = roomsOfType.every(
        (room) => room.status === "occupied"
      );

      if (allOccupied) {
        const roomType = await RoomType.findById(roomTypeId);
        roomType.status = "unavailable";
        await roomType.save();
      }

      // create a new payment document
      const payment = new Payment({
        user: userId,
        rentAmount: order.amount / 100,
        dateOfPayment: new Date(),
        monthOfPayment: new Date().toLocaleString("default", { month: "long" }),
      });
      await payment.save();

      // create a new token
      const token = createToken(user._id);

      res.status(200).json({
        status: "success",
        message: "Room booked successfully.",
        token,
        id: userId,
        roomNo: availableRoom.roomNo,
      });
    } else {
      res.status(400).json({ message: "Payment verification failed." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetching user details
const fetchUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const userDetails = await User.findById(userId).select("-password");
    res.status(200).json({ userDetails: userDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user details
const updateProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const values = JSON.parse(req.body.values);

    const file = req.file;

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          fullName: values.fullName,
          dateOfBirth: values.dateOfBirth,
          gender: values.gender,
          mobileNumber: values.mobileNumber,
          aadharNumber: values.aadharNumber,
          parentName: values.parentName,
          parentMobileNumber: values.parentMobileNumber,
          bloodGroup: values.bloodGroup,
          address: {
            houseName: values.houseName,
            landmark: values.landmark,
            area: values.area,
            city: values.city,
            state: values.state,
            country: values.country,
            pincode: values.pincode,
          },
          ...(file && {
            image: {
              url: file.path,
              filename: file.filename,
            },
          }),
        },
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Change password
const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error("Please enter the password");
    }

    const user = await User.findById(userId);
    const samePassword = await bcrypt.compare(currentPassword, user.password);
    if (!samePassword) {
      throw new Error("Incorrect password");
    }

    if (newPassword === currentPassword) {
      throw new Error(
        "You used this password recently. Please choose a different one."
      );
    }

    if (!validator.isStrongPassword(newPassword)) {
      throw new Error("Password not strong enough");
    }

    if (newPassword !== confirmPassword) {
      throw new Error("Passwords do not match");
    }
    const hash = await bcrypt.hash(newPassword, 10);
    user.password = hash;
    await user.save();
    res
      .status(200)
      .json({ message: "Your password has been changed successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel menu
const fetchHostelMenu = async (req, res) => {
  try {
    const hostelMenu = await Menu.find({});
    res.status(200).json({ hostelMenu: hostelMenu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRoomTypeDetails = async (req, res) => {
  try {
    const userWithRoom = await User.aggregate([
      {
        $match: { _id: new mongoose.Types.ObjectId(req.query.userId) },
      },
      {
        $lookup: {
          from: "rooms",
          localField: "roomNo",
          foreignField: "roomNo",
          as: "room",
        },
      },
      {
        $unwind: "$room",
      },
    ]);
    const room = userWithRoom[0].room;

    if (!room) {
      throw new Error("Room not found");
    }

    // Find the roomType document that matches the roomType ID in the room document
    const roomType = await RoomType.findById(room.roomType);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    // Return the roomType document to the frontend
    res.json({ roomTypeDetails: roomType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const postHostelReview = async (req, res) => {
  try {
    // check if user has already posted a review for this hostel
    const existingReview = await Review.findOne({
      user: req.body.userId,
    });
    if (existingReview) {
      throw new Error("You have already posted a review");
    }
    const newReview = new Review({
      ...req.body.values,
      user: req.body.userId,
    });
    await newReview.save();

    res.status(200).json({ message: "Review posted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getHostelReview = async (req, res) => {
  try {
    const userId = req.params.id;
    const hostelReview = await Review.findOne({ user: userId });
    res.status(200).json({ hostelReview: hostelReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteHostelReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateHostelReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndUpdate(id, {
      ...req.body.values,
      user: req.body.userId,
    });
    res.status(200).json({ message: "Review updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaveLetters = async (req, res) => {
  try {
    const userId = req.query.userId;
    const leaveLetters = await LeaveLetter.find({ user: userId });
    res.status(200).json({ leaveLetters: leaveLetters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postLeaveLetter = async (req, res) => {
  try {
    const newLeaveLetter = new LeaveLetter({
      ...req.body.values,
      user: req.body.userId,
    });
    await newLeaveLetter.save();

    res.status(200).json({ message: "Leave Letter submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const userId = req.query.userId;
    const complaints = await Complaint.find({ user: userId });
    res.status(200).json({ complaints: complaints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postComplaint = async (req, res) => {
  try {
    const newComplaint = new Complaint({
      ...req.body.values,
      user: req.body.userId,
    });
    await newComplaint.save();

    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRentDue = async (req, res) => {
  try {
    const { userId } = req.query;
    // Check whether a RentDue document already exists for the current month and year for the given userId.
    const rentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );
    const rentDue = await RentDue.findOne({
      user: userId,
      rentDate,
      status: "Unpaid",
    });
    if (rentDue) {
      return res.status(200).json({ rentDue });
    }

    // If no RentDue document exists for the current month and year for the given userId, create a new RentDue document.
    res.status(200).json({ rentDue: {} });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRentPaid = async (req, res) => {
  try {
    const { userId } = req.query;
    const rentPaid = await Payment.find({ user: userId }).sort({
      dateOfPayment: -1,
    });
    res.status(200).json({ rentPaid: rentPaid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createRentOrder = async (req, res) => {
  try {
    const { totalRent } = req.body;

    let instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: totalRent * 100, // amount in the smallest currency unit
      currency: "INR",
      receipt: `PAY-${Date.now()}`,
    };

    instance.orders.create(options, function (err, order) {
      if (err) {
      } else {
        res.status(200).json({ order: order });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const verifyRentPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      order,
      userId,
    } = req.body;
    const crypto = require("crypto");
    let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
    hmac = hmac.digest("hex");

    if (hmac == razorpay_signature) {
      // update the rentDue document by updating the status to paid
      const rentDate = new Date(
        Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
      );
      const rentDue = await RentDue.findOne({
        user: userId,
        rentDate,
        status: "Unpaid",
      });
      rentDue.status = "Paid";
      await rentDue.save();
      // create a new payment document
      const payment = new Payment({
        user: userId,
        rentAmount: order.amount / 100,
        dateOfPayment: new Date(),
        monthOfPayment: new Date().toLocaleString("default", { month: "long" }),
      });
      await payment.save();

      res.status(200).json({
        status: "success",
        message: "Rent Payment Successful",
      });
    } else {
      throw new Error("Payment Failed");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAvailableRoomTypes = async (req, res) => {
  try {
    const availableRoomTypes = await RoomType.find({
      status: "available",
    }).select("name");
    res.status(200).json({ availableRoomTypes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignNewRoomType = async (req, res) => {
  try {
    const { userId, roomNo, newRoomTypeId } = req.body;
    if (!newRoomTypeId) {
      throw new Error("Please select a Room Type.");
    }

    const oldRoom = await Room.findOne({ roomNo });
    if (newRoomTypeId === oldRoom.roomType.toString()) {
      return res.status(200).json({ status: false });
    }
    // Decrease the no of occupants by 1 for occupants field in the old room document
    oldRoom.occupants -= 1;
    // Check whether the status of old room is occupied, then update the status to available
    if (oldRoom.status === "occupied") {
      oldRoom.status = "available";
    }
    // Save the updated old room document
    await oldRoom.save();

    const oldRoomType = await RoomType.findById(oldRoom.roomType);
    if (oldRoomType.status === "occupied") {
      oldRoomType.status = "available";
      await oldRoomType.save();
    }

    const newRoom = await Room.findOne({
      roomType: newRoomTypeId,
      status: "available",
    });
    // If no available rooms found, return error
    if (!newRoom) {
      throw new Error("No rooms available for this room type");
    }
    // Increase the no of occupants to 1 for occupants field in the selected document
    newRoom.occupants += 1;
    // Check whether the no of occupants is equal to the capacity field in the document, if it is equal, then update the status to unavailable
    if (newRoom.occupants === newRoom.capacity) {
      newRoom.status = "occupied";
    }
    // Save the updated room document
    await newRoom.save();

    // Update the roomNo field in user document
    const user = await User.findById(userId);
    user.roomNo = newRoom.roomNo;
    // Save the updated user document
    await user.save();

    // Check if the status of all the rooms of the New RoomType is 'occupied' and update the status field accordingly
    const newRoomType = await RoomType.findById(newRoomTypeId);
    const roomsOfType = await Room.find({ roomType: newRoomTypeId });
    const allOccupied = roomsOfType.every((room) => room.status === "occupied");
    if (allOccupied) {
      newRoomType.status = "unavailable";
      await newRoomType.save();
    }
    res.status(200).json({
      newRoomNo: newRoom.roomNo,
      newRoomType: newRoomType.name,
      status: true,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const postVacatingLetter = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { values, userId } = req.body;
    const rentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );
    const rentDue = await RentDue.findOne({
      user: userId,
      rentDate,
      status: "Unpaid",
    }).session(session);
    if (rentDue) {
      throw new Error("Please pay the rent before vacating.");
    }
    await VacatingLetter.create([{ ...values, user: userId }], { session });
    const user = await User.findById(userId).session(session);
    const room = await Room.findOne({ roomNo: user.roomNo }).session(session);
    room.occupants -= 1;
    if (room.occupants < room.capacity && room.status === "occupied") {
      room.status = "available";
    }
    const roomType = await RoomType.findOneAndUpdate(
      { _id: room.roomType, status: "unavailable" },
      { $set: { status: "available" } },
      {
        session,
        new: true,
      }
    );
    user.role = "guest";
    user.roomNo = undefined;
    await Promise.all([user.save({ session }), room.save({ session })]);
    await session.commitTransaction();
    session.endSession();
    res.status(200).json({
      message:
        "Your vacating letter has been submitted successfully! We hope you had a comfortable and enjoyable stay with us.",
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

cron.schedule("0 0 0 1 * *", async function generateMonthlyRent() {
  try {
    const users = await User.find({ role: { $ne: "guest" } });
    const rentMonth = new Date().toLocaleString("default", { month: "long" });
    const rentYear = new Date().getFullYear();
    const rentDues = [];

    for (const user of users) {
      const room = await Room.findOne({ roomNo: user.roomNo });
      const roomType = await RoomType.findById(room.roomType);
      const rentAmount = roomType.rent;
      const rentDate = new Date(rentYear, new Date().getMonth(), 1);
      const lastDateWithoutFine = new Date(rentYear, new Date().getMonth(), 5);
      const lastDateWithFine = new Date(rentYear, new Date().getMonth(), 10);

      rentDues.push({
        user: user._id,
        rentMonth,
        rentDate,
        rentAmount,
        lastDateWithoutFine,
        lastDateWithFine,
        fine: 0,
      });
    }

    await RentDue.insertMany(rentDues);
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("0 0 0 6-11 * *", async function updateRentDues() {
  try {
    const rentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );
    const rentDues = await RentDue.find({
      rentDate,
      status: "Unpaid",
    });
    const now = new Date().toISOString();
    for (const rentDue of rentDues) {
      const lastDateWithoutFine = rentDue.lastDateWithoutFine.toISOString();
      const lastDateWithFine = rentDue.lastDateWithFine.toISOString();
      if (now > lastDateWithoutFine && now <= lastDateWithFine) {
        const daysLate = Math.floor(
          (new Date(now) - rentDue.lastDateWithoutFine) / (1000 * 60 * 60 * 24)
        );
        const fine = daysLate * 100;
        await RentDue.updateOne({ _id: rentDue._id }, { fine });
      }
    }
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("0 0 0 11 * *", async function removeResidents() {
  try {
    const rentDate = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    );
    const rentDues = await RentDue.find({
      rentDate,
      status: "Unpaid",
    });

    for (const rentDue of rentDues) {
      const user = await User.findById(rentDue.user);
      const room = await Room.findOne({ roomNo: user.roomNo });
      room.occupants -= 1;
      if (room.occupants < room.capacity && room.status === "occupied") {
        room.status = "available";
      }
      await RoomType.findOneAndUpdate(
        { _id: room.roomType, status: "unavailable" },
        { $set: { status: "available" } }
      );
      user.role = "guest";
      user.roomNo = undefined;
      await Promise.all([user.save(), room.save()]);
    }
  } catch (error) {
    console.error(error);
  }
});

module.exports = {
  getRoomTypes,
  admission,
  verifySignupOtp,
  loginUser,
  forgotPassword,
  resetPassword,
  getRoomDetails,
  createBookingOrder,
  verifyBookingPayment,
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
  postComplaint,
  getRentDue,
  createRentOrder,
  verifyRentPayment,
  getRentPaid,
  getAvailableRoomTypes,
  assignNewRoomType,
  postVacatingLetter,
};
