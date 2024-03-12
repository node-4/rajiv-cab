const User = require("../model/Auth/userModel");
const randomatic = require("randomatic");
const jwt = require("jsonwebtoken");
const genderCategory = require("../model/Category/genderCategory");
const vehicleAmbulance = require('../model/Vehical/vehicleAmbulance');
const DriverDetail = require("../model/Auth/driverDetail");
const Booking = require("../model/booking/booking");
const Pricing = require("../model/pricing/dailyPricing");
const vehicle = require('../model/Vehical/vehicleModel')
const settleBooking = require("../model/booking/settleBooking");
const basePricing = require("../model/pricing/basePricing");
const dailyPricing = require("../model/pricing/dailyPricing");
const hourlyModel = require('../model/pricing/hourlyModel');
const cityModel = require('../model/cityState/cityModel')
const superCarPricing = require('../model/pricing/superCarPricing')
exports.registerUser = async (req, res) => {
    try {
        const { name, email, gender, mobileNumber, birthday, category } = req.body;
        const existingUser = await User.findOne({ mobileNumber, role: "user" });
        if (existingUser) {
            return res.status(400).json({ error: "User with this mobile number already exists" });
        }
        const otp = randomatic("0", 4); // Generate a 4-digit OTP
        const user = await User.findOneAndUpdate({ mobileNumber }, { name, email, gender, birthday, otp, category }, { new: true, upsert: true });
        return res.json({ message: "OTP sent successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.verifyOtp = async (req, res) => {
    try {
        const mobileNumber = req.body.mobileNumber;
        const otp = req.body.otp;
        const user = await User.findOne({ mobileNumber, role: "user" });
        if (!user) {
            // User not found, handle accordingly
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
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { mobileNumber } = req.body;
        let user = await User.findOne({ mobileNumber, role: "user" });
        if (!user) {
            const otp = randomatic("0", 4);
            user = new User({ mobileNumber, otp, });
            await user.save();
            return res.json({ message: "OTP generated and sent to the user", user });
        } else {
            const otp = randomatic("0", 4);
            user.otp = otp;
            user.isVerified = false;
            await user.save();
            return res.json({ message: "New OTP generated and sent to the user", user });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.getUserDetails = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("category");
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        } else {
            return res.status(200).send({ status: 200, message: "get profile ", data: user });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.updateProfile = async (req, res) => {
    try {
        const { name, email, address, gender, birthday, category } = req.body;
        const user = await User.findById({ _id: req.user.id });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        user.name = name;
        user.email = email;
        user.address = address;
        user.gender = gender;
        user.birthday = birthday;
        user.category = category;
        await user.save();
        return res.json({ message: "User profile updated successfully", user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.createSettleBooking = async (req, res) => {
    try {
        const { current, drop, pickUpTime, dropTime, km, city, vehicle, day } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const findPrivacy2 = await cityModel.findOne({ city: city });
        if (!findPrivacy2) {
            return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
        }
        let pricingDetails = await basePricing.findOne({ vehicle: vehicle, city: findPrivacy2._id, });
        let pricingDetails1 = await dailyPricing.findOne({ vehicle: vehicle, city: findPrivacy2._id, toKm: { $gte: km }, fromKm: { $lte: km } });
        let pricing = ((pricingDetails1.price * km) + pricingDetails.basePrice + pricingDetails.taxRate + pricingDetails.gstRate + pricingDetails.serviceCharge + pricingDetails.nightCharges + pricingDetails.waitingCharge + pricingDetails.trafficCharge) * day;
        let obj = {
            user: user._id,
            pickUpTime: pickUpTime,
            current: current,
            drop: drop,
            dropTime: dropTime,
            km: km,
            pricing: pricing
        }
        const booking = await settleBooking.create(obj);
        if (booking) {
            return res.status(200).json({ status: 200, message: 'Bokking request send successfully', data: booking });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.createSuperCarBooking = async (req, res) => {
    try {
        const { date, current, drop, time, superCarPricingId } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const pricingDetails = await superCarPricing.findOne({ _id: superCarPricingId });
        if (!pricingDetails) {
            return res.status(404).json({ success: false, message: 'No pricing details found for the selected car type' });
        }
        totalCharges = pricingDetails.price;
        const booking = await Booking.create({ userId: user._id, current, superCar: pricingDetails.superCar, type: "superCar", serviceType: "superCar", time: time, drop, date, totalPrice: totalCharges });
        return res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.createHourlyBooking = async (req, res) => {
    try {
        const { vehicleId, city, distance, date, time, current, drop, hour } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const carId = await vehicle.findById({ _id: vehicleId });
        if (!carId) {
            return res.status(404).json({ status: 404, message: 'Data not found for the specified type', data: {} });
        }
        const findPrivacy2 = await cityModel.findOne({ city: city });
        if (!findPrivacy2) {
            return res.status(404).json({ status: 404, message: 'Category  not found for the specified type', data: {} });
        }
        const pricingDetails = await hourlyModel.findOne({ vehicle: vehicleId, city: findPrivacy2._id, km: distance, hours: hour });
        if (!pricingDetails) {
            return res.status(404).json({ success: false, message: 'No pricing details found for the selected car type' });
        }
        totalCharges = pricingDetails.price;
        const booking = await Booking.create({ userId: user._id, current, type: "Hourly", serviceType: "Hourly", car: carId._id, drop, distance, hour, date, time, totalPrice: totalCharges });
        return res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.getBooking = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const bookingData = await Booking.find({ userId: user._id }).populate("car");
        if (bookingData.length == 0) {
            return res.status(404).json({ status: 404, message: 'Bokking data not found', data: {} });
        }
        return res.status(200).json({ status: 200, message: 'Bokking data found', data: bookingData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.getBookingById = async (req, res) => {
    try {
        const bookingData = await Booking.findOne({ _id: req.params.bookingId }).populate("car").populate("driver");
        if (!bookingData) {
            return res.status(404).json({ status: 404, message: 'Bokking data not found', data: {} });
        }
        return res.status(200).json({ status: 200, message: 'Bokking data found', data: bookingData });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.cancelBooking = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const bookingData = await Booking.findOne({ _id: req.params.bookingId, userId: user._id, }).populate("car").populate("driver");
        if (!bookingData) {
            return res.status(404).json({ status: 404, message: 'Bokking data not found', data: {} });
        }
        const updatedLocation = await Booking.findByIdAndUpdate({ _id: bookingData._id }, { $set: { driver: null, status: "cancel" } }, { new: true });
        return res.status(200).json({ status: 200, message: 'Bokking canceled successfully', data: updatedLocation });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: 500, message: "Internal server error", data: error.message, });
    }
};
exports.createBooking = async (req, res) => {
    try {
        const { vehicleId, city, distance, date, time, current, drop, hour, serviceType } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found", data: {} });
        }
        const carId = await vehicle.findById(vehicleId);
        if (!carId) {
            return res.status(404).json({ status: 404, message: 'Vehicle not found', data: {} });
        }
        const findPrivacy2 = await cityModel.findOne({ city });
        if (!findPrivacy2) {
            return res.status(404).json({ status: 404, message: 'City not found', data: {} });
        }
        let pricingDetails = await basePricing.findOne({ vehicle: carId._id, city: findPrivacy2._id });
        if (!pricingDetails) {
            return res.status(404).json({ success: false, message: 'No pricing details found for the selected car type' });
        }
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
        let totalCharges = 0;
        const pricingDetails1 = await dailyPricing.find({ vehicle: carId._id, city: findPrivacy2._id });
        console.log(pricingDetails1)
        totalCharges = calculatePricing(distance, pricingDetails1)
        let additionalCharges = pricingDetails.basePrice + pricingDetails.taxRate + pricingDetails.gstRate + pricingDetails.serviceCharge + pricingDetails.nightCharges + pricingDetails.waitingCharge + pricingDetails.trafficCharge;
        let totalPrice = totalCharges + additionalCharges;
        const booking = await Booking.create({
            userId: user._id,
            current,
            drop,
            distance,
            hour,
            car: carId._id,
            date,
            time,
            totalPrice,
            serviceType,
            additionalCharges,
            price: totalCharges
        });
        return res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.createAmbulanceBooking = async (req, res) => {
    try {
        const { vehicleId, distance, date, time, current, drop, hour } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "User not found", data: {} });
        }
        const pricingDetails = await vehicleAmbulance.findById(vehicleId);
        if (!pricingDetails) {
            return res.status(404).json({ status: 404, message: 'Vehicle not found', data: {} });
        }
        let totalCharges = pricingDetails.perKm * distance;
        let additionalCharges = pricingDetails.basePrice + pricingDetails.taxRate + pricingDetails.gstRate + pricingDetails.serviceCharge + pricingDetails.nightCharges + pricingDetails.waitingCharge + pricingDetails.trafficCharge;
        let totalPrice = totalCharges + additionalCharges;
        const booking = await Booking.create({
            userId: user._id,
            current,
            drop,
            distance,
            hour,
            vehicleAmbulance: pricingDetails._id,
            date,
            time,
            totalPrice,
            serviceType: 'ambulance',
            additionalCharges,
            price: totalCharges
        });
        return res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
/////////////////////////////// pending check and update //////////////////////////
exports.popularLocation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).send({ status: 404, message: "user not found ", data: {} });
        }
        const dropAddresses = await Booking.find({ userId: user._id }, { 'drop.address': 1, _id: 0 });
        if (!dropAddresses || dropAddresses.length === 0) {
            return res.status(404).json({ error: 'No drop addresses found for the given userId' });
        }
        return res.status(200).json({ status: 200, message: 'Drop addresses retrieved successfully', data: dropAddresses, });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: 500, message: 'Server error', data: error });
    }
};
exports.compareCars = async (req, res) => {
    try {
        const userLatitude = parseFloat(req.params.latitude);
        const userLongitude = parseFloat(req.params.longitude);

        if (isNaN(userLatitude) || isNaN(userLongitude)) {
            return res.status(400).json({ error: 'Invalid coordinates provided' });
        }

        const maxDistanceInKm = 5;
        const maxDistanceInMeters = maxDistanceInKm * 1000;

        const usersWithinDistance = await User.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [userLongitude, userLatitude],
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistanceInMeters,
                    spherical: true,
                },
            },
        ]);
        const formattedUsers = usersWithinDistance.map((user) => ({
            ...user,
            distance: user.distance / 1000,
        }));

        if (formattedUsers.length === 0) {
            const hypotheticalUserCoordinates = { latitude: 40.0, longitude: -75.0 };

            const distanceToHypotheticalUser = geolib.getDistance(
                { latitude: userLatitude, longitude: userLongitude },
                hypotheticalUserCoordinates
            );

            return res.status(404).json({
                error: 'No users found within 5km',
                hypotheticalDistance: distanceToHypotheticalUser / 1000,
            });
        }

        res.json({ success: true, users: formattedUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
exports.getOrder = async (req, res) => {
    try {
        const userLatitude = parseFloat(req.params.latitude);
        const userLongitude = parseFloat(req.params.longitude);
        const driverId = req.user.id;
        const driverDetails = await DriverDetail.findOne({ driver: driverId });
        if (!driverDetails) {
            return res.status(404).json({ success: false, message: 'Driver details not found' });
        }
        const driverCategory = driverDetails.type;
        console.log(driverCategory);
        if (isNaN(userLatitude) || isNaN(userLongitude)) {
            return res.status(400).json({ error: 'Invalid coordinates provided' });
        }
        const maxDistanceInKm = 5;
        const maxDistanceInMeters = maxDistanceInKm * 1000;
        const usersWithinDistance = await Booking.aggregate([
            {
                $geoNear: {
                    near: {
                        type: 'Point',
                        coordinates: [userLongitude, userLatitude],
                    },
                    distanceField: 'distance',
                    maxDistance: maxDistanceInMeters,
                    spherical: true,
                },
            },
            // {
            //   $match: {
            //     'car': driverCategory,
            //     'status': 'pending',
            //     // 'status': 'accepted',
            //   },
            // },
        ]);
        const formattedUsers = usersWithinDistance.map((user) => ({
            ...user,
            distance: user.distance / 1000,
        }));

        if (formattedUsers.length === 0) {
            const hypotheticalUserCoordinates = { latitude: 40.0, longitude: -75.0 };
            const distanceToHypotheticalUser = geolib.getDistance({ latitude: userLatitude, longitude: userLongitude }, hypotheticalUserCoordinates);
            return res.status(404).json({ error: 'No users found within 5km', hypotheticalDistance: distanceToHypotheticalUser / 1000, });
        }
        res.json({ success: true, users: formattedUsers });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
// exports.getProductsByBooking = async (req, res) => {
//   const userLatitude = parseFloat(req.params.latitude);
//   const userLongitude = parseFloat(req.params.longitude);

//   if (isNaN(userLatitude) || isNaN(userLongitude)) {
//     return res.status(400).json({ error: 'Invalid coordinates provided' });
//   }

//   const maxDistanceInKm = 5; // 5 kilometers

//   try {
//     const maxDistanceInMeters = maxDistanceInKm * 1000; // Convert to meters

//     const productsWithinDistance = await Product.aggregate([
//       {
//         $geoNear: {
//           near: {
//             type: 'Point',
//             coordinates: [userLongitude, userLatitude],
//           },
//           distanceField: 'distance',
//           maxDistance: maxDistanceInMeters,
//           spherical: true,
//         },
//       },
//     ]);

//     // Extract distance and remove the "_id" field
//     const formattedProducts = productsWithinDistance.map((product) => ({
//       ...product,
//       distance: product.distance / 1000, // Convert meters to kilometers
//     }));

//     if (formattedProducts.length === 0) {
//       // Calculate distance between the user and a hypothetical product
//       const hypotheticalProductCoordinates = { latitude: 40.0, longitude: -75.0 }; // Example coordinates
//       const distanceToHypotheticalProduct = geolib.getDistance(
//         { latitude: userLatitude, longitude: userLongitude },
//         hypotheticalProductCoordinates
//       );

//       return res.status(404).json({
//         error: 'No products found within 5km',
//         hypotheticalDistance: distanceToHypotheticalProduct / 1000, // Convert meters to kilometers
//       });
//     }

//     res.json({ success: true, products: formattedProducts });
//   } catch (err) {
//     console.error(err);
//  return   res.status(500).json({ error: 'Internal server error' });
//   }
// };


// exports.chooseCar = async (req, res) => {
//   try {
//     const { carId, distance, date, time } = req.body;
//     const userId  = req.user; // Corrected destructuring
//   console.log(req.user);
//     if (!userId) {
//       return res.status(401).json({ success: false, message: 'User not authenticated' });
//     }

//     const category = userId.category;
// console.log(category);
//     // Fetch pricing details for the selected car type and category
//     const pricingDetails = await Pricing.findOne({ carType: carId, category });

//     if (!pricingDetails) {
//       return res.status(404).json({ success: false, message: 'No pricing details found for the selected car type' });
//     }

//     // Calculate total price based on pricing details and any other factors
//     const totalCharges =
//       pricingDetails.basePrice +
//       pricingDetails.kmRate * distance +
//       pricingDetails.taxRate +
//       pricingDetails.gstRate +
//       pricingDetails.serviceCharge +
//       pricingDetails.nightCharges +
//       pricingDetails.waitingCharge +
//       pricingDetails.trafficCharge;

//     // Generate a 4-digit OTP
//     const otp = randomatic('0', 4);

//     // Update user location with car details and total price
//     const booking = await Booking.findByIdAndUpdate(
//       req.params.locationId,
//       { $set: { car: carId, date, time, otp, totalPrice: totalCharges } },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ message: 'User location not found' });
//     }

//  return   res.status(200).json({ booking, otp });
//   } catch (error) {
//     console.error('Error:', error);
//  return   res.status(500).json({
//       status: 500,
//       message: 'Internal server error',
//       data: error.message,
//     });
//   }
// };