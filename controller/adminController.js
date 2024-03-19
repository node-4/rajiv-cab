let Country = require('country-state-city').Country;
let State = require('country-state-city').State;
let City = require('country-state-city').City;
const bcrypt = require("bcryptjs");
const express = require("express");
const otpGenerator = require("otp-generator");
const jwt = require("jsonwebtoken");
const router = express.Router();
const User = require("../model/Auth/userModel");
const DriverDetail = require("../model/Auth/driverDetail");
const category = require('../model/Category/genderCategory')
const serviceCategory = require('../model/Category/serviceCategory');
const Banner = require('../model/Banner/bannerModel');
const privacy = require('../model/static/termsModel')
const dailyPricing = require("../model/pricing/dailyPricing");
const hourlyModel = require('../model/pricing/hourlyModel');
const outStationPricing = require('../model/pricing/outStationPricing');
const basePricing = require("../model/pricing/basePricing");
const notify = require('../model/Auth/notifyModel');
const cancel = require('../model/static/cancelModel')
const superCarPricing = require('../model/pricing/superCarPricing');
const superCar = require('../model/Vehical/superCar')
const vehicle = require('../model/Vehical/vehicleModel');
const vehicleAmbulance = require('../model/Vehical/vehicleAmbulance');
const driverVehicalCategory = require('../model/Vehical/driverVehicalCategory');
const cityModel = require('../model/cityState/cityModel')
const stateModel = require('../model/cityState/state')
const commission = require('../model/Auth/commission')
const settleBooking = require("../model/booking/settleBooking");
const driverSettleBooking = require("../model/booking/driverSettleBooking");
const bookingPayment = require("../model/Auth/bookingPayment");
const transactionModel = require("../model/Auth/transactionModel");
const Booking = require("../model/booking/booking");
const payoutTransaction = require("../model/Auth/payoutTransaction");
const sosRequest = require("../model/SOS/sosRequest");
const appSetting = require("../model/settin/appSetting");
const emergencyDetails = require("../model/settin/emergencyDetails");
const mapSetting = require("../model/settin/mapSetting");
const referralSetting = require("../model/settin/referralSetting");
const walletSetting = require("../model/settin/walletSetting");

