const User = require("../model/Auth/userModel");
const DriverDetail = require("../model/Auth/driverDetail");
const Booking = require("../model/booking/booking");
const settleBooking = require("../model/booking/settleBooking");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const randomatic = require("randomatic");
const JWTkey = "node5flyweis";
const bcrypt = require("bcryptjs");
exports.socialLogin = async (req, res) => {
        try {
                const { email, mobileNumber, name, loginType } = req.body;
                let user = await User.findOne({ $or: [{ email: email }, { mobileNumber: mobileNumber }], role: "driver", });
                if (user) {
                        const token = jwt.sign({ id: user._id }, JWTkey);
                        return res.status(200).json({ status: 200, msg: "Login successful", userId: user._id, token: token, });
                } else {
                        const newUser = await User.create({ name, mobileNumber, email, role: "driver", });
                        if (newUser) {
                                const token = jwt.sign({ id: newUser._id }, JWTkey);
                                return res.status(201).json({ status: 201, msg: "User registered and logged in successfully", userId: newUser._id, token: token, });
                        }
                }
        } catch (err) {
                console.error(err); // Log the error for debugging
                return res.status(500).json({ status: 500, msg: "Internal server error" });
        }
};
exports.registerDriver = async (req, res) => {
        try {
                const mobileNumber = req.body.mobileNumber;
                const altMobileNumber = req.body.altMobileNumber;
                const email = req.body.email;
                const name = req.body.name;
                const existingUser = await User.findOne({ mobileNumber, role: "driver" });
                if (existingUser) {
                        return res.status(400).json({ error: "User with this mobile number already exists" });
                }
                const otp = randomatic("0", 4);
                const user = await User.findOneAndUpdate({ mobileNumber, role: "driver", altMobileNumber, email, name }, { otp }, { new: true, upsert: true });
                return res.json({ message: "OTP sent successfully", user });
        } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" });
        }
};
exports.verifyOtpLogin = async (req, res) => {
        try {
                const mobileNumber = req.body.mobileNumber;
                const otp = req.body.otp;
                const user = await User.findOne({ mobileNumber, role: "driver" });
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
exports.loginDriver = async (req, res) => {
        try {
                const { mobileNumber } = req.body;
                let user = await User.findOne({ mobileNumber, role: "driver" });
                if (!user) {
                        const otp = randomatic("0", 4);
                        user = new User({
                                mobileNumber,
                                role: "driver",
                                otp,
                        });
                        await user.save();
                        return res.json({ message: "OTP generated and sent to the user", user });
                } else {
                        const otp = randomatic("0", 4); // Generate a new 4-digit OTP
                        user.otp = otp;
                        user.isVerified = false;
                        await user.save();
                        return res.json({ message: "New OTP generated and sent to the user", user, });
                }
        } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" });
        }
};
exports.resendOTP = async (req, res) => {
        try {
                const { mobileNumber } = req.body;
                const user = await User.findOne({ mobileNumber, role: "driver" });
                if (!user) {
                        return res.status(404).json({ message: "User not found" });
                }
                const newOTP = randomatic("0", 4);
                user.otp = newOTP;
                user.isVerified = false;
                await user.save();
                return res.json({ message: "New OTP generated and sent to the user", user, });
        } catch (error) {
                console.log(error);
                return res.status(500).json({ error: "Internal Server Error" });
        }
};
exports.getDriverDetails = async (req, res) => {
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
exports.updateDriverProfile = async (req, res) => {
        try {
                const { name, email, address } = req.body;
                const user = await User.findById(req.user.id);
                if (!user) {
                        return res.status(404).json({ error: "User not found" });
                }
                if (name) {
                        user.name = name;
                } else {
                        user.name = user.name;
                }
                if (email) {
                        user.email = email;
                } else {
                        user.email = user.email;
                }
                if (address) {
                        user.address = address;
                } else {
                        user.address = user.address;
                }
                if (req.file) {
                        user.profilePicture = req.file.path;
                } else {
                        user.profilePicture = user.profilePicture;
                }
                await user.save();
                return res.json({ message: "User profile updated successfully", user });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
        }
};
exports.documentDriverDetail = async (req, res) => {
        try {
                let findData = await DriverDetail.findOne({ driver: req.user._id });
                if (findData) {
                        const data = {
                                driver: req.user._id,
                                city: req.body.city,
                                vehicle: req.body.vehicle,
                                ...req.body,
                        };
                        console.log("Processed Data:", data);
                        const detail = await DriverDetail.findOneAndUpdate({ driver: req.user._id }, { $set: data }, { new: true });
                        return res.status(200).json({ status: 200, message: "Driver Details added successfully.", data: detail, });
                } else {
                        const data = {
                                driver: req.user._id,
                                city: req.body.city,
                                vehicle: req.body.vehicle,
                                ...req.body,
                        };
                        console.log("Processed Data:", data);
                        const detail = await DriverDetail.create(data);
                        return res.status(200).json({ status: 200, message: "Driver Details added successfully.", data: detail, });
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
                const { driverId } = req.params;
                const driverDetails = await DriverDetail.findOne({ driver: driverId }).populate("driver city vehicle");
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
exports.updateLocation = async (req, res) => {
        try {
                const { coordinates } = req.body;
                const user = await User.findById(req.user.id);
                if (!user) {
                        return res.status(404).json({ error: "User not found" });
                }
                user.location = { type: "Point", coordinates: coordinates || [0, 0], };
                await user.save();
                return res.json({ message: "User profile updated successfully", user });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
        }
};
exports.latestBooking = async (req, res) => {
        try {
                const latestBookings = await Booking.find({ status: "pending", }).sort({ createdAt: -1 });
                if (latestBookings.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: latestBookings });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.acceptBooking = async (req, res) => {
        try {
                const booking = await Booking.findOne({ _id: req.params.bookingId, }).populate({ path: 'userId', select: 'mobileNumber' });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { driver: req.user.id, status: "accepted" } }, { new: true });
                return res.status(200).json({ status: 200, message: "User booking accepted successfully", data: updatedbooking, });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.stopBooking = async (req, res) => {
        try {
                const booking = await Booking.findOne({ _id: req.params.bookingId, }).populate({ path: 'userId', select: 'mobileNumber' });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { status: "complete" } }, { new: true });
                return res.status(200).json({ status: 200, message: "User booking complete successfully", data: updatedbooking, });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.sendOtpToUserBooking = async (req, res) => {
        try {
                const booking = await Booking.findOne({ _id: req.params.bookingId, }).populate({ path: 'userId', select: 'mobileNumber' });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                const newOTP = randomatic("0", 4);
                booking.otp = newOTP;
                await booking.save();
                return res.status(200).json({ status: 200, message: "Otp send to user successfully", data: booking });
        } catch (error) {
                console.log(error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.startBooking = async (req, res) => {
        try {
                const { otp } = req.body;
                const booking = await Booking.findOne({ _id: req.params.bookingId, driver: req.user.id, });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                if (booking.otp === otp) {
                        booking.otpVerifiedAt = new Date();
                        await booking.save();
                        return res.status(200).json({ status: 200, message: "Booking started successfully", data: booking });
                } else {
                        return res.status(400).json({ status: 400, message: "Invalid OTP", data: {} });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getBookingByDate = async (req, res) => {
        try {
                const selectedDate = new Date(req.params.selectedDate);
                const startDate = new Date(selectedDate.setHours(0, 0, 0, 0));
                const endDate = new Date(selectedDate.setHours(23, 59, 59, 999));
                const orders = await Booking.find({ otpVerifiedAt: { $gte: startDate, $lte: endDate, }, });
                if (orders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: orders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.myBooking = async (req, res) => {
        try {
                const acceptedOrders = await Booking.find({ driver: req.user.id, status: "accepted", }).populate("userId").populate("driver"); // Assuming you want to populate user details
                if (acceptedOrders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getSettleBooking = async (req, res) => {
        try {
                const booking = await settleBooking.find({ driver: req.user.id }).populate('user driver');
                if (booking.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Booking request found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'Booking request not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getSettleBookingById = async (req, res) => {
        try {
                const findPrivacy = await settleBooking.findById({ _id: req.params.id }).populate('user driver');
                if (findPrivacy) {
                        return res.status(200).json({ status: 200, message: 'Data found for the specified type', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified type', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};