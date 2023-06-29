const session = require("express-session");
const userHelpers = require("../helpers/userHelpers");
const { ObjectId } = require("mongodb");

module.exports = {
  


  // home page

  home: async (req, res) => {
    try {
      const user = req.session.user;
      var cartCount;
      if (user) {
        console.log(user);
        cartCount = null;
        cartCount = await userHelpers.getCartCount(user._id);
        res.render("user/index", { user, cartCount });
      } else {
        var loginErr = req.session.loggedIn;
        req.session.loggedIn = null;
        res.render("user/login", { user, cartCount , loginErr});
      }
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
        var loginErr = req.session.loggedIn;
        req.session.loggedIn = null;
        res.render("user/login", { user, cartCount , loginErr});
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

  doSignup: (req, res) => {
    try {
      let user = req.session.loggedIn;
      let cartCount = null;
      let code = req.body.Referal;
      if (code) {
        let point = 10;
        userHelpers.walletPoint(code).then(async(response) => {
          const parsedResponse = parseInt(response);
          if (!isNaN(parsedResponse)) {
            point = point + parsedResponse;
          userHelpers.addPoint(code, point);
          } else {
            console.log("Invalid response format");
          }
        });
      }
      if (user) {
        cartCount = userHelpers.getCartCount(user._id);
      }
      const response = userHelpers.doSignup(req.body);
      console.log(response);
      let referal = response.referal;
      if(code){
        let refpoint =5;
        userHelpers.walletPoint(referal).then((response)=>{
          const parsedRefResponse =parseInt(response);
          if(!isNaN(parsedRefResponse)){
            refpoint = refpoint + parsedRefResponse;
            userHelpers.addPoint(referal,refpoint);
          }else{
            console.log("Invalid response format");
          }
        })
      }
      res.render("user/login", { user, cartCount });
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
          req.session.loggedIn = false;
          res.redirect("/login");
        }
      });
    } catch (err) {
      console.log(err);
    }
  },
  // do login with otp
  loginDoneOtp: async (req, res) => {
    try {
      let number = req.body.Phone;
      userHelpers.doLoginWithOtp(number).then((response) => {
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

  // ort login
  otpLogin: async (req, res) => {
    try {
      let user = req.session.loggedIn;
      let cartCount = null;
      let number = req.body.number; // Access the number from req.body
      console.log(number);
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      userHelpers.checkphonenumber(number).then((response) => {
        if (response) {
          console.log("number verified");
          // Number is registered
          res.json({ registered: true });
        } else {
          console.log("number not registerd");
          // Number is not registered
          res.json({ registered: false });
        }
      });
    } catch (err) {}
  },
  // logout

  logout: (req, res) => {
    try {
      req.session.loggedIn = false;
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  },

  // view products

  viewProducts: async (req, res) => {
    try {
      let use = req.session.user;
      let user = req.session.loggedIn;
      let usermsg = await userHelpers.findUser(req.session.user._id);
      let message = usermsg[0].message;
      let cartCount = null;
      // pagination
      const currentPage = parseInt(req.query.page) || 1; // Current page number, default to 1
      const perPage = 4; // Number of items to display per page
      const startIndex = (currentPage - 1) * perPage; // Start index of the current page
      const endIndex = startIndex + perPage; // End index of the current page

      // searching
      var search ="";
      if(req.query.search){
        search = req.query.search
      }

      if (user) {
        cartCount = await userHelpers.getCartCount(use._id);
      }
      const category = await userHelpers.allCategory();
      const allProducts = await userHelpers.viewProduct(search);

      const totalItems = allProducts.length;
      const totalPages = Math.ceil(totalItems / perPage);

      const paginatedProducts = allProducts.slice(startIndex, endIndex);

      await userHelpers.updateMessage(req.session.user._id, null);
      res.render("user/products", {
        viewProducts: paginatedProducts,
        user,
        cartCount,
        category,
        message,
        currentPage,
        totalPages,
      });
    } catch (err) {
      console.log(err);
    }
  },
  
  //contact us
  contact:async(req,res)=>{
    try{
      let user = req.session.loggedIn;
      let cartCount = null;
      let usermsg = await userHelpers.findUser(req.session.user._id);
      let message = usermsg[0].message;
      await userHelpers.updateMessage(req.session.user._id, null);
      if (user) {
        cartCount = await userHelpers.getCartCount(req.session.user._id);
      }
      res.render("user/contact", { user, cartCount,message });
    }catch(err){
      console.log(err)
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

  // profile page

  profile: async (req, res) => {
    try {
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let usr = await userHelpers.findUser(userId);
      let user = usr[0];
      let cartCount = null;
      //message
      let usermsg = await userHelpers.findUser(req.session.user._id);
      let message = usermsg[0].message;
      await userHelpers.updateMessage(req.session.user._id, null);
      //message end
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      console.log(user, "------------------user------------------");
      let address = await userHelpers.getAddress(user._id);
      let orders = await userHelpers.getOrders(userId);
      res.render("user/profile", { user, cartCount, address, orders,message });
    } catch (err) {
      console.log(err);
    }
  },
  // cart page

  cart: async (req, res) => {
    try {
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let proId = req.params.id;
      let productId = new ObjectId(proId);
      await userHelpers.addToCart(userId, productId).then(async (response) => {
        res.redirect("/cart");
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
      console.log(products);
      let total = await userHelpers.totalAmount(userId);
      let coupon = await userHelpers.getCoupon();
      await userHelpers.addDiscount(userId,0);
      console.log(total);
      res.render("user/cart", { user,products,cartCount,total,coupon });
    } catch (err) {
      console.log(err);
    }
  },

  // manage coupon
  couponAdd:async(req,res)=>{
    try{
      let user = req.session.user._id
      let userId = new ObjectId(user);
      let data = req.body.coupon;
      let total = req.body.totalprice;
      let couponDetails = await userHelpers.findCoupon(data);
      let minimumAmout = couponDetails.amount;
      let discountPersentage = couponDetails.discount;
      let expiryDate = couponDetails.expiry; // Convert expiry date to a JavaScript Date object
      let currentDate = new Date(); // Get the current date
      var discountPrice = 0;
      var totalAmount = 0;
      if( total > minimumAmout){
        discountPrice = (total * discountPersentage) / 100;
        totalAmount = total - discountPrice;
      }
      await userHelpers.addDiscount(userId,discountPrice).then((response)=>{
        res.json(totalAmount);
      })
    }catch(err){
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
      let message = 'PRODUCT ADDED SUCESSFULLY';
      console.log(userId, productId);
      await userHelpers.addToCart(userId, productId).then(async(response) => {
        await userHelpers.updateMessage(userId,message)
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
  placeOrder: async (req, res) => {
    try {
      let user = req.session.user;
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let cartCount = null;
      let discountPrice = await userHelpers.finDiscount(userId);
      console.log(discountPrice,"------------------price")
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      let address = await userHelpers.getAddress(user._id);
      let products = await userHelpers.getCartProducts(userId);
      let subtotal = await userHelpers.totalAmount(userId);
      let usr = await userHelpers.findUser(userId)
      var total = subtotal;
      var walet;
      let wallet =usr[0].wallet;
      if(total > usr[0].wallet){
        total = total - usr[0].wallet;
        walet = 0;
      }else{
        walet = usr[0].wallet - total;
        total = 0;
      }
      res.render("user/place_order", {
        user,
        cartCount,
        address,
        products,
        subtotal,
        wallet,
        total,
        discountPrice,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // get orders
  getOrder: async (req, res) => {
    try {
      let user = req.session.user;
      let odrId = req.params.id;
      let orderId = new ObjectId(odrId);
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      let orders = await userHelpers.getOneOrders(orderId);
      console.log(orders, "------------------orders--------------------");
      let addrId = orders[0].address;
      let addressId = new ObjectId(addrId);
      let addr = await userHelpers.getOrderAddress(addressId);
      let address = addr[0];
      res.render("user/orders", {
        user,
        cartCount,
        orders,
        address,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // add address
  addAddress:(req, res) => {
    try {
      let userid = req.session.user._id;
      let formData = req.body;
      userHelpers.addUserAddress(userid, formData).then((response) => {
        res.json(response);
      });
    } catch (err) {
      console.log(err);
    }
  },
  //user home address
  userAddAddress: async (req, res) => {
    try {
      let userid = req.session.user._id;
      let formData = req.body;
      let mess ="ADDRESS ADDED"
      await userHelpers.updateMessage(req.session.user._id, mess);

      await userHelpers.addUserAddress(userid, formData).then((response) => {
        res.redirect("/profile");
      });
    } catch (err) {
      console.log(err);
    }
  },

  //delete address
  deleteAddress: async (req, res) => {
    try {
      let id = req.params.id;
      let addressId = new ObjectId(id);
      let mess = "ADDRESS DELETED"
      await userHelpers.updateMessage(req.session.user._id, mess);
      await userHelpers.deleteAddress(addressId).then((response) => {
        res.redirect("/profile")
      });
    } catch (err) {
      console.log(err);
    }
  },
  //  orders
  postOders: async (req, res) => {
    try {
      let address = req.body.selectedaddress;
      // let add = new ObjectId(address)
      // let addres = await userHelpers.getOrderAddress(add);
      let couponStatus = req.body.couponStatus;
      let userId = req.session.user._id;
      let usrId = new ObjectId(userId);
      let paymentMode = req.body.payment_method;
      let products = await userHelpers.getCartProducts(usrId);
      let total = await userHelpers.totalAmount(usrId);
      let user= await userHelpers.findUser(usrId);
      var walet;
      if(total > user[0].wallet){
        total = total - user[0].wallet;
        walet = 0;
      }else{
        walet = user[0].wallet - total;
        total = 0;
      }
      await userHelpers.updateWallet(usrId,walet);
      await userHelpers
        .postUserOders(userId, products, total, paymentMode, address,couponStatus)
        .then(async (response) => {
          let formData = response;
          await userHelpers.removeCartItems(usrId);
          await userHelpers.inventory(products);
          if (formData.paymentmode === "cash_on_delivery") {
            res.json({ codSucces: true });
          } else {
            await userHelpers.findOrderId(formData).then(async (response) => {
              let orderId = response;
              await userHelpers
                .generateRazorpay(orderId, total)
                .then((response) => {
                  res.json(response);
                });
            });
          }
        });
    } catch (err) {
      console.log(err);
    }
  },
  // order success
  success: async (req, res) => {
    try {
      res.render("user/order_success");
    } catch (err) {
      console.log(err);
    }
  },
  // varify payment
  verifyPayment: (req, res) => {
    try {
      console.log(req.body);
      console.log("-----------------payment done---------------------");
      res.json({ opSucces: true });
    } catch (err) {
      console.log(err);
    }
  },

  // cancel order

  cancelOrder: (req, res) => {
    try {
      let ordId = req.params.id;
      let orderId = new ObjectId(ordId);

      // Ensure that the cancelOrder function returns a promise
      return userHelpers
        .cancelOrder(orderId)
        .then(() => {
          res.render("user/cancel_success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  },

  // return order

  returnOrder: (req, res) => {
    try {
      let ordId = req.params.id;
      let orderId = new ObjectId(ordId);

      // Ensure that the cancelOrder function returns a promise
      return userHelpers
        .returnOrder(orderId)
        .then(() => {
          res.render("user/return_success");
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (err) {
      console.log(err);
    }
  },

  // edit profile

  editProfile: async (req, res) => {
    try {
      let usrId = req.params.id;
      let userId = new ObjectId(usrId);
      let mess = 'PROFILE EDITED'
      await userHelpers.updateMessage(req.session.user._id, mess);
      await userHelpers.updateProfile(userId, req.body).then(() => {
        res.redirect("/profile");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // edit password

  editPassword: async (req, res) => {
    try {
      let usrId = req.params.id;
      let userId = new ObjectId(usrId);
      let mess ='PASSWORD CHANGED'
      await userHelpers.updateMessage(req.session.user._id, mess);
      await userHelpers.updatePassword(userId, req.body).then(() => {
        res.redirect("/profile");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // contact us
  contactUs:async(req,res)=>{
    try{
      let content = req.body;
      let user = req.session.user._id
      // let usermsg = await userHelpers.findUser(req.session.user._id);
      // let message = usermsg[0].message;
      let mess ="MAIL SENTED SUCCESFULLY";
      await userHelpers.updateMessage(req.session.user._id, mess);
      await userHelpers.contact(content,user).then(()=>{
        res.redirect('/contact')
      })
    }catch(err){
      console.log(err);
    }
  },
  // convert points
  convertPoint:async(req,res)=>{
    try{
      let point = req.body.points;
      let user = req.session.user._id
      let userId = new ObjectId(user);
      var mess;
      if(point >= 100){
        mess ="POINTS COVERTED SUCCESFULLY";
        let result = Math.max(0, Math.round(point / 10));
        await userHelpers.convertPoint(userId,result);
      }else{
        mess ="REQUIRED MINIMUM POINTS ";
      }
      await userHelpers.updateMessage(req.session.user._id, mess);
      
      res.redirect('/profile')

    }catch(err){
      console.log(err);
    }
  }
};
