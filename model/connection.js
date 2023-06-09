var mongoose = require("mongoose");
require("dotenv").config();
const db = mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected ...");
  })
  .catch((err) => {
    console.log("Something went wrong..." + err);
  });

const { ObjectID } = require("bson");
const { ObjectId } = require("mongodb");

// add product

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
  },
  category: {
    type: String,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
  },
  image: {
    type: [],
  },
  block: {
    type: Boolean,
  },
});

//category

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
  },
  description: {
    type: String,
  },
});

//users data

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  password: {
    type: String,
  },
  wallet: {
    type: Number,
  },
  walletpoint: {
    type: String,
  },
  referal: {
    type: String,
  },
  block: {
    type: Boolean,
  },
  message:{
    type:String,
  },
  discount:{
    type:Number,
  }
});
//cart
const cartSchema = new mongoose.Schema({
  userid: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  products: {
    type: [],
  },
});
const contactSchema = new mongoose.Schema({
  userid:{
    type: mongoose.SchemaTypes.ObjectId,
  },
  name:{
    type:String
  },
  email:{
    type:String
  },
  subject:{
    type:String
  },
  message:{
    type:String
  }
});

// address
const addressSchema = new mongoose.Schema({
  userid: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  name: {
    type: String,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  zipcode: {
    type: String,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
  type: {
    type: String,
  },
});
// orders
const ordersSchema = new mongoose.Schema({
  userid: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  address: {
    type: String,
  },
  products: {
    type: {},
  },
  date: {
    type: Date,
  },
  pdate: {
    type: Date,
  },
  sdate: {
    type: Date,
  },
  ddate: {
    type: Date,
  },
  rdate: {
    type: Date,
  },
  coupon: {
    type: String,
  },
  total: {
    type: String,
  },
  paymentmode: {
    type: String,
  },
  paymentstatus: {
    type: String,
  },
  orderstatus: {
    type: String,
  },
  returnstatus: {
    type: String,
  },
});
const couponSchema = new mongoose.Schema({
  name:{
    type:String,
    unique:true,
    uppercase:true
  },
  description: {
    type: String,
  },
  amount:{
    type:Number,
  },
  expiry:{
    type:Date,
  },
  discount:{
    type:Number,
  }
});
module.exports = {
  products: mongoose.model("products", productSchema),
  categories: mongoose.model("categories", categorySchema),
  users: mongoose.model("users", usersSchema),
  carts: mongoose.model("carts", cartSchema),
  addresses: mongoose.model("addresses", addressSchema),
  orders: mongoose.model("orders", ordersSchema),
  contacts:mongoose.model("contacts",contactSchema),
  coupons:mongoose.model("coupons",couponSchema),
};
