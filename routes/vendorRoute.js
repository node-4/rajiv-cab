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
const uploadDriverImages = (req, res, next) => {
  upload.fields([{ name: "interior", maxCount: 1 },
  { name: "exterior", maxCount: 1 },
  { name: "permit", maxCount: 1 },
  { name: "fitness", maxCount: 1 },
  { name: "insurance", maxCount: 1 },
  { name: "drivinglicense", maxCount: 1 },
  { name: "aadharCard", maxCount: 1 },
  { name: "cancelCheck", maxCount: 1 },
  { name: "bankStatement", maxCount: 1 },
  { name: "rc", maxCount: 1 },])(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ msg: err.message });
    }
    const fileUrls = {};
    for (const field in req.files) {
      if (req.files[field] && req.files[field][0]) {
        fileUrls[field] = req.files[field][0].path;
      }
    }
    req.fileUrls = fileUrls;
    next();
  });
};
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
  app.post('/api/v1/vendor/register', userController.registerVendor);
  app.post('/api/v1/vendor/verify/otp', userController.verifyOtpVendor);
  app.post('/api/v1/vendor/login', userController.loginVendor);
  app.get('/api/v1/vendor/me', authJwt.verifyToken, userController.getVendorDetails);
  app.put('/api/v1/vendor/detail', authJwt.verifyToken, userController.updateProfile);
  app.post("/api/v1/vendor/detail/vendor", authJwt.verifyToken, userController.documentDriverDetail);
  app.post("/api/v1/vendor/image/:id", uploadDriverImages, userController.driverImage);
  app.get("/api/v1/vendor/my/car/detail/:vendorId", userController.allDriverDetail);
};