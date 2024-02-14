const express = require("express");
const userController = require("../controller/vendorController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dtijhcmaa", api_key: "624644714628939", api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY", });
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], },
});

const upload = multer({ storage: storage });
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
  app.post('/api/v1/vendor/register', userController.registerVendor);
  app.post('/api/v1/vendor/verify/otp', userController.verifyOtpVendor);
  app.post('/api/v1/vendor/login', userController.loginVendor);
  app.get('/api/v1/vendor/me', authJwt.verifyToken, userController.getVendorDetails);
  app.put('/api/v1/vendor/detail', authJwt.verifyToken, userController.updateProfile);
};
