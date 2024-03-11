const driverController = require("../controller/driverController");
const authJwt = require("../middleware/authJwt");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dtijhcmaa", api_key: "624644714628939", api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
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


module.exports = (app) => {
  app.post("/api/v1/driver/register", driverController.registerDriver);
  app.post("/api/v1/driver/login", driverController.loginDriver);
  app.post("/api/v1/driver/verify/login", driverController.verifyOtpLogin);
  app.post("/api/v1/driver/resend/otp", driverController.resendOTP);
  app.post("/api/v1/driver/google/login", driverController.socialLogin);
  app.get("/api/v1/driver/getDriverVehicleCategory", driverController.getDriverVehicleCategory);
  app.get("/api/v1/driver/me", authJwt.verifyToken, driverController.getDriverDetails);
  app.put("/api/v1/driver/detail", authJwt.verifyToken, upload.single('profilePicture'), driverController.updateDriverProfile);
  app.post("/api/v1/driver/detail/driver", authJwt.verifyToken, driverController.documentDriverDetail);
  app.post("/api/v1/driver/image/:id", uploadDriverImages, driverController.driverImage);
  app.get("/api/v1/driver/my/car/detail/:driverId", driverController.allDriverDetail);
  app.put("/api/v1/driver/detail/location", authJwt.verifyToken, driverController.updateLocation);
  app.get("/api/v1/driver/latest/booking", authJwt.verifyToken, driverController.latestBooking);
  app.put("/api/v1/driver/stop/booking/:bookingId", authJwt.verifyToken, driverController.stopBooking);
  app.put("/api/v1/driver/accept/booking/:bookingId", authJwt.verifyToken, driverController.acceptBooking);
  app.post("/api/v1/driver/sendOtpToUserBooking/:bookingId", authJwt.verifyToken, driverController.sendOtpToUserBooking);
  app.post("/api/v1/driver/otp/booking/:bookingId", authJwt.verifyToken, driverController.startBooking);
  app.get("/api/v1/driver/date/booking/:selectedDate", driverController.getBookingByDate);
  app.get("/api/v1/driver/my/booking", authJwt.verifyToken, driverController.myBooking);
  app.get('/api/v1/driver/getSettleBooking', authJwt.verifyToken, driverController.getSettleBooking);
  app.get('/api/v1/driver/getSettleBookingById/:bookingId', driverController.getSettleBookingById);
  app.post("/api/v1/driver/bookingPayments/:bookingId", driverController.bookingPayment);
  app.get("/api/v1/driver/getMyEarning", authJwt.verifyToken, driverController.getMyEarning);
};
