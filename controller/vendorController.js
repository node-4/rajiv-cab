const User = require("../model/Auth/userModel");
const randomatic = require("randomatic");
const jwt = require("jsonwebtoken");
const DriverDetail = require("../model/Auth/driverDetail");

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
exports.documentDriverDetail = async (req, res) => {
    try {
        const user = await User.findById({ _id: req.user._id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        req.body.driver = req.user._id;
        const data12 = await driverVehicleCategory.findById({ _id: req.body.driverVehicleCategory });
        if (!data12) {
            return res.status(404).json({ error: "DriverVehicle Category not found" });
        }
        let findData = await DriverDetail.findOne({ driver: req.user._id });
        if (findData) {
            const data = {
                ...req.body,
            };
            console.log("Processed Data:", data);
            const detail = await DriverDetail.findOneAndUpdate({ driver: req.user._id }, { $set: data }, { new: true });
            if (detail) {
                user.driverDocument = detail._id;
                user.driverVehicleCategory = req.body.driverVehicleCategory;
                user.type = data12.type;
                await user.save();
                return res.status(200).json({ status: 200, message: "Driver Details added successfully.", data: detail, });
            }
        } else {
            const data = {
                ...req.body,
            };
            console.log("Processed Data:", data);
            const detail = await DriverDetail.create(data);
            if (detail) {
                user.driverDocument = detail._id;
                user.driverVehicleCategory = req.body.driverVehicleCategory;
                user.type = data12.type;
                await user.save();
                return res.status(200).json({ status: 200, message: "Driver Details added successfully.", data: detail, });
            }
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: error, });
    }
};
exports.driverImage = async (req, res) => {
    try {
        const id = req.params.id;
        console.log(id);
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);
        let findData = await DriverDetail.findOne({ driver: id });
        if (!findData) {
            return res.status(404).json({ error: "DriverDetail not found" });
        }
        const updatedDetails = {
            interior: req.fileUrls.interior,
            exterior: req.fileUrls.exterior,
            permit: req.fileUrls.permit,
            fitness: req.fileUrls.fitness,
            insurance: req.fileUrls.insurance,
            aadharCard: req.fileUrls.aadharCard,
            drivinglicense: req.fileUrls.drivinglicense,
            cancelCheck: req.fileUrls.cancelCheck,
            bankStatement: req.fileUrls.bankStatement,
            rc: req.fileUrls.rc
        };
        const updatedDriver = await DriverDetail.findOneAndUpdate({ driver: id }, { $set: updatedDetails }, { new: true });
        if (updatedDriver) {
            return res.status(200).json({ message: "Details updated successfully.", status: 200, data: updatedDriver, });
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
    }
};
exports.allDriverDetail = async (req, res) => {
    try {
        const { vendorId } = req.params;
        const driverDetails = await DriverDetail.findOne({ driver: vendorId }).populate("driver city driverVehicleCategory");
        console.log(driverDetails);
        if (!driverDetails) {
            return res.status(404).json({ status: 404, message: "Driver details not found" });
        }
        return res.status(200).json({ status: 200, message: "Driver details found", data: driverDetails });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: error, });
    }
}