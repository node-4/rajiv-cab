const User = require("../model/Auth/userModel");
const randomatic = require("randomatic");
const jwt = require("jsonwebtoken");

exports.registerVendor = async (req, res) => {
    try {
        const { mobileNumber, ...data } = req.body;
        const existingUser = await User.findOne({ mobileNumber, role: "vendor" });
        if (existingUser) {
            return res.status(400).json({ error: "User with this mobile number already exists" });
        }
        const otp = randomatic("0", 4);
        const user = await User.findOneAndUpdate({ mobileNumber, role: "vendor" }, { ...data, otp }, { new: true, upsert: true });
        return res.json({ message: "OTP sent successfully", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.verifyOtpVendor = async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber;
        const otp = req.body.otp;
        const user = await User.findOne({ mobileNumber, role: "vendor" });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }
        user.isVerified = true;
        await user.save();
        if (user.isVerified) {
            const token = jwt.sign({ id: user._id }, "node5flyweis");
            return res.json({ message: "OTP verification successful.", token, user });
        } else {
            return res.status(401).json({ error: "User not verified" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.loginVendor = async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        let user = await User.findOne({ mobileNumber });
        if (!user) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        const otp = randomatic("0", 4);
        console.log(otp);
        user.otp = otp;
        user.isVerified = false;
        await user.save();
        return res.json({ message: "New OTP generated and sent to the user", user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
exports.getVendorDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        } else {
            return res.status(200).send({ status: 200, message: "get profile ", data: user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, address } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.name = name;
        user.email = email;
        user.address = address;
        await user.save();
        return res.json({ message: "User profile updated successfully", user });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
};
