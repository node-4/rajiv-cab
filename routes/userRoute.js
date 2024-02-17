const express = require("express");
const userController = require("../controller/userController");
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
  app.post('/api/v1/user/register', userController.registerUser);
  app.post('/api/v1/user/verify/otp', userController.verifyOtp);
  app.post('/api/v1/user/login', userController.loginUser);
  app.get('/api/v1/user/me', authJwt.verifyToken, userController.getUserDetails);
  app.put('/api/v1/user/detail', authJwt.verifyToken, userController.updateProfile);
  app.post("/api/v1/user/createBooking", authJwt.verifyToken, userController.createBooking);
  app.post("/api/v1/user/createAmbulanceBooking", authJwt.verifyToken, userController.createAmbulanceBooking);
  app.post("/api/v1/user/createSettleBooking", authJwt.verifyToken, userController.createSettleBooking);
  app.post("/api/v1/user/createSuperCarBooking", authJwt.verifyToken, userController.createSuperCarBooking);
  app.post("/api/v1/user/createHourlyBooking", authJwt.verifyToken, userController.createHourlyBooking);
  app.get("/api/v1/user/get/booking", authJwt.verifyToken, userController.getBooking);
  app.get("/api/v1/user/get/booking/by/:bookingId", userController.getBookingById);
  app.put("/api/v1/user/cancelBooking/:bookingId", authJwt.verifyToken, userController.cancelBooking);







  /////////////////////////////// pending check and update //////////////////////////
  app.get("/api/v1/user/popularLocation", authJwt.verifyToken, userController.popularLocation);
  app.get("/api/v1/user/compare/car/:latitude/:longitude", userController.compareCars);
  app.get("/api/v1/user/get/order/:latitude/:longitude", authJwt.verifyToken, userController.getOrder);
};
