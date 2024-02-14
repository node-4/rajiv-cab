const mongoose = require('mongoose');
const schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const DocumentSchema = schema({
        state: {
                type: String
        },
        isoCode: {
                type: String
        },
        countryCode: {
                type: String
        },
        latitude: {
                type: String
        },
        longitude: {
                type: String
        },
        status: {
                type: String,
                enum: ["ACTIVE", "BLOCKED", "DELETE"],
                default: "ACTIVE"
        }
}, { timestamps: true })
DocumentSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("state", DocumentSchema);
// let state = [{
//         "state": "Andaman and Nicobar Islands",
//         "isoCode": "AN",
//         "countryCode": "IN",
//         "latitude": "11.74008670",
//         "longitude": "92.65864010"
// },
// {
//         "state": "Andhra Pradesh",
//         "isoCode": "AP",
//         "countryCode": "IN",
//         "latitude": "15.91289980",
//         "longitude": "79.73998750"
// },
// {
//         "state": "Arunachal Pradesh",
//         "isoCode": "AR",
//         "countryCode": "IN",
//         "latitude": "28.21799940",
//         "longitude": "94.72775280"
// },
// {
//         "state": "Assam",
//         "isoCode": "AS",
//         "countryCode": "IN",
//         "latitude": "26.20060430",
//         "longitude": "92.93757390"
// },
// {
//         "state": "Bihar",
//         "isoCode": "BR",
//         "countryCode": "IN",
//         "latitude": "25.09607420",
//         "longitude": "85.31311940"
// },
// {
//         "state": "Chandigarh",
//         "isoCode": "CH",
//         "countryCode": "IN",
//         "latitude": "30.73331480",
//         "longitude": "76.77941790"
// },
// {
//         "state": "Chhattisgarh",
//         "isoCode": "CT",
//         "countryCode": "IN",
//         "latitude": "21.27865670",
//         "longitude": "81.86614420"
// },
// {
//         "state": "Dadra and Nagar Haveli and Daman and Diu",
//         "isoCode": "DH",
//         "countryCode": "IN",
//         "latitude": "20.39737360",
//         "longitude": "72.83279910"
// },
// {
//         "state": "Delhi",
//         "isoCode": "DL",
//         "countryCode": "IN",
//         "latitude": "28.70405920",
//         "longitude": "77.10249020"
// },
// {
//         "state": "Goa",
//         "isoCode": "GA",
//         "countryCode": "IN",
//         "latitude": "15.29932650",
//         "longitude": "74.12399600"
// },
// {
//         "state": "Gujarat",
//         "isoCode": "GJ",
//         "countryCode": "IN",
//         "latitude": "22.25865200",
//         "longitude": "71.19238050"
// },
// {
//         "state": "Haryana",
//         "isoCode": "HR",
//         "countryCode": "IN",
//         "latitude": "29.05877570",
//         "longitude": "76.08560100"
// },
// {
//         "state": "Himachal Pradesh",
//         "isoCode": "HP",
//         "countryCode": "IN",
//         "latitude": "31.10482940",
//         "longitude": "77.17339010"
// },
// {
//         "state": "Jammu and Kashmir",
//         "isoCode": "JK",
//         "countryCode": "IN",
//         "latitude": "33.27783900",
//         "longitude": "75.34121790"
// },
// {
//         "state": "Jharkhand",
//         "isoCode": "JH",
//         "countryCode": "IN",
//         "latitude": "23.61018080",
//         "longitude": "85.27993540"
// },
// {
//         "state": "Karnataka",
//         "isoCode": "KA",
//         "countryCode": "IN",
//         "latitude": "15.31727750",
//         "longitude": "75.71388840"
// },
// {
//         "state": "Kerala",
//         "isoCode": "KL",
//         "countryCode": "IN",
//         "latitude": "10.85051590",
//         "longitude": "76.27108330"
// },
// {
//         "state": "Ladakh",
//         "isoCode": "LA",
//         "countryCode": "IN",
//         "latitude": "34.22684750",
//         "longitude": "77.56194190"
// },
// {
//         "state": "Lakshadweep",
//         "isoCode": "LD",
//         "countryCode": "IN",
//         "latitude": "10.32802650",
//         "longitude": "72.78463360"
// },
// {
//         "state": "Madhya Pradesh",
//         "isoCode": "MP",
//         "countryCode": "IN",
//         "latitude": "22.97342290",
//         "longitude": "78.65689420"
// },
// {
//         "state": "Maharashtra",
//         "isoCode": "MH",
//         "countryCode": "IN",
//         "latitude": "19.75147980",
//         "longitude": "75.71388840"
// },
// {
//         "state": "Manipur",
//         "isoCode": "MN",
//         "countryCode": "IN",
//         "latitude": "24.66371730",
//         "longitude": "93.90626880"
// },
// {
//         "state": "Meghalaya",
//         "isoCode": "ML",
//         "countryCode": "IN",
//         "latitude": "25.46703080",
//         "longitude": "91.36621600"
// },
// {
//         "state": "Mizoram",
//         "isoCode": "MZ",
//         "countryCode": "IN",
//         "latitude": "23.16454300",
//         "longitude": "92.93757390"
// },
// {
//         "state": "Nagaland",
//         "isoCode": "NL",
//         "countryCode": "IN",
//         "latitude": "26.15843540",
//         "longitude": "94.56244260"
// },
// {
//         "state": "Odisha",
//         "isoCode": "OR",
//         "countryCode": "IN",
//         "latitude": "20.95166580",
//         "longitude": "85.09852360"
// },
// {
//         "state": "Puducherry",
//         "isoCode": "PY",
//         "countryCode": "IN",
//         "latitude": "11.94159150",
//         "longitude": "79.80831330"
// },
// {
//         "state": "Punjab",
//         "isoCode": "PB",
//         "countryCode": "IN",
//         "latitude": null,
//         "longitude": null
// },
// {
//         "state": "Rajasthan",
//         "isoCode": "RJ",
//         "countryCode": "IN",
//         "latitude": "27.02380360",
//         "longitude": "74.21793260"
// },
// {
//         "state": "Sikkim",
//         "isoCode": "SK",
//         "countryCode": "IN",
//         "latitude": "27.53297180",
//         "longitude": "88.51221780"
// },
// {
//         "state": "Tamil Nadu",
//         "isoCode": "TN",
//         "countryCode": "IN",
//         "latitude": "11.12712250",
//         "longitude": "78.65689420"
// },
// {
//         "state": "Telangana",
//         "isoCode": "TG",
//         "countryCode": "IN",
//         "latitude": "18.11243720",
//         "longitude": "79.01929970"
// },
// {
//         "state": "Tripura",
//         "isoCode": "TR",
//         "countryCode": "IN",
//         "latitude": "23.94084820",
//         "longitude": "91.98815270"
// },
// {
//         "state": "Uttar Pradesh",
//         "isoCode": "UP",
//         "countryCode": "IN",
//         "latitude": "26.84670880",
//         "longitude": "80.94615920"
// },
// {
//         "state": "Uttarakhand",
//         "isoCode": "UT",
//         "countryCode": "IN",
//         "latitude": "30.06675300",
//         "longitude": "79.01929970"
// },
// {
//         "state": "West Bengal",
//         "isoCode": "WB",
//         "countryCode": "IN",
//         "latitude": "22.98675690",
//         "longitude": "87.85497550"
// }]