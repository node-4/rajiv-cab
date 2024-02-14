const mongoose = require("mongoose");

const driverDetailSchema = new mongoose.Schema({
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "city",
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicle",
  },
  vehicleVariant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vehicleVariant",
  },
  dlno: {
    type: String,
    default: "",
  },
  dlDob: {
    type: String,
    default: "",
  },
  aadhar: {
    type: String,
    default: "",
  },
  client_id: {
    type: String,
    default: "",
  },
  rc_number: {
    type: String,
    default: "",
  },
  registration_date: {
    type: Date
  },
  owner_name: {
    type: String,
    default: "",
  },
  father_name: {
    type: String,
    default: "",
  },
  present_address: {
    type: String,
    default: "",
  },
  permanent_address: {
    type: String,
    default: "",
  },
  mobile_number: {
    type: String,
    default: "",
  },
  vehicle_category: {
    type: String,
    default: "",
  },
  vehicle_chasi_number: {
    type: String,
    default: "",
  },
  vehicle_engine_number: {
    type: String,
    default: "",
  },
  maker_description: {
    type: String,
    default: "",
  },
  maker_model: {
    type: String,
    default: "",
  },
  body_type: {
    type: String,
    default: "",
  },
  fuel_type: {
    type: String,
    default: "",
  },
  color: {
    type: String,
    default: "",
  },
  norms_type: {
    type: String,
    default: "",
  },
  fit_up_to: {
    type: Date
  },
  financer: {
    type: String,
    default: "",
  },
  financed: { type: Boolean },
  insurance_company: {
    type: String,
    default: "",
  },
  insurance_policy_number: {
    type: String,
    default: "",
  },
  insurance_upto: {
    type: Date
  },
  manufacturing_date: {
    type: String,
    default: "",
  },
  manufacturing_date_formatted: {
    type: String,
    default: "",
  },
  registered_at: {
    type: String,
    default: "",
  },
  latest_by: {
    type: Date
  },
  less_info: { type: Boolean },
  tax_upto: {
    type: Date
  },
  tax_paid_upto: {
    type: Date
  },
  cubic_capacity: {
    type: String,
    default: "",
  },
  vehicle_gross_weight: {
    type: String,
    default: "",
  },
  no_cylinders: {
    type: String,
    default: "",
  },
  seat_capacity: {
    type: String,
    default: "",
  },
  sleeper_capacity: {
    type: String,
    default: "",
  },
  standing_capacity: {
    type: String,
    default: "",
  },
  wheelbase: {
    type: String,
    default: "",
  },
  unladen_weight: {
    type: String,
    default: "",
  },
  vehicle_category_description: {
    type: String,
    default: "",
  },
  pucc_number: {
    type: String,
    default: "",
  },
  pucc_upto: {
    type: Date
  },
  permit_number: {
    type: String,
    default: "",
  },
  permit_issue_date: {
    type: Date
  },
  permit_valid_from: {
    type: Date
  },
  permit_valid_upto: {
    type: Date
  },
  permit_type: {
    type: String,
    default: "",
  },
  national_permit_number: {
    type: String,
    default: "",
  },
  national_permit_upto: {
    type: Date
  },
  national_permit_issued_by: {
    type: String,
    default: "",
  },
  non_use_status: {
    type: String,
    default: "",
  },
  non_use_from: {
    type: Date
  },
  non_use_to: {
    type: Date
  },
  blacklist_status: {
    type: String,
    default: "",
  },
  noc_details: {
    type: String,
    default: "",
  },
  owner_number: {
    type: String,
    default: "",
  },
  rc_status: {
    type: String,
    default: "",
  },
  masked_name: { type: Boolean },
  challan_details: {
    type: String,
    default: "",
  },
  variant: {
    type: String,
    default: "",
  },
  interior: {
    type: String,
    default: "",
  },
  exterior: {
    type: String,
    default: "",
  },
  rc: {
    type: String,
    default: "",
  },
  fitness: {
    type: String,
    default: "",
  },
  permit: {
    type: String,
    default: "",
  },
  insurance: {
    type: String,
    default: "",
  },
  drivinglicense: {
    type: String,
    default: "",
  },
  aadharCard: {
    type: String,
    default: "",
  },
  insuranceExp: {
    type: String,
    default: "",
  },
  rc_number: {
    type: String,
    default: "",
  },
  cancelCheck: {
    type: String,
    default: "",
  },
  bankStatement: {
    type: String,
    default: "",
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
  },
});
driverDetailSchema.index({ location: '2dsphere' });
// Add other driver details fields as needed
//   },
// });

const DriverDetail = mongoose.model("DriverDetail", driverDetailSchema);

module.exports = DriverDetail;
