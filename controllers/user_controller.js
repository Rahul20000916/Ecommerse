const { response } = require("../app");
const userHelpers = require("../helpers/userHelpers");
const { ObjectId } = require("mongodb");

module.exports = {

  // home page

  home: async (req, res) => {
    try {
      var user = req.session.user;
      console.log(user);
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      res.render("user/index", { user, cartCount });
    } catch (err) {
      console.log(err);
    }
  },

  // login page

  login: async (req, res) => {
    try {
      //session handling
      let user = req.session.loggedIn;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      if (req.session.loggedIn) {
        res.redirect("/");
      } else {
        res.render("user/login", { user, cartCount });
      }
    } catch (err) {
      console.log(err);
    }
  },

  // sign up page

  signup: async (req, res) => {
    let user = req.session.loggedIn;
    let cartCount = null;
    if (user) {
      cartCount = await userHelpers.getCartCount(user._id);
    }
    try {
      res.render("user/signup", { user, cartCount });
    } catch (err) {
      console.log(err);
    }
  },

  //do sign up

  doSignup: async (req, res) => {
    try {
      let user = req.session.loggedIn;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      userHelpers.doSignup(req.body).then((response) => {
        console.log(response);
        res.render("user/login", { user, cartCount });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // do login

  doLogin: (req, res) => {
    try {
      userHelpers.doLogin(req.body).then((response) => {
        if (response.status) {
          req.session.loggedIn = true;
          req.session.user = response.user;
          res.redirect("/");
        } else {
          res.redirect("/login");
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  // otp page

  otpPage: async (req, res) => {
    try {
      let user = req.session.loggedIn;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      res.render("user/otp_page", { user, cartCount });
    } catch (err) {}
  },

  // logout

  logout: (req, res) => {
    try {
      req.session.destroy();
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  },

  // view products

  viewProducts: async (req, res) => {
    try {
      let user = req.session.loggedIn;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      userHelpers.viewProduct().then((response) => {
        let viewProducts = response;
        res.render("user/products", { viewProducts, user, cartCount });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // view product details

  viewProductDetails: async (req, res) => {
    try {
      let user = req.session.loggedIn;
      const id = req.params.id;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      userHelpers.viewProductDetails(id).then((response) => {
        let data = response;
        res.render("user/product_details", { data, user, cartCount });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // cart page

  cart: async (req, res) => {
    try {
      var user = req.session.user;
      let cartCount = null;
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let proId = req.params.id;
      let productId = new ObjectId(proId);
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      let total = await userHelpers.totalAmount(userId);
      await userHelpers.addToCart(userId, productId).then(async (response) => {
        let products = await userHelpers.getCartProducts(userId);
        console.log(products);
        res.render("user/cart", { user, products, cartCount, total });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // get cart page

  getCart: async (req, res) => {
    try {
      var user = req.session.user;
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      let products = await userHelpers.getCartProducts(userId);
      let total = await userHelpers.totalAmount(userId);
      res.render("user/cart", { user, products, cartCount, total });
    } catch (err) {
      console.log(err);
    }
  },

  // add to cart

  addCart: async (req, res) => {
    try {
      let usrId = req.session.user._id;
      let proId = req.params.id;
      let userId = new ObjectId(usrId);
      let productId = new ObjectId(proId);
      console.log(userId, productId);
      await userHelpers.addToCart(userId, productId).then((response) => {
        res.redirect("/products");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // delete cart item
  deleteCartItem: async (req, res) => {
    try {
      let usrId = req.session.user._id;
      let proId = req.params.id;
      let userId = new ObjectId(usrId);
      let productId = new ObjectId(proId);
      console.log(userId, productId);
      await userHelpers.removeFromCart(userId, productId).then((response) => {
        res.redirect("/cart");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // place order
  placeOrder :async(req,res)=>{
    try{
      let user = req.session.user
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      res.render("user/place_order",{user,cartCount});
    }catch(err){
      console.log(err);
    }
  },
};