exports.getPrivileges = async (req, res) => {
        try {
                const user = await User.find({ role: ["admin" || "superAdmin"] });
                if (user.length == 0) {
                        return res.status(404).send({ status: 404, message: "Privileges not found", data: {}, });
                } else {
                        return res.status(200).send({ status: 200, message: "Get Privileges data found", data: user, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.getAllAdmin = async (req, res) => {
        try {
                const user = await User.find({ role: "admin" });
                if (user.length == 0) {
                        return res.status(404).send({ status: 404, message: "Admin not found", data: {}, });
                } else {
                        return res.status(200).send({ status: 200, message: "Get admin data found", data: user, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
}
exports.RegisterAdmin = async (req, res, next) => {
        try {
                const { email, password, role } = req.body;
                const existingUser = await User.findOne({ email, role: role });
                if (existingUser) {
                        return res.status(409).json({ status: 409, message: "admin already exists", data: {} });
                }
                const hashedPassword = await bcrypt.hash(password, 8);
                const newUser = await User.create({ email, password: hashedPassword, role: role, });
                const token = jwt.sign({ id: newUser._id }, "node5flyweis");
                const responseData = { _id: newUser._id, newUser, token, };
                return res.status(201).json({ status: 201, message: "ADMIN registered successfully", data: responseData, });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: "Server error" + error.message });
        }
};
exports.loginAdmin = async (req, res) => {
        try {
                const { email, password, role } = req.body;
                const user = await User.findOne({ email: email, role: role });
                console.log(user);
                if (!user) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                }
                const isValidPassword = await bcrypt.compare(password, user.password);
                if (!isValidPassword) {
                        return res.status(401).send({ message: "Wrong password" });
                }
                const token = jwt.sign({ id: user._id }, "node5flyweis");
                let obj = { _id: user._id, token: token, user, };
                return res.status(200).send({ status: 200, message: "admin logged in successfully", data: obj, });
        } catch (error) {
                console.error(error);
                return res.status(500).send({ status: 500, message: "Server error" + error.message });
        }
};
exports.updateAdminProfile = async (req, res) => {
        try {
                const { name, email, address, gender, birthday, mobileNumber } = req.body;
                let image;
                if (req.file) {
                        image = req.file.path;
                }
                const user = await User.findById(req.user.id);
                if (!user) {
                        return res.status(404).json({ error: "User not found" });
                }
                user.name = name;
                user.email = email;
                user.address = address;
                user.profilePicture = image;
                user.gender = gender;
                user.birthday = birthday;
                user.mobileNumber = mobileNumber;
                await user.save();
                return res.json({ message: "User profile updated successfully", user });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: "Internal server error" });
        }
};
exports.getAdminDetails = async (req, res) => {
        try {
                const user = await User.findOne({ _id: req.user.id, role: "admin" });
                if (!user) {
                        return res.status(404).send({ status: 404, message: "Admin not found", data: {}, });
                } else {
                        return res.status(200).send({ status: 200, message: "Get admin profile", data: user, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.addCategory = async (req, res) => {
        try {
                let findData = await category.findOne({ category: req.body.category });
                if (findData) {
                        return res.status(409).json({ status: 409, message: "category already exit ", details: findData })
                } else {
                        const categoryData = await category.create({ category: req.body.category, isDiscount: req.body.isDiscount, discountPer: req.body.discountPer });
                        return res.status(200).json({ status: 200, message: "category Added ", details: categoryData })
                }
        }
        catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.getCategory = async (req, res) => {
        try {
                const data = await category.find();
                if (data.length == 0) {
                        return res.status(404).json({ status: 404, message: "category not found ", category: {} })
                } else {
                        return res.status(200).json({ status: 200, message: "category found ", category: data })
                }
        } catch (err) {
                return res.status(400).send({ mesage: err.mesage });
        }
}
exports.getCategoryById = async (req, res) => {
        try {
                const findPrivacy = await category.findById({ _id: req.params.id });
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
exports.updateCategory = async (req, res) => {
        try {
                const data = await category.findById({ _id: req.params.id });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "category not found ", category: {} })
                }
                let obj = {
                        category: req.body.category || data.category,
                        isDiscount: req.body.isDiscount || data.isDiscount,
                        discountPer: req.body.discountPer || data.discountPer,
                }
                const UpdatedCategory = await category.findOneAndUpdate({ _id: data._id }, { $set: obj }, { new: true })
                return res.status(200).json({ status: 200, message: "category Update ", category: UpdatedCategory })
        } catch (err) {
                console.log(err)
                return res.status(401).json({ mesage: err.mesage })
        }
}
exports.deleteCategory = async (req, res) => {
        try {
                const data = await category.findById({ _id: req.params.id });
                if (!data) {
                        return res.status(404).json({ status: 404, message: "category not found ", category: {} })
                }
                await category.deleteOne({ _id: data._id });
                return res.status(200).send({ message: "category deleted " })
        } catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.allVendor = async (req, res) => {
        try {
                const vendors = await User.find({ role: "vendor" });
                if (vendors.length == 0) {
                        return res.status(404).json({ status: 404, message: "vendors not found ", category: {} })
                } else {
                        return res.status(200).json({ status: 200, message: "vendors found ", category: vendors })
                }
        } catch (error) {
                console.error("Error fetching vendors:", error);
                return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
};
exports.allDriver = async (req, res) => {
        try {
                const vendors = await User.find({ role: "driver" }).populate('driverVehicleCategory driverDocument');;
                if (vendors.length == 0) {
                        return res.status(404).json({ status: 404, message: "driver not found ", category: {} })
                } else {
                        return res.status(200).json({ status: 200, message: "driver found ", category: vendors })
                }
        } catch (error) {
                console.error("Error fetching driver:", error);
                return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
};
exports.allUser = async (req, res) => {
        try {
                const vendors = await User.find({ role: "user" });
                if (vendors.length == 0) {
                        return res.status(404).json({ status: 404, message: "user not found ", category: {} })
                } else {
                        return res.status(200).json({ status: 200, message: "user found ", category: vendors })
                }
        } catch (error) {
                console.error("Error fetching user:", error);
                return res.status(500).json({ success: false, error: "Internal Server Error" });
        }
};
exports.getUserById = async (req, res) => {
        try {
                const findPrivacy = await User.findById({ _id: req.params.id }).populate('driverVehicleCategory driverDocument');
                if (findPrivacy) {
                        return res.status(200).json({ status: 200, message: 'Data found.', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteDriver = async (req, res) => {
        try {
                const driverId = req.params.id;
                const existingDriver = await User.findById({ _id: req.params.id });
                if (!existingDriver) {
                        return res.status(404).json({ status: 404, message: "driver not found ", category: {} })
                }
                let findUser = await User.findByIdAndDelete(driverId);
                return res.status(200).json({ status: 200, message: "Driver deleted successfully ", category: findUser })
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.blockDriver = async (req, res) => {
        try {
                const driverId = req.params.id;
                const existingDriver = await User.findById(driverId);
                if (!existingDriver) {
                        return res.status(404).json({ status: 404, message: "driver not found ", category: {} })
                }
                existingDriver.isBlock = true;
                await existingDriver.save();
                return res.json({ status: 200, message: "Driver is blocked successfully" });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.driverKycAcceptRejectHold = async (req, res) => {
        try {
                const driverId = req.params.id;
                const existingDriver = await User.findById(driverId);
                if (!existingDriver) {
                        return res.status(404).json({ status: 404, message: "driver not found ", category: {} })
                }
                existingDriver.status = req.body.status;
                await existingDriver.save();
                return res.json({ status: 200, message: "Driver is blocked successfully" });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.unblockDriver = async (req, res) => {
        try {
                const driverId = req.params.id;
                const existingDriver = await User.findById(driverId);
                if (!existingDriver) {
                        return res.status(404).json({ status: 404, message: "driver not found ", category: {} })
                }
                existingDriver.isBlock = false;
                await existingDriver.save();
                return res.json({ status: 200, message: "Driver is Unblocked successfully" });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ message: "Server error" });
        }
};
exports.AddBanner = async (req, res) => {
        try {
                let findBanner = await Banner.findOne({ name: req.body.name });
                if (findBanner) {
                        return res.status(409).json({ message: "Banner already exit.", status: 404, data: {} });
                } else {
                        let fileUrl;
                        if (req.file) {
                                fileUrl = req.file ? req.file.path : "";
                        }
                        const data = { name: req.body.name, type: req.body.type, image: fileUrl };
                        const banner = await Banner.create(data);
                        return res.status(200).json({ message: "Banner add successfully.", status: 200, data: banner });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getBannerByType = async (req, res) => {
        try {
                const { type } = req.params;
                const banners = await Banner.find({ type });
                if (banners.length == 0) {
                        return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "Banner Found", status: 200, data: banners });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Server error' });
        }
};
exports.getBanner = async (req, res) => {
        try {
                const banners = await Banner.find();
                if (banners.length == 0) {
                        return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "Banner Found", status: 200, data: banners });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.updateBanner = async (req, res) => {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
                return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
        }
        let fileUrl;
        if (req.file) {
                fileUrl = req.file ? req.file.path : "";
        } else {
                fileUrl = banner.image;
        }
        banner.image = fileUrl;
        banner.name = req.body.name;
        let update = await banner.save();
        return res.status(200).json({ message: "Updated Successfully", data: update });
};
exports.removeBanner = async (req, res) => {
        const { id } = req.params;
        const banner = await Banner.findById(id);
        if (!banner) {
                return res.status(404).json({ message: "Banner Not Found", status: 404, data: {} });
        } else {
                await Banner.findByIdAndDelete(banner._id);
                return res.status(200).json({ message: "Banner Deleted Successfully !" });
        }
};
exports.addTerms = async (req, res) => {
        try {
                const data = await privacy.findOne({ type: req.body.type, typeOf: "terms" });
                if (data) {
                        return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                }
                const termsData = await privacy.create({ terms: req.body.terms, type: req.body.type, typeOf: "terms" });
                return res.status(200).json({ data: termsData, message: "Terms Added ", details: termsData })
        }
        catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.getTerms = async (req, res) => {
        try {
                const data = await privacy.find({ typeOf: "terms" }).select('-privacy');
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No Terms data found', data: {} });
                }
        } catch (err) {
                return res.status(400).send({ mesage: err.mesage });
        }
}
exports.getTermsByType = async (req, res) => {
        try {
                const findPrivacy = await privacy.find({ type: req.params.type, typeOf: "terms" }).select('-privacy');
                if (findPrivacy.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found for the specified type', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified type', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.updateTerms = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await privacy.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Term Not Found", status: 404, data: {} });
                }
                const UpdatedTerms = await privacy.findOneAndUpdate({ _id: req.params.id }, { terms: req.body.terms, type: req.body.type }).exec();
                return res.status(200).json({ message: "Terms Update" })
        } catch (err) {
                console.log(err)
                return res.status(401).json({
                        mesage: err.mesage
                })
        }
}
exports.DeleteTerms = async (req, res) => {
        try {
                const id = req.params.id;
                await privacy.deleteOne({ _id: id });
                return res.status(200).send({ message: "Terms deleted " })
        } catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.addPrivacy = async (req, res) => {
        try {
                const data = await privacy.findOne({ type: req.body.type, typeOf: "privacy" });
                if (data) {
                        return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                }
                const privacyData = await privacy.create({ privacy: req.body.privacy, type: req.body.type, typeOf: "privacy" });
                if (privacyData) {
                        return res.status(200).json({ status: 200, message: "Privacy added successfully", data: privacyData });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getPrivacyByType = async (req, res) => {
        try {
                const findPrivacy = await privacy.find({ type: req.params.type, typeOf: "privacy" }).select('-terms');;
                if (findPrivacy.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found for the specified type', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified type', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getPrivacy = async (req, res) => {
        try {
                const data = await privacy.find({ typeOf: "privacy" })
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No privacy data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.updatePrivacy = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await privacy.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Privacy Not Found", status: 404, data: {} });
                }
                const updatedPrivacy = await privacy.findOneAndUpdate({ _id: req.params.id }, { privacy: req.body.privacy, type: req.body.type, }).exec();
                if (updatedPrivacy) {
                        return res.status(200).json({ status: 200, message: "Privacy updated successfully", data: updatedPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Privacy data not found for the specified ID' });
                }
        } catch (err) {
                console.error(err);
                return res.status(401).json({ status: 401, message: err.message });
        }
};
exports.DeletePrivacy = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await privacy.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Privacy Not Found", status: 404, data: {} });
                }
                const result = await privacy.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        return res.status(200).json({ status: 200, message: "Privacy deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'Privacy data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.addServiceCategory = async (req, res) => {
        try {
                const data = await serviceCategory.findOne({ category: req.body.category, type: req.body.type });
                if (data) {
                        return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                }
                let image, banner;
                if (req.files['image']) {
                        image = req.files['image'];
                        req.body.image = image[0].path;
                } else {
                        return res.status(404).json({ status: 404, message: 'image not provide .', data: data });
                }
                if (req.files['banner']) {
                        banner = req.files['banner'];
                        req.body.banner = banner[0].path;
                } else {
                        return res.status(404).json({ status: 404, message: 'Banner not provide.', data: data });
                }
                const serviceCategoryData = await serviceCategory.create({ category: req.body.category, description: req.body.description, image: req.body.image, banner: req.body.banner, type: req.body.type });
                if (serviceCategoryData) {
                        return res.status(200).json({ status: 200, message: "ServiceCategory added successfully", data: serviceCategoryData });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getServiceCategory = async (req, res) => {
        try {
                const data = await serviceCategory.find();
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No serviceCategory data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getServiceCategoryById = async (req, res) => {
        try {
                const findPrivacy = await serviceCategory.findById({ _id: req.params.id });
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
exports.updateServiceCategory = async (req, res) => {
        try {
                const id = req.params.id;
                const data = await serviceCategory.findById(id);
                if (!data) {
                        return res.status(404).json({ message: "ServiceCategory Not Found", status: 404, data: {} });
                }
                let image, banner;
                if (req.files['image']) {
                        image = req.files['image'];
                        req.body.image = image[0].path;
                } else {
                        req.body.image = data.image;
                }
                if (req.files['banner']) {
                        banner = req.files['banner'];
                        req.body.banner = banner[0].path;
                } else {
                        req.body.banner = data.banner;
                }
                let obj = {
                        category: req.body.category || data.category,
                        image: req.body.image,
                        banner: req.body.banner,
                        type: data.type,
                        description: req.body.description || data.description,
                }
                const updatedServiceCategory = await serviceCategory.findOneAndUpdate({ _id: req.params.id }, { $set: obj }, { new: true }).exec();
                if (updatedServiceCategory) {
                        return res.status(200).json({ status: 200, message: "ServiceCategory updated successfully", data: updatedServiceCategory });
                } else {
                        return res.status(404).json({ status: 404, message: 'ServiceCategory data not found for the specified ID' });
                }
        } catch (err) {
                console.error(err);
                return res.status(401).json({ status: 401, message: err.message });
        }
};
exports.DeleteServiceCategory = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await serviceCategory.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "ServiceCategory Not Found", status: 404, data: {} });
                }
                const result = await serviceCategory.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        return res.status(200).json({ status: 200, message: "ServiceCategory deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'ServiceCategory data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
}
exports.addVehicle = async (req, res) => {
        try {
                if (req.body.type == "car") {
                        const data = await vehicle.findOne({ name: req.body.name, type: req.body.type });
                        if (data) {
                                return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                        }
                        let image;
                        if (req.file) {
                                image = req.file.path;
                        } else {
                                return res.status(404).json({ status: 404, message: "Vehicle image choose first", data: vehicleData });
                        }
                        const vehicleData = await vehicle.create({ name: req.body.name, image: image, type: req.body.type });
                        if (vehicleData) {
                                let obj = {
                                        vehicle: vehicleData._id,
                                        name: req.body.name,
                                        type: 'vehicle',
                                }
                                const pricing1 = await driverVehicalCategory.create(obj);
                                return res.status(200).json({ status: 200, message: "Vehicle added successfully", data: vehicleData });
                        }
                } else {
                        const data = await vehicle.findOne({ type: req.body.type });
                        if (data) {
                                return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                        }
                        let image;
                        if (req.file) {
                                image = req.file.path;
                        } else {
                                return res.status(404).json({ status: 404, message: "Vehicle image choose first", data: vehicleData });
                        }
                        const vehicleData = await vehicle.create({ name: req.body.name, image: image, type: req.body.type });
                        if (vehicleData) {
                                let obj = {
                                        vehicle: vehicleData._id,
                                        name: req.body.name,
                                        type: 'vehicle',
                                }
                                const pricing1 = await driverVehicalCategory.create(obj);
                                return res.status(200).json({ status: 200, message: "Vehicle added successfully", data: vehicleData });
                        }
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getVehicle = async (req, res) => {
        try {
                const data = await vehicle.find();
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No vehicle data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getVehicleById = async (req, res) => {
        try {
                const findPrivacy = await vehicle.findById({ _id: req.params.id });
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
exports.updateVehicle = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await vehicle.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Vehicle Not Found", status: 404, data: {} });
                }
                let image;
                if (req.file) {
                        image = req.file.path;
                } else {
                        image = banner.image;
                }
                const updatedVehicle = await vehicle.findOneAndUpdate({ _id: req.params.id }, { name: req.body.name || banner.name, image: image, type: req.body.type || banner.type }).exec();
                if (updatedVehicle) {
                        let obj1 = {
                                vehicle: updatedVehicle._id,
                                name: updatedVehicle.name,
                                type: 'vehicle',
                        }
                        await driverVehicalCategory.findOneAndUpdate({ vehicle: updatedVehicle._id }, { $set: obj1 }, { new: true, runValidators: true, });
                        return res.status(200).json({ status: 200, message: "Vehicle updated successfully", data: updatedVehicle });
                } else {
                        return res.status(404).json({ status: 404, message: 'Vehicle data not found for the specified ID' });
                }
        } catch (err) {
                console.error(err);
                return res.status(401).json({ status: 401, message: err.message });
        }
};
exports.DeleteVehicle = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await vehicle.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Vehicle Not Found", status: 404, data: {} });
                }
                const result = await vehicle.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        await driverVehicalCategory.deleteOne({ vehicle: req.params.id });
                        return res.status(200).json({ status: 200, message: "Vehicle deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'Vehicle data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.addSuperCar = async (req, res) => {
        try {
                const findPrivacy1 = await serviceCategory.findOne({ _id: req.body.serviceCategory, type: "superCar" });
                if (!findPrivacy1) {
                        return res.status(404).json({ status: 404, message: 'ServiceCategory not found for the specified type', data: {} });
                }
                let findHourlyPricing = await superCar.findOne({ name: req.body.name, serviceCategory: req.body.serviceCategory });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                } else {
                        let image
                        if (req.file) {
                                image = req.file.path;
                        }
                        req.body.image = image;
                        const pricing = await superCar.create(req.body);
                        return res.status(201).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error creating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to create pricing" });
        }
};
exports.getSuperCarById = async (req, res) => {
        try {
                const pricing = await superCar.findById(req.params.id).populate("superCarPricing")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updateSuperCar = async (req, res) => {
        try {
                const findPricing = await superCar.findById(req.params.id).populate("serviceCategory")
                if (!findPricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                let serviceCategory;
                if (req.body.serviceCategory != (null || undefined)) {
                        const findPrivacy1 = await serviceCategory.findOne({ _id: req.body.serviceCategory, type: "superCar" });
                        if (!findPrivacy1) {
                                return res.status(404).json({ status: 404, message: 'ServiceCategory not found for the specified type', data: {} });
                        }
                        serviceCategory = findPrivacy1._id;
                } else {
                        serviceCategory = findPricing.serviceCategory;
                }
                let findHourlyPricing = await superCar.findOne({ _id: { $ne: findPricing._id }, name: req.body.name, serviceCategory: serviceCategory });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                }
                let image;
                if (req.file) {
                        image = req.file.path;
                } else {
                        image = findPricing.image
                }
                let obj = {
                        serviceCategory: serviceCategory,
                        name: req.body.name || findPricing.name,
                        image: image,
                }
                const pricing = await superCar.findByIdAndUpdate({ _id: findPricing._id }, { $set: obj }, { new: true, runValidators: true, });
                if (pricing) {
                        return res.status(200).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error updating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to update pricing" });
        }
};
exports.deleteSuperCar = async (req, res) => {
        try {
                const pricing = await superCar.findByIdAndDelete(req.params.id);
                if (!pricing) {
                        return res.status(404).json({ success: false, error: 'Pricing not found' });
                }
                return res.status(200).json({ success: true, data: {} });
        } catch (error) {
                console.error('Error deleting pricing:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete pricing' });
        }
};
exports.getSuperCar = async (req, res) => {
        try {
                const pricing = await superCar.find().populate('superCarPricing');
                if (pricing.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                } else {
                        return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.addSuperCarPricing = async (req, res) => {
        try {
                const pricing = await superCar.findOne({ _id: req.body.superCar });
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "SuperCar not found" });
                }
                let findHourlyPricing = await superCarPricing.findOne({ name: req.body.name, superCar: req.body.superCar });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                } else {
                        console.log(req.files);
                        let image = [];
                        if (req.files) {
                                for (let i = 0; i < req.files.length; i++) {
                                        let obj = {
                                                img: req.files[i].path
                                        };
                                        image.push(obj)
                                }
                        }
                        req.body.image = image;
                        let obj = {
                                name: req.body.name,
                                superCar: req.body.superCar,
                                image: image,
                                price: req.body.price,
                                kmLimit: req.body.kmLimit,
                                kmPrice: req.body.kmPrice,
                                hrPrice: req.body.hrPrice,
                                hrLimit: req.body.hrLimit,
                        }
                        const pricing = await superCarPricing.create(obj);
                        if (pricing) {
                                let obj = {
                                        superCar: pricing._id,
                                        name: req.body.name,
                                        type: 'superCar',
                                }
                                const pricing1 = await driverVehicalCategory.create(obj);
                                return res.status(201).json({ success: true, data: pricing });
                        }
                }
        } catch (error) {
                console.error("Error creating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to create pricing" });
        }
};
exports.getSuperCarPricingById = async (req, res) => {
        try {
                const pricing = await superCarPricing.findById(req.params.id).populate("serviceCategory")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updateSuperCarPricing = async (req, res) => {
        try {
                const findPricing = await superCarPricing.findById(req.params.id).populate("serviceCategory")
                if (!findPricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                let superCar;
                if (req.body.serviceCategory != (null || undefined)) {
                        const pricing = await superCar.findOne({ _id: req.body.superCar });
                        if (!pricing) {
                                return res.status(404).json({ success: false, error: "SuperCar not found" });
                        }
                        superCar = pricing._id;
                } else {
                        superCar = findPricing.superCar;
                }
                let findHourlyPricing = await superCarPricing.findOne({ _id: { $ne: findPricing._id }, name: req.body.name, superCar: superCar, });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                }
                let image = [];
                if (req.files) {
                        for (let i = 0; i < req.files.length; i++) {
                                let obj = {
                                        img: req.files[i].path
                                };
                                image.push(obj)
                        }
                } else {
                        image = findPricing.image
                }
                let obj = {
                        superCar: superCar,
                        name: req.body.name || findPricing.name,
                        image: image,
                        price: req.body.price || findPricing.price,
                        kmLimit: req.body.kmLimit || findPricing.kmLimit,
                        kmPrice: req.body.kmPrice || findPricing.kmPrice,
                        hrPrice: req.body.hrPrice || findPricing.hrPrice,
                        hrLimit: req.body.hrLimit || findPricing.hrLimit,
                }
                const pricing = await superCarPricing.findByIdAndUpdate({ _id: findPricing._id }, { $set: obj }, { new: true, runValidators: true, });
                if (pricing) {
                        let obj1 = {
                                superCar: pricing._id,
                                name: pricing.name,
                                type: 'superCar',
                        }
                        await driverVehicalCategory.findOneAndUpdate({ superCar: findPricing._id }, { $set: obj1 }, { new: true, runValidators: true, });
                        return res.status(200).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error updating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to update pricing" });
        }
};
exports.deleteSuperCarPricing = async (req, res) => {
        try {
                const pricing = await superCarPricing.findByIdAndDelete(req.params.id);
                if (!pricing) {
                        return res.status(404).json({ success: false, error: 'Pricing not found' });
                }
                await driverVehicalCategory.deleteOne({ superCar: req.params.id });
                return res.status(200).json({ success: true, data: {} });
        } catch (error) {
                console.error('Error deleting pricing:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete pricing' });
        }
};
exports.getSuperCarPricing = async (req, res) => {
        try {
                if (req.query.superCar) {
                        const pricing = await superCarPricing.find({ superCar: req.query.superCar });
                        if (pricing.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                        } else {
                                return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                        }
                } else {
                        const pricing = await superCarPricing.find();
                        if (pricing.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                        } else {
                                return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                        }
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.addState = async (req, res) => {
        try {
                let state1 = [{
                        state: "Andaman and Nicobar Islands",
                        isoCode: "AN",
                        countryCode: "IN",
                        latitude: "11.74008670",
                        longitude: "92.65864010"
                },
                {
                        state: "Andhra Pradesh",
                        isoCode: "AP",
                        countryCode: "IN",
                        latitude: "15.91289980",
                        longitude: "79.73998750"
                },
                {
                        state: "Arunachal Pradesh",
                        isoCode: "AR",
                        countryCode: "IN",
                        latitude: "28.21799940",
                        longitude: "94.72775280"
                },
                {
                        state: "Assam",
                        isoCode: "AS",
                        countryCode: "IN",
                        latitude: "26.20060430",
                        longitude: "92.93757390"
                },
                {
                        state: "Bihar",
                        isoCode: "BR",
                        countryCode: "IN",
                        latitude: "25.09607420",
                        longitude: "85.31311940"
                },
                {
                        state: "Chandigarh",
                        isoCode: "CH",
                        countryCode: "IN",
                        latitude: "30.73331480",
                        longitude: "76.77941790"
                },
                {
                        state: "Chhattisgarh",
                        isoCode: "CT",
                        countryCode: "IN",
                        latitude: "21.27865670",
                        longitude: "81.86614420"
                },
                {
                        state: "Dadra and Nagar Haveli and Daman and Diu",
                        isoCode: "DH",
                        countryCode: "IN",
                        latitude: "20.39737360",
                        longitude: "72.83279910"
                },
                {
                        state: "Delhi",
                        isoCode: "DL",
                        countryCode: "IN",
                        latitude: "28.70405920",
                        longitude: "77.10249020"
                },
                {
                        state: "Goa",
                        isoCode: "GA",
                        countryCode: "IN",
                        latitude: "15.29932650",
                        longitude: "74.12399600"
                },
                {
                        state: "Gujarat",
                        isoCode: "GJ",
                        countryCode: "IN",
                        latitude: "22.25865200",
                        longitude: "71.19238050"
                },
                {
                        state: "Haryana",
                        isoCode: "HR",
                        countryCode: "IN",
                        latitude: "29.05877570",
                        longitude: "76.08560100"
                },
                {
                        state: "Himachal Pradesh",
                        isoCode: "HP",
                        countryCode: "IN",
                        latitude: "31.10482940",
                        longitude: "77.17339010"
                },
                {
                        state: "Jammu and Kashmir",
                        isoCode: "JK",
                        countryCode: "IN",
                        latitude: "33.27783900",
                        longitude: "75.34121790"
                },
                {
                        state: "Jharkhand",
                        isoCode: "JH",
                        countryCode: "IN",
                        latitude: "23.61018080",
                        longitude: "85.27993540"
                },
                {
                        state: "Karnataka",
                        isoCode: "KA",
                        countryCode: "IN",
                        latitude: "15.31727750",
                        longitude: "75.71388840"
                },
                {
                        state: "Kerala",
                        isoCode: "KL",
                        countryCode: "IN",
                        latitude: "10.85051590",
                        longitude: "76.27108330"
                },
                {
                        state: "Ladakh",
                        isoCode: "LA",
                        countryCode: "IN",
                        latitude: "34.22684750",
                        longitude: "77.56194190"
                },
                {
                        state: "Lakshadweep",
                        isoCode: "LD",
                        countryCode: "IN",
                        latitude: "10.32802650",
                        longitude: "72.78463360"
                },
                {
                        state: "Madhya Pradesh",
                        isoCode: "MP",
                        countryCode: "IN",
                        latitude: "22.97342290",
                        longitude: "78.65689420"
                },
                {
                        state: "Maharashtra",
                        isoCode: "MH",
                        countryCode: "IN",
                        latitude: "19.75147980",
                        longitude: "75.71388840"
                },
                {
                        state: "Manipur",
                        isoCode: "MN",
                        countryCode: "IN",
                        latitude: "24.66371730",
                        longitude: "93.90626880"
                },
                {
                        state: "Meghalaya",
                        isoCode: "ML",
                        countryCode: "IN",
                        latitude: "25.46703080",
                        longitude: "91.36621600"
                },
                {
                        state: "Mizoram",
                        isoCode: "MZ",
                        countryCode: "IN",
                        latitude: "23.16454300",
                        longitude: "92.93757390"
                },
                {
                        state: "Nagaland",
                        isoCode: "NL",
                        countryCode: "IN",
                        latitude: "26.15843540",
                        longitude: "94.56244260"
                },
                {
                        state: "Odisha",
                        isoCode: "OR",
                        countryCode: "IN",
                        latitude: "20.95166580",
                        longitude: "85.09852360"
                },
                {
                        state: "Puducherry",
                        isoCode: "PY",
                        countryCode: "IN",
                        latitude: "11.94159150",
                        longitude: "79.80831330"
                },
                {
                        state: "Punjab",
                        isoCode: "PB",
                        countryCode: "IN",
                        latitude: null,
                        longitude: null
                },
                {
                        state: "Rajasthan",
                        isoCode: "RJ",
                        countryCode: "IN",
                        latitude: "27.02380360",
                        longitude: "74.21793260"
                },
                {
                        state: "Sikkim",
                        isoCode: "SK",
                        countryCode: "IN",
                        latitude: "27.53297180",
                        longitude: "88.51221780"
                },
                {
                        state: "Tamil Nadu",
                        isoCode: "TN",
                        countryCode: "IN",
                        latitude: "11.12712250",
                        longitude: "78.65689420"
                },
                {
                        state: "Telangana",
                        isoCode: "TG",
                        countryCode: "IN",
                        latitude: "18.11243720",
                        longitude: "79.01929970"
                },
                {
                        state: "Tripura",
                        isoCode: "TR",
                        countryCode: "IN",
                        latitude: "23.94084820",
                        longitude: "91.98815270"
                },
                {
                        state: "Uttar Pradesh",
                        isoCode: "UP",
                        countryCode: "IN",
                        latitude: "26.84670880",
                        longitude: "80.94615920"
                },
                {
                        state: "Uttarakhand",
                        isoCode: "UT",
                        countryCode: "IN",
                        latitude: "30.06675300",
                        longitude: "79.01929970"
                },
                {
                        state: "West Bengal",
                        isoCode: "WB",
                        countryCode: "IN",
                        latitude: "22.98675690",
                        longitude: "87.85497550"
                }]
                for (let i = 0; i < state1.length; i++) {
                        const data = await stateModel.findOne(state1[i]);
                        if (!data) {
                                const cityData = await stateModel.create(state1[i]);
                        } else {
                                const updatedcity = await stateModel.findOneAndUpdate({ _id: data._id }, { $set: state1[i] }).exec();
                        }
                }
                return res.status(200).json({ status: 200, message: "state added successfully", data: state1 });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getState = async (req, res) => {
        try {
                const data = await stateModel.find();
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No city data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getStateById = async (req, res) => {
        try {
                const findPrivacy = await stateModel.findById({ _id: req.params.id });
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
exports.DeleteState = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await stateModel.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "city Not Found", status: 404, data: {} });
                }
                const result = await stateModel.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        return res.status(200).json({ status: 200, message: "city deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'city data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.addCity = async (req, res) => {
        try {
                let findState = await stateModel.find();
                for (let j = 0; j < findState.length; j++) {
                        let getcity = await City.getCitiesOfState("IN", findState[j].isoCode);
                        if (getcity.length == 0) {
                                console.log("=================");
                        } else {
                                for (let i = 0; i < getcity.length; i++) {
                                        let obj = {
                                                city: getcity[i].name,
                                                countryCode: getcity[i].countryCode,
                                                stateCode: getcity[i].stateCode,
                                                latitude: getcity[i].latitude,
                                                longitude: getcity[i].longitude
                                        }
                                        await cityModel(obj).save();
                                }
                        }
                }
                return res.status(200).json({ status: 200, message: "city added successfully", data: {} });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.addCity1 = async (req, res) => {
        try {
                const data = await cityModel.findOne({ city: req.body.city });
                if (data) {
                        return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                }
                const cityData = await cityModel.create({ city: req.body.city });
                if (cityData) {
                        return res.status(200).json({ status: 200, message: "city added successfully", data: cityData });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getCity = async (req, res) => {
        try {
                const data = await cityModel.find();
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No city data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getCityById = async (req, res) => {
        try {
                const findPrivacy = await cityModel.findById({ _id: req.params.id });
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
exports.updateCity = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await cityModel.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "city Not Found", status: 404, data: {} });
                }
                const updatedcity = await cityModel.findOneAndUpdate({ _id: req.params.id }, { city: req.body.city || banner.city, }).exec();
                if (updatedcity) {
                        return res.status(200).json({ status: 200, message: "city updated successfully", data: updatedcity });
                } else {
                        return res.status(404).json({ status: 404, message: 'city data not found for the specified ID' });
                }
        } catch (err) {
                console.error(err);
                return res.status(401).json({ status: 401, message: err.message });
        }
};
exports.DeleteCity = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await cityModel.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "city Not Found", status: 404, data: {} });
                }
                const result = await cityModel.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        return res.status(200).json({ status: 200, message: "city deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'city data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.addPricing = async (req, res) => {
        try {
                const findPrivacy = await vehicle.findById({ _id: req.body.vehicle });
                if (!findPrivacy) {
                        return res.status(404).json({ status: 404, message: 'Vehicle not found for the specified type', data: {} });
                }
                const findPrivacy2 = await cityModel.findById({ _id: req.body.city });
                if (!findPrivacy2) {
                        return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
                }
                let findHourlyPricing = await dailyPricing.findOne({ vehicle: req.body.vehicle, city: req.body.city, toKm: req.body.toKm, fromKm: req.body.fromKm, });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                } else {
                        const pricing = await dailyPricing.create(req.body);
                        return res.status(201).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error creating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to create pricing" });
        }
};
exports.getPricing = async (req, res) => {
        try {
                const pricing = await dailyPricing.find().populate('city vehicle');
                if (pricing.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                } else {
                        return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getPriceById = async (req, res) => {
        try {
                const pricing = await dailyPricing.findById(req.params.id).populate("vehicle city")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updatePricing = async (req, res) => {
        try {
                const pricing = await dailyPricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error updating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to update pricing" });
        }
};
exports.deletePricing = async (req, res) => {
        try {
                const pricing = await dailyPricing.findByIdAndDelete(req.params.id);
                if (!pricing) {
                        return res.status(404).json({ success: false, error: 'Pricing not found' });
                }
                return res.status(200).json({ success: true, data: {} });
        } catch (error) {
                console.error('Error deleting pricing:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete pricing' });
        }
};
exports.AddHourlyPricing = async (req, res) => {
        try {
                const findPrivacy = await vehicle.findById({ _id: req.body.vehicle });
                if (!findPrivacy) {
                        return res.status(404).json({ status: 404, message: 'Vehicle not found for the specified type', data: {} });
                }
                const findPrivacy2 = await cityModel.findById({ _id: req.body.city });
                if (!findPrivacy2) {
                        return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
                }
                let findHourlyPricing = await hourlyModel.findOne({ km: req.body.km, hours: req.body.hours, vehicle: req.body.vehicle, city: req.body.city, });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "HourlyPricing already exit.", status: 404, data: {} });
                } else {
                        const data = { vehicle: req.body.vehicle, city: req.body.city, km: req.body.km, hours: req.body.hours, price: req.body.price };
                        const hourlyPricing = await hourlyModel.create(data);
                        return res.status(200).json({ message: "HourlyPricing add successfully.", status: 200, data: hourlyPricing });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getHourlyPricing = async (req, res) => {
        try {
                const hourlyPricing = await hourlyModel.find().populate('city vehicle');;
                if (hourlyPricing.length == 0) {
                        return res.status(404).json({ message: "HourlyPricing Not Found", status: 404, data: {} });
                } else {
                        return res.status(200).json({ message: "HourlyPricing Found", status: 200, data: hourlyPricing });
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.getHourlyPricingById = async (req, res) => {
        try {
                const pricing = await hourlyModel.findById(req.params.id).populate("vehicle city")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "HourlyPricing Not Found" });
                }
                return res.status(200).json({ message: "HourlyPricing Found", status: 200, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updateHourlyPricing = async (req, res) => {
        const { id } = req.params;
        const hourly = await hourlyModel.findById(id);
        if (!hourly) {
                return res.status(404).json({ message: "HourlyPricing Not Found", status: 404, data: {} });
        }
        let vehicle, city;
        if (req.body.vehicle != (null || undefined)) {
                const findPrivacy = await vehicle.findById({ _id: req.body.vehicle });
                if (!findPrivacy) {
                        return res.status(404).json({ status: 404, message: 'Vehicle not found for the specified type', data: {} });
                }
                vehicle = findPrivacy._id;
        } else {
                vehicle = hourly.vehicle;
        }
        if (req.body.city != (null || undefined)) {
                const findPrivacy2 = await cityModel.findById({ _id: req.body.city });
                if (!findPrivacy2) {
                        return res.status(404).json({ status: 404, message: 'city not found f', data: {} });
                }
                city = findPrivacy2._id;
        } else {
                city = hourly.city;
        }
        let findHourlyPricing = await hourlyModel.findOne({ _id: { $ne: hourly._id }, km: req.body.km, hours: req.body.hours, city: city, vehicle: vehicle });
        if (findHourlyPricing) {
                return res.status(409).json({ message: "HourlyPricing already exit.", status: 404, data: {} });
        }
        hourly.vehicle = vehicle;
        hourly.city = city;
        hourly.km = req.body.km || hourly.km;
        hourly.hours = req.body.hours || hourly.hours;
        hourly.price = req.body.price || hourly.price;
        let update = await hourly.save();
        return res.status(200).json({ message: "Updated Successfully", data: update });
};
exports.removeHourlyPricing = async (req, res) => {
        const { id } = req.params;
        const hourlyPricing = await hourlyModel.findById(id);
        if (!hourlyPricing) {
                return res.status(404).json({ message: "HourlyPricing Not Found", status: 404, data: {} });
        } else {
                await hourlyModel.findByIdAndDelete(hourlyPricing._id);
                return res.status(200).json({ message: "HourlyPricing Deleted Successfully !" });
        }
};
exports.getPricingByDistance = async (req, res) => {
        try {
                const { city, distanceInKm } = req.body;
                const cityDetails = await cityModel.findOne({ city });
                if (!cityDetails) {
                        return res.status(404).json({ status: 404, message: 'City not found', data: {} });
                }
                const vehicles = await vehicle.find();
                const pricingDetails = await basePricing.find({ city: cityDetails._id });
                if (!pricingDetails || pricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found for the selected city' });
                }
                const calculatedPrices = [];
                for (const vehicle of vehicles) {
                        const vehiclePricingBase = pricingDetails.find(detail => detail.vehicle.toString() === vehicle._id.toString());
                        if (vehiclePricingBase) {
                                const pricingDetails1 = await dailyPricing.find({ vehicle: vehicle._id, city: cityDetails._id });
                                const totalCharges = calculatePricing(distanceInKm, pricingDetails1);
                                const additionalCharges = vehiclePricingBase.basePrice + vehiclePricingBase.taxRate + vehiclePricingBase.gstRate + vehiclePricingBase.serviceCharge + vehiclePricingBase.nightCharges + vehiclePricingBase.waitingCharge + vehiclePricingBase.trafficCharge;
                                const totalPrice = totalCharges + additionalCharges;

                                calculatedPrices.push({
                                        additionalCharges,
                                        totalCharges,
                                        totalPrice,
                                        distanceInKm,
                                        vehicle: vehicle,
                                });
                        }
                }
                return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: calculatedPrices });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
exports.getDeliveryPricingByDistance = async (req, res) => {
        try {
                const { city, distanceInKm } = req.body;
                const cityDetails = await cityModel.findOne({ city });
                if (!cityDetails) {
                        return res.status(404).json({ status: 404, message: 'City not found', data: {} });
                }
                const vehicles = await vehicle.find({ type: "bike" });
                const pricingDetails = await basePricing.find({ city: cityDetails._id });
                if (!pricingDetails || pricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found for the selected city' });
                }
                const calculatedPrices = [];
                for (const vehicle of vehicles) {
                        const vehiclePricingBase = pricingDetails.find(detail => detail.vehicle.toString() === vehicle._id.toString());
                        if (vehiclePricingBase) {
                                const pricingDetails1 = await dailyPricing.find({ vehicle: vehicle._id, city: cityDetails._id });
                                const totalCharges = calculatePricing(distanceInKm, pricingDetails1);
                                const additionalCharges = vehiclePricingBase.basePrice + vehiclePricingBase.taxRate + vehiclePricingBase.gstRate + vehiclePricingBase.serviceCharge + vehiclePricingBase.nightCharges + vehiclePricingBase.waitingCharge + vehiclePricingBase.trafficCharge;
                                const totalPrice = totalCharges + additionalCharges;

                                calculatedPrices.push({
                                        additionalCharges,
                                        totalCharges,
                                        totalPrice,
                                        distanceInKm,
                                        vehicle: vehicle,
                                });
                        }
                }
                return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: calculatedPrices });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
exports.getSettlePricingByDistance = async (req, res) => {
        try {
                const { city, distanceInKm, day } = req.body;
                const cityDetails = await cityModel.findOne({ city });
                if (!cityDetails) {
                        return res.status(404).json({ status: 404, message: 'City not found', data: {} });
                }
                const vehicles = await vehicle.find();
                const pricingDetails = await basePricing.find({ city: cityDetails._id });
                if (!pricingDetails || pricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found for the selected city' });
                }
                const calculatedPrices = [];
                for (const vehicle of vehicles) {
                        const vehiclePricingBase = pricingDetails.find(detail => detail.vehicle.toString() === vehicle._id.toString());
                        if (vehiclePricingBase) {
                                const pricingDetails1 = await dailyPricing.find({ vehicle: vehicle._id, city: cityDetails._id });
                                const totalCharges1 = calculatePricing(distanceInKm, pricingDetails1);
                                const additionalCharges1 = vehiclePricingBase.basePrice + vehiclePricingBase.taxRate + vehiclePricingBase.gstRate + vehiclePricingBase.serviceCharge + vehiclePricingBase.nightCharges + vehiclePricingBase.waitingCharge + vehiclePricingBase.trafficCharge;
                                const totalPrice = (totalCharges1 + additionalCharges1) * 2;
                                let additionalCharges = additionalCharges1 * 2;
                                let totalCharges = totalCharges1 * 2;
                                let total = totalPrice * day;
                                calculatedPrices.push({
                                        additionalCharges,
                                        totalCharges,
                                        totalPerDayPrice: totalPrice,
                                        total,
                                        distanceInKm,
                                        vehicle: vehicle,
                                });
                        }
                }
                return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: calculatedPrices });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
function calculatePricing(distance, slabs) {
        let totalPricing = 0;
        let lastToKm = 0;
        for (let i = 0; i < slabs.length; i++) {
                if (distance > slabs[i].toKm) {
                        totalPricing += (slabs[i].toKm - lastToKm) * slabs[i].price;
                        lastToKm = slabs[i].toKm;
                } else if (distance >= slabs[i].fromKm) {
                        totalPricing += (distance - lastToKm) * slabs[i].price;
                        break;
                }
        }
        return totalPricing;
}
exports.getHourlyPricingByDistance = async (req, res) => {
        try {
                const { distanceInKm, city } = req.body;
                const userId = req.user;
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                }
                const findPrivacy = await cityModel.findOne({ city: city });
                if (!findPrivacy) {
                        return res.status(404).json({ success: false, message: 'City not found' });
                }
                const allPricingDetails = await hourlyModel.find({ km: distanceInKm, city: findPrivacy._id }).populate('vehicle');
                if (!allPricingDetails || allPricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found' });
                }
                const prices = allPricingDetails.map((pricingDetails) => ({
                        vehicle: pricingDetails.vehicle,
                        distanceInKm: distanceInKm,
                        totalPrice: pricingDetails.price * distanceInKm
                }));
                return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: prices });
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
exports.AddNotification = async (req, res) => {
        try {
                const admin = await User.findById(req.user.id);
                if (!admin) {
                        return res.status(404).json({ error: "User not found" });
                } else {
                        if (req.body.sendTo == "USER") {
                                if (req.body.total == "ALL") {
                                        let userData = await User.find({ role: 'users' });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                for (let i = 0; i < userData.length; i++) {
                                                        let obj = {
                                                                title: req.body.subject,
                                                                body: req.body.body,
                                                                userId: userData[i]._id,
                                                                date: fullDate,
                                                                sendBy: "ADMIN",
                                                                sendTo: "USER",
                                                        }
                                                        var notif = await notify.create(obj);
                                                }
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "USER",
                                                }
                                                var notif = await notify.create(obj);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });
                                                }
                                        }
                                }
                                if (req.body.total == "SINGLE") {
                                        let userData = await User.findOne({ _id: req.body.userId });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "USER",
                                                }
                                                var notif = await notify.create(obj);
                                                let obj1 = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "USER",
                                                }
                                                var notif = await notify.create(obj1);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });

                                                }
                                        }
                                }
                        }
                        if (req.body.sendTo == "VENDOR") {
                                if (req.body.total == "ALL") {
                                        let userData = await User.find({ role: 'vendor' });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                for (let i = 0; i < userData.length; i++) {
                                                        let obj = {
                                                                title: req.body.subject,
                                                                body: req.body.body,
                                                                userId: userData[i]._id,
                                                                date: fullDate,
                                                                sendBy: "ADMIN",
                                                                sendTo: "VENDOR",
                                                        }
                                                        var notif = await notify.create(obj);
                                                }
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "VENDOR",
                                                }
                                                var notif = await notify.create(obj);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });

                                                }
                                        }
                                }
                                if (req.body.total == "SINGLE") {
                                        let userData = await User.findOne({ _id: req.body.userId, role: 'vendor' });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "VENDOR",
                                                }
                                                var notif = await notify.create(obj);
                                                let obj1 = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "VENDOR",
                                                }
                                                var notif = await notify.create(obj1);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });

                                                }
                                        }
                                }
                        }
                        if (req.body.sendTo == "DRIVER") {
                                if (req.body.total == "ALL") {
                                        let userData = await User.find({ role: 'driver' });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                for (let i = 0; i < userData.length; i++) {
                                                        let obj = {
                                                                title: req.body.subject,
                                                                body: req.body.body,
                                                                userId: userData[i]._id,
                                                                date: fullDate,
                                                                sendBy: "ADMIN",
                                                                sendTo: "DRIVER",
                                                        }
                                                        var notif = await notify.create(obj);
                                                }
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "DRIVER",
                                                }
                                                var notif = await notify.create(obj);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });

                                                }
                                        }
                                }
                                if (req.body.total == "SINGLE") {
                                        let userData = await User.findOne({ _id: req.body.userId });
                                        if (!userData) {
                                                return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                                        } else {
                                                let d = new Date(), date = d.getDate(); let month = d.getMonth() + 1; let year = d.getFullYear(), hr = d.getHours(), min = d.getMinutes(), sec = d.getSeconds();
                                                let fullDate = await datetimeCalulate(date, month, year, hr, min, sec)
                                                let obj = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "DRIVER",
                                                }
                                                var notif = await notify.create(obj);
                                                let obj1 = {
                                                        title: req.body.subject,
                                                        body: req.body.body,
                                                        adminId: admin._id,
                                                        userId: userData._id,
                                                        date: fullDate,
                                                        sendBy: "ADMIN",
                                                        sendTo: "DRIVER",
                                                }
                                                var notif = await notify.create(obj1);
                                                if (notif) {
                                                        return res.status(200).json({ success: true, message: 'Notification send successfully', data: notif });

                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
const datetimeCalulate = async (date, month, year, hr, min, sec) => {
        let date1, hr1, min1, sec1;
        if (date < 10) {
                date1 = '' + 0 + date;
        }
        else {
                date1 = date
        }
        if (hr < 10) {
                hr1 = '' + 0 + hr;
        }
        else {
                hr1 = hr
        }
        if (min < 10) {
                min1 = '' + 0 + min;
        }
        else {
                min1 = min
        }
        if (sec < 10) {
                sec1 = '' + 0 + sec;
        }
        else {
                sec1 = sec
        }
        let fullDate = `${date1}/${month}/${year} ${hr1}:${min1}:${sec1}`
        return fullDate
}
exports.GetAllNotification = async (req, res) => {
        try {
                let admin = await User.findOne({ _id: req.user.id });
                if (!admin) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                } else {
                        var notif = await notify.find({ adminId: admin._id, sendBy: "ADMIN", }).sort({ "createdAt": -1 }).populate('userId')
                        if (notif.length == 0) {
                                return res.status(404).json({ success: false, message: 'Notification  not  found successfully', data: {} });
                        } else {
                                return res.status(200).json({ success: true, message: 'Notification found successfully', data: notif });
                        }
                }
        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.listmyNotification = async (req, res) => {
        try {
                let admin = await User.findOne({ _id: req.user.id });
                if (!admin) {
                        return res.status(404).send({ status: 404, message: "user not found ! not registered" });
                } else {
                        console.log(req.user.id)
                        var notif = await notify.find({ userId: admin._id, adminId: { $exists: false } }).sort({ "createdAt": -1 }).populate('userId');
                        if (notif.length == 0) {
                                return res.status(404).json({ success: false, message: 'Notification  not  found successfully', data: {} });
                        } else {
                                return res.status(200).json({ success: true, message: 'Notification found successfully', data: notif });
                        }
                }
        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: "internal server error ", data: error.message, });
        }
};
exports.GetBYNotifyID = async (req, res) => {
        try {
                const data = await notify.findById({ _id: req.params.id })
                return res.status(200).json({
                        message: data
                })
        } catch (err) {
                return res.status(400).json({
                        message: err.message
                })
        }
}
exports.deleteNotification = async (req, res) => {
        try {
                await notify.findByIdAndDelete({ _id: req.params.id });
                return res.status(200).json({
                        message: "Notification Deleted "
                })
        } catch (err) {
                return res.status(400).json({
                        message: err.message
                })
        }
}
exports.addCancel = async (req, res) => {
        try {
                const cancelData = await cancel.create({ cancel: req.body.cancel });
                return res.status(200).json({ data: cancelData, message: "  cancel Added ", details: cancelData })
        }
        catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.getCancel = async (req, res) => {
        try {
                const data = await cancel.find();
                console.log(data);
                return res.status(200).json({ cancel: data })
        } catch (err) {
                return res.status(400).send({ mesage: err.mesage });
        }
}
exports.updateCancel = async (req, res) => {
        try {
                const Updatedcancel = await cancel.findOneAndUpdate({ _id: req.params.id }, { cancel: req.body.cancel }).exec();
                console.log(Updatedcancel);
                return res.status(200).json({ message: "cancel Update" })
        } catch (err) {
                console.log(err)
                return res.status(401).json({ mesage: err.mesage })
        }
}
exports.DeleteCancel = async (req, res) => {
        try {
                const id = req.params.id;
                await cancel.deleteOne({ _id: id });
                return res.status(200).send({ message: "cancel deleted " })
        } catch (err) {
                console.log(err);
                return res.status(400).send({ message: err.message })
        }
}
exports.addOutStationPricing = async (req, res) => {
        try {
                const findPrivacy = await vehicle.findById({ _id: req.body.vehicle });
                if (!findPrivacy) {
                        return res.status(404).json({ status: 404, message: 'Vehicle not found for the specified type', data: {} });
                }
                const findPrivacy2 = await cityModel.findById({ _id: req.body.city });
                if (!findPrivacy2) {
                        return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
                }
                let findHourlyPricing = await outStationPricing.findOne({ vehicle: req.body.vehicle, city: req.body.city, type: req.body.type });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                } else {
                        let obj = {
                                vehicle: req.body.vehicle,
                                city: req.body.city,
                                type: req.body.type,
                                price: req.body.price,
                                kmLimit: req.body.kmLimit,
                                kmPrice: req.body.kmPrice,
                                hrPrice: req.body.hrPrice,
                                hrLimit: req.body.hrLimit,
                        }
                        const pricing = await outStationPricing.create(obj);
                        return res.status(201).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error creating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to create pricing" });
        }
};
exports.getOutStationPricing = async (req, res) => {
        try {
                const pricing = await outStationPricing.find().populate('city vehicle');;
                if (pricing.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                } else {
                        return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getOutStationPricingById = async (req, res) => {
        try {
                const pricing = await outStationPricing.findById(req.params.id).populate("vehicle city")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updateOutStationPricing = async (req, res) => {
        try {
                const pricing = await outStationPricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error updating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to update pricing" });
        }
};
exports.deleteOutStationPricing = async (req, res) => {
        try {
                const pricing = await outStationPricing.findByIdAndDelete(req.params.id);
                if (!pricing) {
                        return res.status(404).json({ success: false, error: 'Pricing not found' });
                }
                return res.status(200).json({ success: true, data: {} });
        } catch (error) {
                console.error('Error deleting pricing:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete pricing' });
        }
};
exports.getOutStationPricingByDistance = async (req, res) => {
        try {
                const { hr, type, distanceInKm, city } = req.body;
                console.log(req.body)
                const userId = req.user;
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                }
                const findPrivacy = await cityModel.findOne({ city });
                if (!findPrivacy) {
                        return res.status(404).json({ success: false, message: 'City not found' });
                }
                const allPricingDetails = await outStationPricing.find({ city: findPrivacy._id, type: type }).populate('vehicle');
                if (!allPricingDetails || allPricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found' });
                } else {
                        let data = [];
                        for (let i = 0; i < allPricingDetails.length; i++) {
                                let totalPrice = allPricingDetails[i].price, onBaseOff;
                                if (distanceInKm > allPricingDetails[i].kmLimit) {
                                        let kmAmount = allPricingDetails[i].kmPrice * (distanceInKm - allPricingDetails[i].kmLimit);
                                        totalPrice += kmAmount;
                                        onBaseOff = "km";
                                } else if (hr > allPricingDetails[i].hrLimit) {
                                        totalPrice += allPricingDetails[i].hrPrice * (hr - allPricingDetails[i].hrLimit);
                                        onBaseOff = "hr";
                                } else {
                                        totalPrice = totalPrice;
                                        onBaseOff = "noOne";
                                }
                                let obj = {
                                        onBaseOff,
                                        totalPrice,
                                        distanceInKm,
                                        vehicle: allPricingDetails[i].vehicle
                                }
                                data.push(obj)
                        }
                        return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: data });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
exports.getSuperCarPricingByDistance = async (req, res) => {
        try {
                const { hr, distanceInKm, superCarId } = req.body;
                console.log(req.body)
                const userId = req.user;
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                }
                const findPrivacy = await superCar.findOne({ _id: superCarId });
                if (!findPrivacy) {
                        return res.status(404).json({ success: false, message: 'City not found' });
                }
                const allPricingDetails = await superCarPricing.findOne({ superCar: findPrivacy._id }).populate('superCar');
                if (!allPricingDetails || allPricingDetails.length === 0) {
                        return res.status(404).json({ success: false, message: 'No pricing details found' });
                } else {
                        let totalPrice = allPricingDetails.price, onBaseOff;
                        if (distanceInKm > allPricingDetails.kmLimit) {
                                let kmAmount = allPricingDetails.kmPrice * (distanceInKm - allPricingDetails.kmLimit);
                                totalPrice += kmAmount;
                                onBaseOff = "km";
                        } else if (hr > allPricingDetails.hrLimit) {
                                totalPrice += allPricingDetails.hrPrice * (hr - allPricingDetails.hrLimit);
                                onBaseOff = "hr";
                        } else {
                                totalPrice = totalPrice;
                                onBaseOff = "noOne";
                        }
                        return res.status(200).json({
                                success: true, message: 'Prices calculated successfully', superCar: allPricingDetails.superCar, distanceInKm,
                                totalPrice,
                                onBaseOff
                        });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
exports.getVehicleAmbulanceByDistance = async (req, res) => {
        try {
                const { distanceInKm, vehicleAmbulanceId } = req.body;
                console.log(req.body)
                const userId = req.user;
                const user = await User.findById(userId);
                if (!user) {
                        return res.status(404).json({ success: false, message: 'User not found' });
                }
                const allPricingDetails = await vehicleAmbulance.findOne({ _id: vehicleAmbulanceId });
                if (!allPricingDetails) {
                        return res.status(404).json({ success: false, message: 'No pricing details found' });
                } else {
                        let totalPrice = (allPricingDetails.perKm * distanceInKm) + (allPricingDetails.basePrice + allPricingDetails.taxRate + allPricingDetails.gstRate + allPricingDetails.serviceCharge + allPricingDetails.nightCharges + allPricingDetails.waitingCharge + allPricingDetails.trafficCharge);
                        return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: allPricingDetails, distanceInKm, totalPrice, });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ success: false, message: 'Internal server error' });
        }
};
// exports.getOutStationPricingByDistance = async (req, res) => {
//         try {
//                 const { distanceInKm } = req.body;
//                 const userId = req.user;
//                 const user = await User.findById(userId);
//                 if (!user) {
//                         return res.status(404).json({ success: false, message: 'User not found' });
//                 }
//                 const findPrivacy = await cityModel.findOne({ city: req.body.city });
//                 if (!findPrivacy) {
//                         return res.status(404).json({ success: false, message: 'City not found' });
//                 }
//                 const allPricingDetails = await outStationPricing.find({ city: findPrivacy._id }).populate('vehicle');
//                 if (!allPricingDetails || allPricingDetails.length === 0) {
//                         return res.status(404).json({ success: false, message: 'No pricing details found' });
//                 }
//                 const prices = allPricingDetails.map((pricingDetails) => ({
//                         vehicle: pricingDetails.vehicle,
//                         distanceInKm: distanceInKm,
//                         totalPrice: pricingDetails.price * distanceInKm
//                 }));
//                 return res.status(200).json({ success: true, message: 'Prices calculated successfully', data: prices });
//         } catch (error) {
//                 console.error(error);
//                 return res.status(500).json({ success: false, message: 'Internal server error' });
//         }
// };
exports.addBasePricing = async (req, res) => {
        try {
                const findPrivacy = await vehicle.findById({ _id: req.body.vehicle });
                if (!findPrivacy) {
                        return res.status(404).json({ status: 404, message: 'Vehicle not found for the specified type', data: {} });
                }
                const findPrivacy2 = await cityModel.findById({ _id: req.body.city });
                if (!findPrivacy2) {
                        return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
                }
                let findHourlyPricing = await basePricing.findOne({ vehicle: req.body.vehicle, city: req.body.city, });
                if (findHourlyPricing) {
                        return res.status(409).json({ message: "pricing already exit.", status: 404, data: {} });
                } else {
                        const pricing = await basePricing.create(req.body);
                        return res.status(201).json({ success: true, data: pricing });
                }
        } catch (error) {
                console.error("Error creating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to create pricing" });
        }
};
exports.getBasePricing = async (req, res) => {
        try {
                const pricing = await basePricing.find().populate('city vehicle');;
                if (pricing.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: pricing });
                } else {
                        return res.status(404).json({ status: 404, message: 'No pricing data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getBasePricingById = async (req, res) => {
        try {
                const pricing = await basePricing.findById(req.params.id).populate("vehicle city")
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error fetching pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to fetch pricing" });
        }
};
exports.updateBasePricing = async (req, res) => {
        try {
                const pricing = await basePricing.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true, });
                if (!pricing) {
                        return res.status(404).json({ success: false, error: "Pricing not found" });
                }
                return res.status(200).json({ success: true, data: pricing });
        } catch (error) {
                console.error("Error updating pricing:", error);
                return res.status(500).json({ success: false, error: "Failed to update pricing" });
        }
};
exports.deleteBasePricing = async (req, res) => {
        try {
                const pricing = await basePricing.findByIdAndDelete(req.params.id);
                if (!pricing) {
                        return res.status(404).json({ success: false, error: 'Pricing not found' });
                }
                return res.status(200).json({ success: true, data: {} });
        } catch (error) {
                console.error('Error deleting pricing:', error);
                return res.status(500).json({ success: false, error: 'Failed to delete pricing' });
        }
};
exports.addAmbulanceVehicle = async (req, res) => {
        try {
                const data = await vehicleAmbulance.findOne({ name: req.body.name, });
                if (data) {
                        return res.status(200).json({ status: 200, message: 'Data already exit.', data: data });
                }
                if (req.file) {
                        req.body.image = req.file.path;
                } else {
                        return res.status(404).json({ status: 404, message: "Ambulance vehicle image choose first", data: vehicleData });
                }
                const vehicleData = await vehicleAmbulance.create(req.body);
                if (vehicleData) {
                        let obj = {
                                vehicleAmbulance: vehicleData._id,
                                name: req.body.name,
                                type: 'vehicleAmbulance',
                        }
                        const pricing1 = await driverVehicalCategory.create(obj);
                        return res.status(200).json({ status: 200, message: "Ambulance vehicle added successfully", data: vehicleData });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getAmbulanceVehicle = async (req, res) => {
        try {
                const data = await vehicleAmbulance.find({});
                if (data.length > 0) {
                        return res.status(200).json({ status: 200, message: 'Data found', data: data });
                } else {
                        return res.status(404).json({ status: 404, message: 'No ambulance vehicle data found', data: {} });
                }
        } catch (err) {
                return res.status(400).json({ status: 400, message: err.message });
        }
};
exports.getAmbulanceVehicleById = async (req, res) => {
        try {
                const findPrivacy = await vehicleAmbulance.findById({ _id: req.params.id });
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
exports.updateAmbulanceVehicle = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await vehicleAmbulance.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Vehicle Not Found", status: 404, data: {} });
                }
                let image;
                console.log(req.file)
                if (req.file) {
                        image = req.file.path;
                } else {
                        image = banner.image;
                }
                let obj = {
                        name: req.body.name || banner.name,
                        image: image,
                        type: req.body.type || banner.type,
                        perKm: req.body.perKm || banner.perKm,
                        basePrice: req.body.basePrice || banner.basePrice,
                        taxRate: req.body.taxRate || banner.taxRate,
                        gstRate: req.body.gstRate || banner.gstRate,
                        serviceCharge: req.body.serviceCharge || banner.serviceCharge,
                        nightCharges: req.body.nightCharges || banner.nightCharges,
                        waitingCharge: req.body.waitingCharge || banner.waitingCharge,
                        trafficCharge: req.body.trafficCharge || banner.trafficCharge,
                }
                const updatedVehicle = await vehicleAmbulance.findOneAndUpdate({ _id: req.params.id }, { $set: obj }, { new: true });
                if (updatedVehicle) {
                        let obj1 = {
                                vehicleAmbulance: updatedVehicle._id,
                                name: updatedVehicle.name,
                                type: 'vehicleAmbulance',
                        }
                        await driverVehicalCategory.findOneAndUpdate({ vehicleAmbulance: updatedVehicle._id }, { $set: obj1 }, { new: true, runValidators: true, });
                        return res.status(200).json({ status: 200, message: "Vehicle updated successfully", data: updatedVehicle });
                } else {
                        return res.status(404).json({ status: 404, message: 'Vehicle data not found for the specified ID' });
                }
        } catch (err) {
                console.error(err);
                return res.status(401).json({ status: 401, message: err.message });
        }
};
exports.DeleteAmbulanceVehicle = async (req, res) => {
        try {
                const id = req.params.id;
                const banner = await vehicleAmbulance.findById(id);
                if (!banner) {
                        return res.status(404).json({ message: "Vehicle Not Found", status: 404, data: {} });
                }
                const result = await vehicleAmbulance.deleteOne({ _id: id });
                if (result.deletedCount > 0) {
                        await driverVehicalCategory.deleteOne({ vehicleAmbulance: req.params.id });
                        return res.status(200).json({ status: 200, message: "Vehicle deleted successfully" });
                } else {
                        return res.status(404).json({ status: 404, message: 'Vehicle data not found for the specified ID' });
                }
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getSettleBooking = async (req, res) => {
        try {
                const booking = await settleBooking.find().populate('user driver');
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
exports.assignDriverOnSettleBooking = async (req, res) => {
        try {
                const booking = await settleBooking.findById({ _id: req.params.bookingId });
                if (booking) {
                        const user = await User.findOne({ _id: req.body.driverId, role: "driver" });
                        if (user) {
                                const findBooking = await driverSettleBooking.findOne({ driver: req.body.driverId });
                                if (findBooking) {
                                        let bookingId = await reffralCode();
                                        await driverSettleBooking.findByIdAndUpdate({ _id: findBooking._id }, { $set: { settleBookingId: bookingId }, $push: { booking: req.params.bookingId } }, { new: true });
                                        const booking1 = await settleBooking.findByIdAndUpdate({ _id: booking._id }, { $set: { driver: user._id, status: "Accept", settleBookingId: bookingId } }, { new: true });
                                        return res.status(200).json({ status: 200, message: 'Booking assign to driver successfully', data: booking1 });
                                } else {
                                        let bookingId = await reffralCode();
                                        let bookingArr = [];
                                        bookingArr.push(req.params.bookingId);
                                        await driverSettleBooking.create({ driver: req.body.driverId, settleBookingId: bookingId, booking: bookingArr, });
                                        const booking1 = await settleBooking.findByIdAndUpdate({ _id: booking._id }, { $set: { driver: user._id, status: "Accept", settleBookingId: bookingId } }, { new: true });
                                        return res.status(200).json({ status: 200, message: 'Booking assign to driver successfully', data: booking1 });
                                }
                        } else {
                                return res.status(404).json({ status: 404, message: 'user not found.', data: {} });
                        }
                } else {
                        return res.status(404).json({ status: 404, message: 'Booking request not found.', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getBooking = async (req, res) => {
        try {
                if (req.query.status == 'complete') {
                        const booking = await Booking.find({ status: 'complete' }).populate('userId driver genderCategory car superCar serviceCategory');
                        if (booking.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Booking found successfully', data: booking });
                        } else {
                                return res.status(404).json({ status: 404, message: 'Booking not found.', data: booking });
                        }
                } else if (req.query.status == 'cancel') {
                        const booking = await Booking.find({ status: 'cancel' }).populate('userId driver genderCategory car superCar serviceCategory');
                        if (booking.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Booking found successfully', data: booking });
                        } else {
                                return res.status(404).json({ status: 404, message: 'Booking not found.', data: booking });
                        }
                } else if (req.query.status == 'Schedule') {
                        const booking = await Booking.find({ status: { $ne: ['complete', 'cancel'] } }).populate('userId driver genderCategory car superCar serviceCategory');
                        if (booking.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Booking found successfully', data: booking });
                        } else {
                                return res.status(404).json({ status: 404, message: 'Booking not found.', data: booking });
                        }
                } else {
                        const booking = await Booking.find({}).populate('userId driver genderCategory car superCar serviceCategory');
                        if (booking.length > 0) {
                                return res.status(200).json({ status: 200, message: 'Booking found successfully', data: booking });
                        } else {
                                return res.status(404).json({ status: 404, message: 'Booking not found.', data: booking });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getBookingById = async (req, res) => {
        try {
                const findPrivacy = await Booking.findById({ _id: req.params.bookingId }).populate('userId driver genderCategory car superCar serviceCategory vehicleAmbulance');
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
exports.addCommission = async (req, res, next) => {
        try {
                let findVehicalType = await commission.findOne({});
                if (findVehicalType) {
                        let adminCommission, driverCommission, disCountType;
                        disCountType = req.body.disCountType;
                        if (disCountType == "FLAT") {
                                adminCommission = Number(req.body.adminCommission);
                                driverCommission = 0;
                        } else if (disCountType == "PERCENTAGE") {
                                adminCommission = Number(req.body.adminCommission);
                                driverCommission = 100 - adminCommission;
                        } else {
                                disCountType = findVehicalType.disCountType;
                                adminCommission = findVehicalType.adminCommission;
                                driverCommission = findVehicalType.driverCommission;

                        }
                        var obj = {
                                adminCommission: adminCommission,
                                driverCommission: driverCommission,
                                disCountType: req.body.disCountType,
                                serviceTax: req.body.serviceTax,
                                driverSearchRadius: req.body.driverSearchRadius,
                                userCanScheduleBookAfterMin: req.body.userCanScheduleBookAfterMin,
                                minimumTimeDriverFindInMinutes: req.body.minimumTimeDriverFindInMinutes,
                                maximumTimeFindInMinutesDriverForRegularRide: req.body.maximumTimeFindInMinutesDriverForRegularRide,
                        };
                        const result = await commission.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add Commision successfully.', data: result });
                        }
                } else {
                        let adminCommission, driverCommission;
                        if (req.body.disCountType == "FLAT") {
                                adminCommission = Number(req.body.adminCommission);
                                driverCommission = 0;
                        } else if (req.body.disCountType == "PERCENTAGE") {
                                adminCommission = Number(req.body.adminCommission);
                                driverCommission = 100 - adminCommission;
                        }
                        var obj = {
                                adminCommission: adminCommission,
                                driverCommission: driverCommission,
                                disCountType: req.body.disCountType,
                                serviceTax: req.body.serviceTax,
                                driverSearchRadius: req.body.driverSearchRadius,
                                userCanScheduleBookAfterMin: req.body.userCanScheduleBookAfterMin,
                                minimumTimeDriverFindInMinutes: req.body.minimumTimeDriverFindInMinutes,
                                maximumTimeFindInMinutesDriverForRegularRide: req.body.maximumTimeFindInMinutesDriverForRegularRide,
                        };
                        let result = await commission(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add Commision successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteCommission = async (req, res, next) => {
        try {
                let findVehicalType = await commission.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "commission not found", data: {}, });
                } else {
                        let updates = await commission.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }

        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getCommission = async (req, res) => {
        try {
                const booking = await commission.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'Commission found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'Commission not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getAllBookingTransaction = async (req, res) => {
        try {
                const acceptedOrders = await bookingPayment.find({}).populate("user driverId");
                if (acceptedOrders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getAllWalletTransaction = async (req, res) => {
        try {
                if (req.query.role != (null || undefined)) {
                        const acceptedOrders = await transactionModel.find({ role: req.query.role }).populate("user");
                        if (acceptedOrders.length == 0) {
                                return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                        }
                        return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
                } else {
                        const acceptedOrders = await transactionModel.find({}).populate("user");
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
exports.getAllSosRequest = async (req, res) => {
        try {
                const acceptedOrders = await sosRequest.find({}).populate("user");
                if (acceptedOrders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "sosRequest data found", data: acceptedOrders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getSosRequestById = async (req, res) => {
        try {
                const findPrivacy = await sosRequest.findById({ _id: req.params.id }).populate('user');
                if (findPrivacy) {
                        return res.status(200).json({ status: 200, message: 'Data found for the specified', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.approvedRejectSosRequestById = async (req, res) => {
        try {
                const findPrivacy = await sosRequest.findById({ _id: req.params.id }).populate('user');
                if (findPrivacy) {
                        let update = await sosRequest.findByIdAndUpdate({ _id: findPrivacy._id }, { $set: { status: req.body.status } }, { new: true });
                        return res.status(200).json({ status: 200, message: 'Data found for the specified', data: update });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getAllPayoutTransaction = async (req, res) => {
        try {
                const acceptedOrders = await payoutTransaction.find({ transactionType: "PAYOUT" }).populate("userId");
                if (acceptedOrders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getAllRefundTransaction = async (req, res) => {
        try {
                const acceptedOrders = await payoutTransaction.find({ transactionType: "REFUND" }).populate("userId");
                if (acceptedOrders.length == 0) {
                        return res.status(404).json({ status: 404, message: "Data not found", data: {} });
                }
                return res.status(200).json({ status: 200, message: "Data found", data: acceptedOrders });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
        }
};
exports.getPayoutRefundTransactionById = async (req, res) => {
        try {
                const findPrivacy = await payoutTransaction.findById({ _id: req.params.id }).populate('userId');
                if (findPrivacy) {
                        return res.status(200).json({ status: 200, message: 'Data found for the specified', data: findPrivacy });
                } else {
                        return res.status(404).json({ status: 404, message: 'Data not found for the specified', data: {} });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.withdrawApprove = async (req, res, next) => {
        try {

                console.log(req.params.id)
                let data = await payoutTransaction.findOne({ _id: req.params.id });
                if (!data) {
                        return res.status(404).send({ status: 404, message: "Data not found ", data: {} });
                } else {
                        if (data.status == "PAID") {
                                return res.status(409).send({ status: 409, message: "Already Paid ", data: {} });
                        } else {
                                if (req.body.status == "PAID") {
                                        if (req.file) {
                                                req.body.screenShot = req.file.path;
                                                let update = await payoutTransaction.findByIdAndUpdate({ _id: data._id }, { $set: req.body }, { new: true });
                                                if (update) {
                                                        let findUser = await User.findOne({ _id: data.userId });
                                                        let amount = findUser.walletBalance - update.amount
                                                        await User.findByIdAndUpdate({ _id: data.userId }, { $set: { walletBalance: amount } }, { new: true });
                                                        return res.status(200).send({ status: 200, message: "Send money to driver successfully ", data: update });
                                                }
                                        }
                                } else if (req.body.status == "PENDING") {
                                        if (req.file) {
                                                req.body.screenShot = req.file.path;
                                                let update = await payoutTransaction.findByIdAndUpdate({ _id: data._id }, { $set: req.body }, { new: true });
                                                if (update) {
                                                        return res.status(200).send({ status: 200, message: "Send money to driver successfully ", data: update });
                                                }
                                        } else {
                                                let update = await payoutTransaction.findByIdAndUpdate({ _id: data._id }, { $set: req.body }, { new: true });
                                                if (update) {
                                                        return res.status(200).send({ status: 200, message: "Send money to driver successfully ", data: update });
                                                }
                                        }
                                } else {
                                        if (req.file) {
                                                req.body.screenShot = req.file.path;
                                                let update = await payoutTransaction.findByIdAndUpdate({ _id: data._id }, { $set: req.body }, { new: true });
                                                if (update) {
                                                        return res.status(200).send({ status: 200, message: "Send money to driver successfully ", data: update });
                                                }
                                        } else {
                                                let update = await payoutTransaction.findByIdAndUpdate({ _id: data._id }, { $set: req.body }, { new: true });
                                                if (update) {
                                                        return res.status(200).send({ status: 200, message: "Send money to driver successfully ", data: update });
                                                }
                                        }
                                }
                        }
                }
        } catch (error) {
                return res.status(500).json({ status: 500, message: "Internal server error", data: error, });
        }
};
exports.allDriverDetail = async (req, res) => {
        try {
                const driverDetails = await DriverDetail.find({}).populate("driver city driverVehicleCategory");
                if (driverDetails.length == 0) {
                        return res.status(404).json({ status: 404, message: "Driver details not found" });
                }
                return res.status(200).json({ status: 200, message: "Driver details found", data: driverDetails });
        } catch (error) {
                console.error("Error:", error);
                return res.status(500).json({ status: 500, message: "Internal server error", data: error, });
        }
}
exports.addEmergencyDetails = async (req, res, next) => {
        try {
                let findVehicalType = await emergencyDetails.findOne();
                if (findVehicalType) {
                        var obj = {
                                phone: req.body.phone || findVehicalType.phone,
                                phoneText: req.body.phoneText || findVehicalType.phoneText,
                                policeNumber: req.body.policeNumber || findVehicalType.policeNumber,
                                policeNumberText: req.body.policeNumberText || findVehicalType.policeNumberText,
                                ambulanceNumber: req.body.ambulanceNumber || findVehicalType.ambulanceNumber,
                                ambulanceNumberText: req.body.ambulanceNumberText || findVehicalType.ambulanceNumberText,
                        };
                        const result = await emergencyDetails.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add emergencyDetails successfully.', data: result });
                        }
                } else {
                        var obj = {
                                phone: req.body.phone,
                                phoneText: req.body.phoneText,
                                policeNumber: req.body.policeNumber,
                                policeNumberText: req.body.policeNumberText,
                                ambulanceNumber: req.body.ambulanceNumber,
                                ambulanceNumberText: req.body.ambulanceNumberText,
                        };
                        let result = await emergencyDetails(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add emergencyDetails successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteEmergencyDetails = async (req, res, next) => {
        try {
                let findVehicalType = await emergencyDetails.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "emergencyDetails not found", data: {}, });
                } else {
                        let updates = await emergencyDetails.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }

        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getEmergencyDetails = async (req, res) => {
        try {
                const booking = await emergencyDetails.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'EmergencyDetails found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'EmergencyDetails not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.addMapSetting = async (req, res, next) => {
        try {
                let findVehicalType = await mapSetting.findOne();
                if (findVehicalType) {
                        var obj = {
                                googleMapKeyForWebApp: req.body.googleMapKeyForWebApp || findVehicalType.googleMapKeyForWebApp,
                                googleMapKeyForDistanceMatrix: req.body.googleMapKeyForDistanceMatrix || findVehicalType.googleMapKeyForDistanceMatrix,
                                googleSheetId: req.body.googleSheetId || findVehicalType.googleSheetId,
                        };
                        const result = await mapSetting.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add MapSetting successfully.', data: result });
                        }
                } else {
                        var obj = {
                                googleMapKeyForWebApp: req.body.googleMapKeyForWebApp,
                                googleMapKeyForDistanceMatrix: req.body.googleMapKeyForDistanceMatrix,
                                googleSheetId: req.body.googleSheetId,
                        };
                        let result = await mapSetting(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add MapSetting successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteMapSetting = async (req, res, next) => {
        try {
                let findVehicalType = await mapSetting.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "mapSetting not found", data: {}, });
                } else {
                        let updates = await mapSetting.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }

        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getMapSetting = async (req, res) => {
        try {
                const booking = await mapSetting.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'MapSetting found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'MapSetting not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.addReferralSetting = async (req, res, next) => {
        try {
                let findVehicalType = await referralSetting.findOne();
                if (findVehicalType) {
                        var obj = {
                                referralForDriver: req.body.referralForDriver || findVehicalType.referralForDriver,
                                referralForUser: req.body.referralForUser || findVehicalType.referralForUser,
                        };
                        const result = await referralSetting.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add referralSetting successfully.', data: result });
                        }
                } else {
                        var obj = {
                                referralForDriver: req.body.referralForDriver,
                                referralForUser: req.body.referralForUser,
                        };
                        let result = await referralSetting(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add referralSetting successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteReferralSetting = async (req, res, next) => {
        try {
                let findVehicalType = await referralSetting.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "referralSetting not found", data: {}, });
                } else {
                        let updates = await referralSetting.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }

        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getReferralSetting = async (req, res) => {
        try {
                const booking = await referralSetting.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'ReferralSetting found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'ReferralSetting not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.addWalletSetting = async (req, res, next) => {
        try {
                let findVehicalType = await walletSetting.findOne();
                if (findVehicalType) {
                        var obj = {
                                walletMinimumAmount: req.body.walletMinimumAmount || findVehicalType.walletMinimumAmount,
                                walletMinimumAmountToAdd: req.body.walletMinimumAmountToAdd || findVehicalType.walletMinimumAmountToAdd,
                                walletMaximumAmountToAdd: req.body.walletMaximumAmountToAdd || findVehicalType.walletMaximumAmountToAdd,
                                driverWalletMinimumAmountToGetOrder: req.body.driverWalletMinimumAmountToGetOrder || findVehicalType.driverWalletMinimumAmountToGetOrder,
                        };
                        const result = await walletSetting.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add walletSetting successfully.', data: result });
                        }
                } else {
                        var obj = {
                                walletMinimumAmount: req.body.walletMinimumAmount,
                                walletMinimumAmountToAdd: req.body.walletMinimumAmountToAdd,
                                walletMaximumAmountToAdd: req.body.walletMaximumAmountToAdd,
                                driverWalletMinimumAmountToGetOrder: req.body.driverWalletMinimumAmountToGetOrder,
                        };
                        let result = await walletSetting(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add walletSetting successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteWalletSetting = async (req, res, next) => {
        try {
                let findVehicalType = await walletSetting.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "walletSetting not found", data: {}, });
                } else {
                        let updates = await walletSetting.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }

        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getWalletSetting = async (req, res) => {
        try {
                const booking = await walletSetting.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'WalletSetting found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'WalletSetting not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.addAppSetting = async (req, res, next) => {
        try {
                let findVehicalType = await appSetting.findOne();
                if (findVehicalType) {
                        let logo, favicon;
                        if (req.files['logo']) {
                                logo = req.files['logo'];
                                req.body.logo = logo[0].path;
                        } else {
                                req.body.logo = findVehicalType.logo
                        }
                        if (req.files['favicon']) {
                                favicon = req.files['favicon'];
                                req.body.favicon = favicon[0].path;
                        } else {
                                req.body.favicon = findVehicalType.favicon
                        }
                        var obj = {
                                logo: req.body.logo,
                                favicon: req.body.favicon,
                                appName: req.body.appName || findVehicalType.appName,
                                currencyName: req.body.currencyName || findVehicalType.currencyName,
                                countryCode: req.body.countryCode || findVehicalType.countryCode,
                                latitude: req.body.latitude || findVehicalType.latitude,
                                longitude: req.body.longitude || findVehicalType.longitude,
                        };
                        const result = await appSetting.findByIdAndUpdate({ _id: findVehicalType._id }, { $set: obj }, { new: true });
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add appSetting successfully.', data: result });
                        }
                } else {
                        let logo, favicon;
                        if (req.files['logo']) {
                                logo = req.files['logo'];
                                req.body.logo = logo[0].path;
                        } else {
                                return res.status(404).json({ status: 404, message: 'Image not provide .', data: data });
                        }
                        if (req.files['favicon']) {
                                favicon = req.files['favicon'];
                                req.body.favicon = favicon[0].path;
                        } else {
                                return res.status(404).json({ status: 404, message: 'Favicon not provide.', data: data });
                        }
                        var obj = {
                                logo: req.body.logo,
                                favicon: req.body.favicon,
                                appName: req.body.appName,
                                currencyName: req.body.currencyName,
                                countryCode: req.body.countryCode,
                                latitude: req.body.latitude,
                                longitude: req.body.longitude,
                        };
                        let result = await appSetting(obj).save();
                        if (result) {
                                return res.status(200).json({ status: 200, message: 'add appSetting successfully.', data: result });
                        }
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.deleteAppSetting = async (req, res, next) => {
        try {
                let findVehicalType = await appSetting.findOne({ _id: req.params.id });
                if (!findVehicalType) {
                        return res.status(404).send({ status: 404, message: "appSetting not found", data: {}, });
                } else {
                        let updates = await appSetting.findByIdAndDelete({ _id: findVehicalType._id });
                        if (updates) {
                                return res.status(200).json({ status: 200, message: 'Delete successully', data: updates });
                        }
                }
        } catch (error) {
                console.log(error)
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
exports.getAppSetting = async (req, res) => {
        try {
                const booking = await appSetting.findOne();
                if (booking) {
                        return res.status(200).json({ status: 200, message: 'AppSetting found successfully', data: booking });
                } else {
                        return res.status(404).json({ status: 404, message: 'AppSetting not found.', data: booking });
                }
        } catch (error) {
                console.error(error);
                return res.status(500).json({ status: 500, message: 'Server error', data: error });
        }
};
const reffralCode = async () => {
        var digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let OTP = '';
        for (let i = 0; i < 9; i++) {
                OTP += digits[Math.floor(Math.random() * 36)];
        }
        return OTP;
}