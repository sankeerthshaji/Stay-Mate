const Admin = require("../models/admin");
const User = require("../models/user");
const Room = require("../models/room");
const RoomType = require("../models/roomType");
const Menu = require("../models/menu");
const MenuItem = require("../models/menuItem");
const jwt = require("jsonwebtoken");
const validator = require("validator");

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

// Fetch user details
const fetchUserDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userDetails = await User.findById(id);
    res.status(200).json({ userDetails: userDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel menu
const fetchHostelMenu = async (req, res) => {
  try {
    const hostelMenu = await Menu.find({})
      .populate("breakfast")
      .populate("lunch")
      .populate("snacks")
      .populate("dinner");
    res.status(200).json({ hostelMenu: hostelMenu });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetching menu details
const fetchMenuDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const menuDetails = await Menu.findById(id)
      .populate("breakfast")
      .populate("lunch")
      .populate("snacks")
      .populate("dinner");
    res.status(200).json({ menuDetails: menuDetails });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Update menu details
const updateMenuDetails = async (req, res) => {
  try {
    const { menuDetails } = req.body;

    // Validate menu item names
    if (
      !menuDetails.breakfast.description ||
      !menuDetails.lunch.description ||
      !menuDetails.snacks.description ||
      !menuDetails.dinner.description
    ) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (
      !validator.isLength(menuDetails.breakfast.description, {
        min: 1,
        max: 100,
      }) ||
      !validator.isLength(menuDetails.lunch.description, { min: 1, max: 100 }) ||
      !validator.isLength(menuDetails.snacks.description, {
        min: 1,
        max: 100,
      }) ||
      !validator.isLength(menuDetails.dinner.description, { min: 1, max: 100 })
    ) {
      return res.status(400).json({
        message:
          "Menu item must be 1-100 characters long",
      });
    }

    // if (
    //   !validator.isAlpha(menuDetails.breakfast.description) ||
    //   !validator.isAlpha(menuDetails.lunch.description) ||
    //   !validator.isAlpha(menuDetails.snacks.description) ||
    //   !validator.isAlpha(menuDetails.dinner.description)
    // ) {
    //   return res.status(400).json({
    //     message: "Menu item must only contain alphabets",
    //   });
    // }

    // update breakfast description
    await MenuItem.findByIdAndUpdate(menuDetails.breakfast._id, {
      description: menuDetails.breakfast.description,
    });

    // update lunch description
    await MenuItem.findByIdAndUpdate(menuDetails.lunch._id, {
      description: menuDetails.lunch.description,
    });

    // update snacks description
    await MenuItem.findByIdAndUpdate(menuDetails.snacks._id, {
      description: menuDetails.snacks.description,
    });

    // update dinner description
    await MenuItem.findByIdAndUpdate(menuDetails.dinner._id, {
      description: menuDetails.dinner.description,
    });

    res.status(200).json({ message: "Menu updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Fetching hostel rooms
const fetchRooms = async (req, res) => {
  try {
    const rooms = await Room.find({})
      .populate("roomType")
    res.status(200).json({ rooms: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
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
};
