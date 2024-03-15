const User = require("../model/Auth/userModel");
const DriverDetail = require("../model/Auth/driverDetail");
const Booking = require("../model/booking/booking");
const settleBooking = require("../model/booking/settleBooking");
const driverSettleBooking = require("../model/booking/driverSettleBooking");
const driverVehicleCategory = require("../model/Vehical/driverVehicalCategory");
const bookingPayment = require("../model/Auth/bookingPayment");
const commission = require("../model/Auth/commission");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const randomatic = require("randomatic");
const JWTkey = "node5flyweis";
const bcrypt = require("bcryptjs");
exports.socialLogin = async (req, res) => {
        try {
                const { email, mobileNumber, name, loginType } = req.body;
                let user = await User.findOne({ $or: [{ email: email }], role: "driver", });
                if (user) {
                        const token = jwt.sign({ id: user._id }, JWTkey);
                        return res.status(200).json({ status: 200, msg: "Login successful", userId: user._id, token: token, });
                } else {
                        req.body.role = "driver";
                        const newUser = await User.create(req.body);
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
                        const token = jwt.sign({ id: user._id }, 'node5flyweis', { expiresIn: '1020d' });
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
                const user = await User.findById(req.user.id).populate('driverVehicleCategory');
                if (!user) {
                        return res.status(404).json({ error: "User not found" });
                } else {
                        if (user.type == (null || undefined)) {
                                return res.status(401).json({ status: 401, message: "First add vehicleCategory", data: {} });
                        }
                        if (user.type == "vehicleAmbulance") {
                                const latestBookings = await Booking.find({ status: "pending", vehicleAmbulance: user.driverVehicleCategory.vehicleAmbulance }).populate('userId car').sort({ createdAt: -1 });
                                if (latestBookings.length == 0) {
                                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                                }
                                return res.status(200).json({ status: 200, message: "Data found", data: latestBookings });
                        }
                        if (user.type == "superCar") {
                                const latestBookings = await Booking.find({ status: "pending", superCar: user.driverVehicleCategory.superCar }).populate('userId car').sort({ createdAt: -1 });
                                if (latestBookings.length == 0) {
                                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                                }
                                return res.status(200).json({ status: 200, message: "Data found", data: latestBookings });
                        }
                        if (user.type == "vehicle") {
                                const latestBookings = await Booking.find({ status: "pending", car: user.driverVehicleCategory.vehicle }).populate('userId car').sort({ createdAt: -1 });
                                if (latestBookings.length == 0) {
                                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                                }
                                return res.status(200).json({ status: 200, message: "Data found", data: latestBookings });
                        }
                }
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
exports.bookingPayment = async (req, res) => {
        try {
                const booking = await Booking.findOne({ _id: req.params.bookingId, }).populate({ path: 'userId', select: 'mobileNumber' });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                const findCommission = await commission.findOne({ isActive: true })
                if (findCommission) {
                        if (req.body.paymentMode == "CASH") {
                                let adminCommission, driverCommission;
                                if (findCommission.disCountType == "FLAT") {
                                        adminCommission = findCommission.adminCommission;
                                        driverCommission = booking.totalPrice - adminCommission;
                                } else if (findCommission.disCountType == "PERCENTAGE") {
                                        adminCommission = (findCommission.adminCommission * booking.totalPrice) / 100;
                                        driverCommission = (findCommission.driverCommission * booking.totalPrice) / 100;
                                }
                                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { isCommission: true, paymentMode: "cash" } }, { new: true });
                                if (updatedbooking) {
                                        const user = await User.findById({ _id: booking.driver });
                                        if (user) {
                                                let updateCash = await User.findByIdAndUpdate({ _id: user._id }, { $set: { adminCash: user.adminCash + adminCommission } }, { new: true })
                                        }
                                        let id = await reffralCode()
                                        let obj = {
                                                user: booking.userId,
                                                driverId: booking.driver,
                                                bookingId: booking._id,
                                                id: id,
                                                amount: booking.totalPrice,
                                                adminAmount: adminCommission,
                                                driverAmount: driverCommission,
                                                paymentMode: req.body.paymentMode,
                                                transactionStatus: "SUCCESS",
                                        }
                                        const newUser = await bookingPayment.create(obj);
                                        return res.status(200).json({ status: 200, message: "User booking complete successfully", data: updatedbooking, });
                                }
                        } else {
                                let adminCommission, driverCommission;
                                if (findCommission.disCountType == "FLAT") {
                                        adminCommission = findCommission.adminCommission;
                                        driverCommission = booking.totalPrice - adminCommission;
                                } else if (findCommission.disCountType == "PERCENTAGE") {
                                        adminCommission = (findCommission.adminCommission * booking.totalPrice) / 100;
                                        driverCommission = (findCommission.driverCommission * booking.totalPrice) / 100;
                                }
                                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { isCommission: true, paymentMode: "upi" } }, { new: true });
                                if (updatedbooking) {
                                        const user = await User.findById({ _id: booking.driver });
                                        if (user) {
                                                let updateCash = await User.findByIdAndUpdate({ _id: user._id }, { $set: { wallet: user.wallet + driverCommission } }, { new: true })
                                        }
                                        let id = await reffralCode()
                                        let obj = {
                                                user: booking.userId,
                                                driverId: booking.driver,
                                                bookingId: booking._id,
                                                id: id,
                                                amount: booking.totalPrice,
                                                adminAmount: adminCommission,
                                                driverAmount: driverCommission,
                                                paymentMode: req.body.paymentMode,
                                                transactionStatus: "SUCCESS",
                                        }
                                        const newUser = await bookingPayment.create(obj);
                                        return res.status(200).json({ status: 200, message: "User booking complete successfully", data: updatedbooking, });
                                }
                        }
                } else {
                        if (req.body.paymentMode == "CASH") {
                                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { isCommission: false, paymentMode: "cash" } }, { new: true });
                                if (updatedbooking) {
                                        let id = await reffralCode();
                                        let obj = {
                                                user: booking.userId,
                                                driverId: booking.driver,
                                                bookingId: booking._id,
                                                id: id,
                                                amount: booking.totalPrice,
                                                paymentMode: req.body.paymentMode,
                                                transactionStatus: "SUCCESS",
                                        }
                                        const newUser = await bookingPayment.create(obj);
                                        return res.status(200).json({ status: 200, message: "User booking complete successfully", data: updatedbooking, });
                                }
                        } else {
                                const updatedbooking = await Booking.findByIdAndUpdate({ _id: booking._id }, { $set: { isCommission: false, paymentMode: "upi" } }, { new: true });
                                if (updatedbooking) {
                                        let id = await reffralCode();
                                        let obj = {
                                                user: booking.userId,
                                                driverId: booking.driver,
                                                bookingId: booking._id,
                                                id: id,
                                                amount: booking.totalPrice,
                                                paymentMode: req.body.paymentMode,
                                                transactionStatus: "SUCCESS",
                                        }
                                        const newUser = await bookingPayment.create(obj);
                                        return res.status(200).json({ status: 200, message: "User booking complete successfully", data: updatedbooking, });
                                }
                        }
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getMyEarning = async (req, res) => {
        try {
                if (req.query.type == "UPI") {
                        const acceptedOrders = await bookingPayment.find({ driverId: req.user.id, paymentMode: "WALLET" }).populate("user");
                        if (acceptedOrders.length == 0) {
                                return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                        }
                        return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
                }
                if (req.query.type == "CASH") {
                        const acceptedOrders = await bookingPayment.find({ driverId: req.user.id, paymentMode: "CASH" }).populate("user");
                        if (acceptedOrders.length == 0) {
                                return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                        }
                        return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getMyEarningById = async (req, res) => {
        try {
                const acceptedOrders = await bookingPayment.findById({ _id: req.params.id }).populate("user");
                if (!acceptedOrders) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
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
                const acceptedOrders = await Booking.find({ driver: req.user.id, status: "accepted", }).populate("userId car driver")//Assuming you want to populate user details
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
                const booking = await driverSettleBooking.find({ driver: req.user.id }).populate({ path: 'booking', populate: [{ path: 'user' }, { path: 'driver', populate: { path: 'driverVehicleCategory' } }] });
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
                const findPrivacy = await settleBooking.findById({ _id: req.params.bookingId }).populate('user driver');
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
exports.getDriverVehicleCategory = async (req, res) => {
        try {
                const data = await driverVehicleCategory.find();
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No vehicle data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.sendOtpToUserSettleBooking = async (req, res) => {
        try {
                const booking = await settleBooking.findOne({ _id: req.params.bookingId, });
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
exports.startSettleBooking = async (req, res) => {
        try {
                const { otp } = req.body;
                const booking = await settleBooking.findOne({ _id: req.params.bookingId, driver: req.user.id, });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                if (booking.otp === otp) {
                        if (booking.morningStatus == "pending") {
                                let dailyStatus = {
                                        date: new Date(Date.now()),
                                        morningStatus: "pick",
                                };
                                const booking = await settleBooking.findByIdAndUpdate({ _id: req.params.bookingId }, { $push: { dailyStatus: dailyStatus }, $set: { morningStatus: "pick" } }, { new: true });
                                return res.status(200).json({ status: 200, message: "Booking started successfully", data: booking });
                        }
                        if ((booking.eveningStatus == "pending") && (booking.morningStatus == "drop")) {
                                let dailyStatus = {
                                        date: new Date(Date.now()),
                                        eveningStatus: "pick",
                                };
                                const booking = await settleBooking.findByIdAndUpdate({ _id: req.params.bookingId }, { $push: { dailyStatus: dailyStatus }, $set: { eveningStatus: "pick" } }, { new: true });
                                return res.status(200).json({ status: 200, message: "Booking started successfully", data: booking });
                        }
                } else {
                        return res.status(400).json({ status: 400, message: "Invalid OTP", data: {} });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.stopSettleBooking = async (req, res) => {
        try {
                const booking = await settleBooking.findOne({ _id: req.params.bookingId, driver: req.user.id, });
                if (!booking) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                if (booking.morningStatus == "pick") {
                        let dailyStatus = {
                                date: new Date(Date.now()),
                                morningStatus: "drop",
                        };
                        const booking = await settleBooking.findByIdAndUpdate({ _id: req.params.bookingId }, { $push: { dailyStatus: dailyStatus }, $set: { morningStatus: "drop" } }, { new: true });
                        return res.status(200).json({ status: 200, message: "Booking stop successfully", data: booking });
                }
                if ((booking.eveningStatus == "pick") && (booking.morningStatus == "drop")) {
                        let dailyStatus = {
                                date: new Date(Date.now()),
                                eveningStatus: "drop",
                        };
                        const booking = await settleBooking.findByIdAndUpdate({ _id: req.params.bookingId }, { $push: { dailyStatus: dailyStatus }, $set: { eveningStatus: "drop" } }, { new: true });
                        return res.status(200).json({ status: 200, message: "Booking stop successfully", data: booking });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};