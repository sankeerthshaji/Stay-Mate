const Admin = require("../models/admin");
const User = require("../models/user");
const Room = require("../models/room");
const RoomType = require("../models/roomType");
const Menu = require("../models/menu");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const Review = require("../models/review");
const LeaveLetter = require("../models/leaveLetter");
const Complaint = require("../models/complaint");
const RentDue = require("../models/rentDue");
const Payment = require("../models/payment");
const VacatingLetter = require("../models/vacatingLetter");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.login(email, password);

    const token = createToken(admin._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Block user
const blockUser = async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndUpdate(id, { isBlocked: true });
    res.status(200).json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Unblock user
const unblockUser = async (req, res) => {
  const { id } = req.body;
  try {
    await User.findByIdAndUpdate(id, { isBlocked: false });
    res.status(200).json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Remove user as resident
const removeAsResident = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    if (user.role !== "resident") {
      throw new Error("User is not a resident");
    }

    const room = await Room.findOne({ roomNo: user.roomNo });

    if (!room) {
      throw new Error("Room not found");
    }

    room.occupants -= 1;

    if (room.occupants < room.capacity && room.status === "occupied") {
      room.status = "available";
    }

    const roomType = await RoomType.findById(room.roomType);

    if (!roomType) {
      throw new Error("Room type not found");
    }

    if (roomType.status === "unavailable") {
      roomType.status = "available";
      await roomType.save();
    }

    user.role = "guest";
    user.roomNo = undefined;
    await user.save();
    await room.save();

    return res.status(200).json({ message: "User removed as resident" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch Resident details
const fetchResidentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const residentDetails = await User.findById(id).select("-password");

    const room = await Room.findOne({ roomNo: residentDetails.roomNo });
    const roomType = await RoomType.findById(room.roomType);
    res
      .status(200)
      .json({ residentDetails: residentDetails, roomTypeDetails: roomType });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Guest details
const fetchGuestDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const guestDetails = await User.findById(id).select("-password");
    res.status(200).json({ guestDetails: guestDetails });
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

// Fetching menu details
const fetchMenuDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const menuDetails = await Menu.findById(id);
    res.status(200).json({ menuDetails: menuDetails });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update menu details
const updateMenuDetails = async (req, res) => {
  try {
    const { menuDetails } = req.body;

    // Validate menu item names
    if (
      !menuDetails.breakfast ||
      !menuDetails.lunch ||
      !menuDetails.snacks ||
      !menuDetails.dinner
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (
      !validator.isLength(menuDetails.breakfast, {
        min: 1,
        max: 100,
      }) ||
      !validator.isLength(menuDetails.lunch, {
        min: 1,
        max: 100,
      }) ||
      !validator.isLength(menuDetails.snacks, {
        min: 1,
        max: 100,
      }) ||
      !validator.isLength(menuDetails.dinner, { min: 1, max: 100 })
    ) {
      throw new Error("Menu item must be between 1 to 100 characters");
    }

    // update menu details
    await Menu.findByIdAndUpdate(menuDetails._id, {
      breakfast: menuDetails.breakfast,
      lunch: menuDetails.lunch,
      snacks: menuDetails.snacks,
      dinner: menuDetails.dinner,
    });

    res.status(200).json({ message: "Menu updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel rooms
const fetchAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("roomType");
    res.status(200).json({ rooms: rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel reviews
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ reviews: reviews });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Approve hostel review
const approveReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    review.status = "Approved";
    await review.save();
    res.status(200).json({ message: "Review approved successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reject hostel review
const rejectReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    review.status = "Rejected";
    await review.save();
    res.status(200).json({ message: "Review rejected successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Leave Letters
const getLeaveLetters = async (req, res) => {
  try {
    const leaveLetters = await LeaveLetter.find({}).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ leaveLetters: leaveLetters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Complaints
const getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({}).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ complaints: complaints });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get complaint details
const getComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const complaint = await Complaint.findById(id);
    res.status(200).json({ complaint: complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update complaint Details
const updateComplaintDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { values } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { $set: values },
      { new: true }
    );
    res
      .status(200)
      .json({ message: "Complaint updated successfully", complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Paid Rents
const getPaidRents = async (req, res) => {
  try {
    const paidRents = await Payment.find({})
      .sort({ dateOfPayment: -1 })
      .populate({
        path: "user",
        select: "-password",
      });

    res.status(200).json({ paidRents: paidRents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Unpaid Rents
const getUnpaidRents = async (req, res) => {
  try {
    const unpaidRents = await RentDue.find({ status: "Unpaid" }).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ unpaidRents: unpaidRents });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchRooms = async (req, res) => {
  try {
    const { id } = req.params;
    const rooms = await Room.find({ roomType: id, status: "available" });
    res.status(200).json({ rooms: rooms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const assignRoom = async (req, res) => {
  try {
    const { oldRoomNo, newRoomId, residentId } = req.body;

    if (!newRoomId) {
      throw new Error("Please select a Room No.");
    }

    const oldRoom = await Room.findOne({ roomNo: oldRoomNo });
    if (newRoomId === oldRoom._id.toString()) {
      return res.status(200).json({ message: "Room No already assigned" });
    }

    // Decrease the no of occupants by 1 for occupants field in the old room document
    oldRoom.occupants -= 1;

    // Check whether the status of old room is occupied, then update the status to available
    if (oldRoom.status === "occupied") {
      oldRoom.status = "available";
    }

    // Save the updated old room document
    await oldRoom.save();

    const resident = await User.findById(residentId);
    const newRoom = await Room.findById(newRoomId);
    // Increase the no of occupants to 1 for occupants field in the new room document
    newRoom.occupants += 1;

    // Check whether the no of occupants is equal to the capacity field in the document, if it is equal, then update the status to unavailable
    if (newRoom.occupants === newRoom.capacity) {
      newRoom.status = "occupied";
    }

    // Save the updated new room document
    await newRoom.save();

    // Update the room field in the user document
    resident.roomNo = newRoom.roomNo;
    await resident.save();

    res.status(200).json({ status: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Fetch Vacating Letters
const getVacatingLetters = async (req, res) => {
  try {
    const vacatingLetters = await VacatingLetter.find({}).populate({
      path: "user",
      select: "-password",
    });

    res.status(200).json({ vacatingLetters });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
  getVacatingLetters,
};
