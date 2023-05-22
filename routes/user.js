var express = require("express");
var router = express.Router();
const userController = require("../controllers/user_controller");
var userHelper = require("../helpers/userHelpers");
const middleware = require("../middleware/middleware");
const { response } = require("../app");

// home page
router.get("/", userController.home);

// login page
router.get("/login", userController.login);

// post login page
router.post("/login", userController.doLogin);

// logout
router.get("/logout",userController.logout);

// signup page
router.get("/signup", userController.signup);

// post signup page
router.post("/signup", userController.doSignup);

// otp page
router.get("/otp",userController.otpPage);

// view products
router.get("/products", userController.viewProducts);
//view product details
router.get("/product_details/:id",middleware.userSession, userController.viewProductDetails);
// cart
router.get("/cart/:id",middleware.userSession,userController.cart);

// cart
router.get("/cart",middleware.userSession,userController.getCart);

// add to cart
router.get("/addcart/:id",middleware.userSession,userController.addCart);

// delete cart items
router.get("/deleteCartItem/:id",middleware.userSession,userController.deleteCartItem);

//place order
router.get("/place_order",middleware.userSession,userController.placeOrder);

// address insert 
router.post("/user/place_order",middleware.userSession,userController.addAddress);

// place orders
router.post("/order_placed",middleware.userSession,userController.postOders);

// order success
router.get("/order_success",middleware.userSession,userController.success)

module.exports = router;
