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

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const getRoomTypes = (req, res) => {
  RoomType.find({})
    .then((roomTypes) => {
      res.json(roomTypes);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    });
};

const admission = async (req, res) => {
  try {
    const values = JSON.parse(req.body.values);
    console.log(values);
    const file = req.file;
    console.log(file);
    var mailOptions = {
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
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({
      message: "Form submitted successfully",
      values: values,
      file: file,
    });
  } catch (error) {
    console.log(error);
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
      console.log(user);
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.login(email, password);

    //check if user role is guest or resident
    if (user.role == "guest") {
      const token = createToken(user._id);
      res.status(200).json({ id: user._id, token });
      return;
    }

    //check if user is resident
    if (user.role == "resident") {
      const token = createToken(user._id);
      res.status(200).json({ id: user._id, roomNo: user.roomNo, token });
      return;
    }
  } catch (error) {
    console.log(error);
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

    var mailOptions = {
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
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res
      .status(200)
      .json({ message: "OTP sent to your email address", email: email });
  } catch (error) {
    console.log(error.message);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    console.log(email, password, confirmPassword);
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
    console.log(error);
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
    console.log(error);
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
      return res.status(400).json({ error: "You have already booked a room" });
    }

    var instance = new Razorpay({
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
        console.log(err);
      } else {
        res.status(200).json({ order: order });
      }
    });
  } catch (error) {
    console.log(error);
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
    console.log(hmac, razorpay_signature);
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
        return res
          .status(400)
          .json({ error: "You have already booked a room" });
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
      res.status(400).json({ message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// async function createRoom() {
//   const newRoom = new Room({
//     roomNo: '110',
//     roomType: '64147dddca39c8e3730a3095',
//     capacity: 6
//   });

//   try {
//     const savedRoom = await newRoom.save();
//     console.log('New room created:', savedRoom);
//   } catch (error) {
//     console.error('Error creating new room:', error);
//   }
// }

async function createMenu() {
  const newMenu = new Menu({
    day: "Sunday",
    breakfast: "Dosa, Chutney, tea",
    lunch: "Rice, Chena-Parippu curry, Beetroot Upperi, Achar, Pappadam",
    snacks: "Black Tea and Enna Kadi",
    dinner: "Chapathi, Veg kuruma",
  });

  try {
    const savedMenu = await newMenu.save();
    console.log("New menu created:", savedMenu);
  } catch (error) {
    console.error("Error creating new menu:", error);
  }
}

// Fetching user details
const fetchUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log(req.params);
    const userDetails = await User.findById(userId).select("-password");
    res.status(200).json({ userDetails: userDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Update user details
const updateProfile = async (req, res) => {
  try {
    console.log("hooray");
    const userId = req.params.id;
    const values = JSON.parse(req.body.values);
    console.log(values);
    const file = req.file;
    console.log(file);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel menu
const fetchHostelMenu = async (req, res) => {
  try {
    const hostelMenu = await Menu.find({});
    res.status(200).json({ hostelMenu: hostelMenu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getRoomTypeDetails = async (req, res) => {
  try {
    const roomNo = req.query.roomNo;
    // Find the room document that matches the roomNo
    const room = await Room.findOne({ roomNo });
    console.log(room.roomType);

    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    // Find the roomType document that matches the roomType ID in the room document
    const roomType = await RoomType.findById(room.roomType);

    if (!roomType) {
      return res.status(404).json({ error: "Room type not found" });
    }

    // Return the roomType document to the frontend
    res.json({ roomTypeDetails: roomType });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
    console.log("New review created:", newReview);
    res.status(200).json({ message: "Review posted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getHostelReview = async (req, res) => {
  try {
    const userId = req.params.id;
    const hostelReview = await Review.findOne({ user: userId });
    res.status(200).json({ hostelReview: hostelReview });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const deleteHostelReview = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getLeaveLetters = async (req, res) => {
  try {
    const userId = req.query.userId;
    const leaveLetters = await LeaveLetter.find({ user: userId });
    res.status(200).json({ leaveLetters: leaveLetters });
  } catch (error) {
    console.log(error);
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
    console.log(newLeaveLetter);
    res.status(200).json({ message: "Leave Letter submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const userId = req.query.userId;
    const complaints = await Complaint.find({ user: userId });
    res.status(200).json({ complaints: complaints });
  } catch (error) {
    console.log(error);
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
    console.log(newComplaint);
    res.status(200).json({ message: "Complaint submitted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getRentDue = async (req, res) => {
  try {
    const { userId } = req.query;
    // Check whether a RentDue document already exists for the current month and year for the given userId.
    const today = moment();
    const month = moment(today).format("MMMM");
    const date = moment(today).startOf("month");
    const rentDue = await RentDue.findOne({
      user: userId,
      rentMonth: month,
      rentDate: moment(date).format("YYYY-MM-DD"),
      status: "Unpaid",
    });

    if (rentDue) {
      return res.status(200).json({ rentDue: rentDue });
    }

    // If no RentDue document exists for the current month and year for the given userId, create a new RentDue document.
    res.status(200).json({ rentDue: {} });
  } catch (error) {
    console.log(error);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const createRentOrder = async (req, res) => {
  try {
    const { totalRent } = req.body;

    var instance = new Razorpay({
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
        console.log(err);
      } else {
        res.status(200).json({ order: order });
      }
    });
  } catch (error) {
    console.log(error);
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
    console.log(hmac, razorpay_signature);
    if (hmac == razorpay_signature) {
      // update the rentDue document by updating the status to paid
      const today = moment();
      const month = moment(today).format("MMMM");
      const date = moment(today).startOf("month");
      console.log(month, date, userId);
      const rentDue = await RentDue.findOne({
        user: userId,
        rentMonth: month,
        rentDate: moment(date).format("YYYY-MM-DD"),
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
      console.log(payment);

      res.status(200).json({
        status: "success",
        message: "Rent Payment Successful",
      });
    } else {
      res.status(400).json({ message: "Payment Failed" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const getRentPaymentStatus = async (req, res) => {
  try {
    const { resident } = req.query;
    const user = await User.findById(resident.id);
    const room = await Room.findOne({ roomNo: user.roomNo });
    const roomType = await RoomType.findById(room.roomType);
    const today = moment();
    const month = moment(today).format("MMMM");
    const date = moment(today).startOf("month");
    const rentDue = await RentDue.findOne({
      user: resident.id,
      rentMonth: month,
      rentDate: moment(date).format("YYYY-MM-DD"),
      status: "Unpaid",
    });

    if (rentDue) {
      const currentDate = moment(today);
      const lastDateWithFine = moment(rentDue.lastDateWithFine);
      if (currentDate.isAfter(lastDateWithFine)) {
        room.occupants -= 1;
        if (room.occupants < room.capacity && room.status === "occupied") {
          room.status = "available";
        }
        if (roomType.status === "unavailable") {
          roomType.status = "available";
          await roomType.save();
        }
        user.role = "guest";
        user.roomNo = undefined;
        await user.save();
        await room.save();
        // Delete the rentDue document
        await RentDue.findByIdAndDelete(rentDue._id);
        res.status(200).json({ status: "Late" });
      } else {
        res.status(200).json({ status: "Unpaid" });
      }
    } else {
      const dateOfAdmission = user.dateOfAdmission;
      // Check whether the dateOfAdmission month and year are the same as the current month and year.
      const admissionMonthYear = moment(dateOfAdmission).format("MMMM, YYYY");
      const currentMonthYear = moment(today).format("MMMM, YYYY");

      if (admissionMonthYear === currentMonthYear) {
        return res.status(200).json({ status: "paid" });
      }

      // Check whether the user has already paid the rent for the current month.
      // const month = moment(today).format("MMMM");
      const rentPaid = await RentDue.findOne({
        user: resident.id,
        rentMonth: month,
        rentDate: moment(date).format("YYYY-MM-DD"),
        status: "Paid",
      });

      if (rentPaid) {
        return res.status(200).json({ status: "paid" });
      }

      // Retrieve the roomNo of the user from the User collection and then retrieve the corresponding room document from the Room collection.
      const roomNo = resident.roomNo;
      const room = await Room.findOne({ roomNo });
      if (!room) {
        console.log(`Room with roomNo ${roomNo} not found`);
        throw new Error(`Room with roomNo ${roomNo} not found`);
      }

      // Retrieve the rent amount of the corresponding roomType from the RoomType collection using the roomNo
      const { rent } = roomType;

      // Calculate the lastDateWithFine and lastDateWithoutFine for the current month and year.
      const lastDateWithoutFine = moment(date).add(4, "days");
      const lastDateWithFine = moment(date).add(9, "days");

      // Calculate the fine amount if the rent is paid after lastDateWithoutFine
      let fine = 0;
      const currentDate = moment(today);
      if (currentDate.isAfter(lastDateWithoutFine)) {
        const daysLate = currentDate.diff(lastDateWithoutFine, "days");
        fine = daysLate * 100;
        if (currentDate.isAfter(lastDateWithFine)) {
          fine = 500;
        }
      }

      const newRentDue = new RentDue({
        rentMonth: month,
        rentDate: moment(date).format("YYYY-MM-DD"),
        rentAmount: rent,
        lastDateWithFine: moment(lastDateWithFine).format("YYYY-MM-DD"),
        lastDateWithoutFine: moment(lastDateWithoutFine).format("YYYY-MM-DD"),
        fine,
        user: resident.id,
      });

      await newRentDue.save();
      res.status(200).json({ status: "Unpaid" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

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
  // createRoom,
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
  postComplaint,
  getRentDue,
  createRentOrder,
  verifyRentPayment,
  getRentPaid,
  getRentPaymentStatus,
};
