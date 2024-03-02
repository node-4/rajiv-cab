const express = require("express");
const adminController = require("../controller/adminController");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("cloudinary").v2;
cloudinary.config({ cloud_name: "dtijhcmaa", api_key: "624644714628939", api_secret: "tU52wM1-XoaFD2NrHbPrkiVKZvY", });
const storage = new CloudinaryStorage({ cloudinary: cloudinary, params: { folder: "images/image", allowed_formats: ["jpg", "jpeg", "png", "PNG", "xlsx", "xls", "pdf", "PDF"], }, });
const upload = multer({ storage: storage });
const uploadserviceCategory = upload.fields([{ name: 'image', maxCount: 1 }, { name: 'banner', maxCount: 1 }]);
const authJwt = require("../middleware/authJwt");
module.exports = (app) => {
  app.post('/api/v1/admin/register', adminController.RegisterAdmin);
  app.post('/api/v1/admin/login', adminController.loginAdmin);
  app.get('/api/v1/admin/me', authJwt.verifyToken, adminController.getAdminDetails);
  app.put('/api/v1/admin/detail', authJwt.verifyToken, upload.single('profilePicture'), adminController.updateAdminProfile);
  app.post('/api/v1/category', adminController.addCategory);
  app.get('/api/v1/category', adminController.getCategory);
  app.get('/api/v1/category/:id', adminController.getCategoryById);
  app.get('/api/v1/getUserById/:id', adminController.getUserById);
  app.put('/api/v1/category/:id', adminController.updateCategory);
  app.delete('/api/v1/category/:id', adminController.deleteCategory);
  app.get("/api/v1/admin/all/vendor", adminController.allVendor);
  app.get("/api/v1/admin/all/driver", adminController.allDriver);
  app.get("/api/v1/admin/all/user", adminController.allUser);
  app.delete("/api/v1/admin/delete/driver/:id", adminController.deleteDriver);
  app.put("/api/v1/admin/block/driver/:id", adminController.blockDriver);
  app.put("/api/v1/admin/Kyc/driver/:id", adminController.driverKycAcceptRejectHold);
  app.put("/api/v1/admin/unblock/driver/:id", adminController.unblockDriver);
  app.post('/api/v1/banner', upload.single('image'), adminController.AddBanner);
  app.get('/api/v1/banner/', adminController.getBanner);
  app.get('/api/v1/banner/type/:type', adminController.getBannerByType);
  app.put('/api/v1/banner/updateBanner/:id', upload.single('image'), adminController.updateBanner);
  app.delete('/api/v1/banner/:id', adminController.removeBanner)
  app.post('/api/v1/privacy/', adminController.addPrivacy);
  app.get('/api/v1/privacy/', adminController.getPrivacy);
  app.get('/api/v1/privacy/type/:type', adminController.getPrivacyByType);
  app.put('/api/v1/privacy/:id', adminController.updatePrivacy);
  app.delete('/api/v1/privacy/:id', adminController.DeletePrivacy);
  app.post('/api/v1/terms/', adminController.addTerms);
  app.get('/api/v1/terms/', adminController.getTerms);
  app.get('/api/v1/terms/:type', adminController.getTermsByType);
  app.put('/api/v1/terms/:id', adminController.updateTerms);
  app.delete('/api/v1/terms/:id', adminController.DeleteTerms);
  app.post('/api/v1/serviceCategory/', uploadserviceCategory, adminController.addServiceCategory);
  app.get('/api/v1/serviceCategory/', adminController.getServiceCategory);
  app.get('/api/v1/serviceCategory/:id', adminController.getServiceCategoryById);
  app.put('/api/v1/serviceCategory/:id', uploadserviceCategory, adminController.updateServiceCategory);
  app.delete('/api/v1/serviceCategory/:id', adminController.DeleteServiceCategory);
  app.post('/api/v1/vehicle', upload.single('image'), adminController.addVehicle);
  app.get('/api/v1/vehicle/', adminController.getVehicle);
  app.get('/api/v1/vehicle/:id', adminController.getVehicleById);
  app.put('/api/v1/vehicle/:id', upload.single('image'), adminController.updateVehicle);
  app.delete('/api/v1/vehicle/:id', adminController.DeleteVehicle);
  app.post("/api/v1/Pricing", adminController.addPricing);
  app.get("/api/v1/Pricing/:id", adminController.getPriceById);
  app.put("/api/v1/Pricing/:id", adminController.updatePricing);
  app.delete("/api/v1/Pricing/:id", adminController.deletePricing);
  app.get("/api/v1/Pricing", adminController.getPricing);
  app.post("/api/v1/Pricing/by/distance", authJwt.verifyToken, adminController.getPricingByDistance);
  app.post('/api/v1/AddHourlyPricing', adminController.AddHourlyPricing);
  app.get("/api/v1/getHourlyPricingById/:id", adminController.getHourlyPricingById);
  app.get('/api/v1/getHourlyPricing', adminController.getHourlyPricing);
  app.put('/api/v1/updateHourlyPricing/:id', adminController.updateHourlyPricing);
  app.delete('/api/v1/removeHourlyPricing/:id', adminController.removeHourlyPricing);
  app.post("/api/v1/HourlyPricing/by/distance", authJwt.verifyToken, adminController.getHourlyPricingByDistance);
  app.post('/api/v1/OutStationPricing/add', adminController.addOutStationPricing);
  app.get('/api/v1/OutStationPricing/get', adminController.getOutStationPricing);
  app.get("/api/v1/OutStationPricing/:id", adminController.getOutStationPricingById);
  app.put('/api/v1/OutStationPricing/update/:id', adminController.updateOutStationPricing);
  app.delete('/api/v1/OutStationPricing/delete/:id', adminController.deleteOutStationPricing);
  app.post("/api/v1/OutStationPricing/by/distance", authJwt.verifyToken, adminController.getOutStationPricingByDistance);
  app.post('/api/v1/BasePricing/add', adminController.addBasePricing);
  app.get('/api/v1/BasePricing/get', adminController.getBasePricing);
  app.get("/api/v1/BasePricing/:id", adminController.getBasePricingById);
  app.put('/api/v1/BasePricing/update/:id', adminController.updateBasePricing);
  app.delete('/api/v1/BasePricing/delete/:id', adminController.deleteBasePricing);
  app.post("/api/v1/SuperCar", upload.single('image'), adminController.addSuperCar);
  app.get("/api/v1/SuperCar/:id", adminController.getSuperCarById);
  app.put("/api/v1/SuperCar/:id", upload.single('image'), adminController.updateSuperCar);
  app.delete("/api/v1/SuperCar/:id", adminController.deleteSuperCar);
  app.get("/api/v1/SuperCar", adminController.getSuperCar);
  app.post("/api/v1/SuperCarPricing", upload.array('image'), adminController.addSuperCarPricing);
  app.get("/api/v1/SuperCarPricing/:id", adminController.getSuperCarPricingById);
  app.put("/api/v1/SuperCarPricing/:id", upload.array('image'), adminController.updateSuperCarPricing);
  app.delete("/api/v1/SuperCarPricing/:id", adminController.deleteSuperCarPricing);
  app.get("/api/v1/SuperCarPricing", adminController.getSuperCarPricing);
  app.post('/api/v1/State', adminController.addState);
  app.get('/api/v1/State/:id', adminController.getStateById);
  app.delete('/api/v1/State/:id', adminController.DeleteState);
  app.get('/api/v1/State', adminController.getState);
  app.post('/api/v1/City', adminController.addCity);
  app.get('/api/v1/City/:id', adminController.getCityById);
  app.put('/api/v1/City/:id', adminController.updateCity);
  app.delete('/api/v1/City/:id', adminController.DeleteCity);
  app.get('/api/v1/City/', adminController.getCity);
  app.post("/api/v1/notify", adminController.AddNotification);
  app.get("/api/v1/notify", adminController.GetAllNotification);
  app.get("/api/v1/notify/get/:id", adminController.GetBYNotifyID);
  app.delete("/api/v1/notify/delete/:id", adminController.deleteNotification);
  app.post('/api/v1/cancel', adminController.addCancel);
  app.get('/api/v1/cancel', adminController.getCancel);
  app.put('/api/v1/cancel/:id', adminController.updateCancel);
  app.delete('/api/v1/cancel/:id', adminController.DeleteCancel);
  app.post('/api/v1/ambulanceVehicle', upload.single('image'), adminController.addAmbulanceVehicle);
  app.get('/api/v1/ambulanceVehicle/', adminController.getAmbulanceVehicle);
  app.get('/api/v1/ambulanceVehicle/:id', adminController.getAmbulanceVehicleById);
  app.put('/api/v1/ambulanceVehicle/:id', upload.single('image'), adminController.updateAmbulanceVehicle);
  app.delete('/api/v1/ambulanceVehicle/:id', adminController.DeleteAmbulanceVehicle);
  app.get('/api/v1/getSettleBooking', adminController.getSettleBooking);
  app.get('/api/v1/getSettleBookingById/:bookingId', adminController.getSettleBookingById);
  app.put('/api/v1/assignDriverOnSettleBooking/:bookingId', adminController.assignDriverOnSettleBooking);
  app.get('/api/v1/getBooking', adminController.getBooking);
  app.get('/api/v1/getBookingById/:bookingId', adminController.getBookingById);
}