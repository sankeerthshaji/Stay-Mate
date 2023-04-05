const Admin = require("../models/admin");
const User = require("../models/user");
const Room = require("../models/room")
const RoomType = require("../models/roomType")
const jwt = require("jsonwebtoken");

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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const fetchUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.log(error);
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
    console.log(error);
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
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

//Remove user as resident
const removeAsResident = async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(userId);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "resident") {
      return res.status(400).json({ message: "User is not a resident" });
    }

    const room = await Room.findOne({ roomNo: user.roomNo });

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    room.occupants -= 1;

    if (room.occupants < room.capacity && room.status === "occupied") {
      room.status = "available";
    }

    const roomType = await RoomType.findById(room.roomType);

    if (!roomType) {
      return res.status(404).json({ message: "Room type not found" });
    }

    if (roomType.status === "unavailable") {
      roomType.status = "available";
      await roomType.save();
    }

    user.role = "guest";
    user.roomNo = undefined;
    await user.save();
    await room.save();

    return res.json({ message: "User removed as resident" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
module.exports = {
  loginAdmin,
  fetchUsers,
  blockUser,
  unblockUser,
  removeAsResident,
};
