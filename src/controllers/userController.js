const bcrypt = require("bcryptjs");
const User = require("../models/User");

// @route   GET api/user/profile
// @desc    Get user profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   PUT api/user/profile
// @desc    Update user profile (name, mobile, gender)
// @access  Private
exports.updateProfile = async (req, res) => {
  const { name, phone, gender } = req.body;

  try {
    // Build profile object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (phone) profileFields.phone = phone;
    if (gender) {
      if (!["male", "female", "other", "prefer_not_to_say"].includes(gender)) {
        return res.status(400).json({ msg: "Invalid gender value" });
      }
      profileFields.gender = gender;
    }

    let user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Update user
    user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: profileFields },
      { new: true }
    ).select("-password");

    res.json({
      msg: "Profile updated successfully",
      user,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// @route   PUT api/user/change-password
// @desc    Change user password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    // Validate input
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Please provide current and new password" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "New password must be at least 6 characters long" });
    }

    // Get user with password
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    user.password = hashedPassword;
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
