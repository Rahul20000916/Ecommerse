const { response } = require("../app");
const userHelpers = require("../helpers/userHelpers");
const { ObjectId } = require("mongodb");

module.exports = {
  


  // home page

  home: async (req, res) => {
    try {
      const user = req.session.user;
      if (user) {
        console.log(user);
        let cartCount = null;
        cartCount = await userHelpers.getCartCount(user._id);
        res.render("user/index", { user, cartCount });
      } else {
        res.redirect("/login");
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
      let code = req.body.Referal;
      if (code) {
        let point = 10;
        await userHelpers.walletPoint(code).then(async(response) => {
          const parsedResponse = parseInt(response);
          if (!isNaN(parsedResponse)) {
            point = point + parsedResponse;
            await userHelpers.addPoint(code, point);
          } else {
            console.log("Invalid response format");
          }
        });
      }
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      const response = await userHelpers.doSignup(req.body);
      console.log(response);
      let referal = response.referal;
      if(code){
        let refpoint =5;
        await userHelpers.walletPoint(referal).then(async(response)=>{
          const parsedRefResponse =parseInt(response);
          if(!isNaN(parsedRefResponse)){
            refpoint = refpoint + parsedRefResponse;
            await userHelpers.addPoint(referal,refpoint);
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
      req.session.destroy();
      res.redirect("/login");
    } catch (err) {
      console.log(err);
    }
  },

  // view products

  viewProducts: async (req, res) => {
    try {
      const currentPage = parseInt(req.query.page) || 1; // Current page number, default to 1
      const perPage = 8; // Number of products to display per page
      const startIndex = (currentPage - 1) * perPage; // Start index of the current page
      const endIndex = startIndex + perPage; // End index of the current page

      let user = req.session.loggedIn;
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      const category = await userHelpers.allCategory();
      const allProducts = await userHelpers.viewProduct();
      const totalItems = allProducts.length;
      const totalPages = Math.ceil(totalItems / perPage);

      const paginatedProducts = allProducts.slice(startIndex, endIndex);
      res.render("user/products", {
        viewProducts: paginatedProducts,
        user,
        cartCount,
        category,
        currentPage,
        totalPages,
      });
    } catch (err) {
      console.log(err);
    }
  },

  // product filter
  productFilter: (req, res) => {
    try {
      let category = req.body;
      res.redirect("/products");
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

  // profile page

  profile: async (req, res) => {
    try {
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let usr = await userHelpers.findUser(userId);
      let user = usr[0];
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      console.log(user, "------------------user------------------");
      let address = await userHelpers.getAddress(user._id);
      let orders = await userHelpers.getOrders(userId);
      res.render("user/profile", { user, cartCount, address, orders });
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
      console.log(products);
      let total = await userHelpers.totalAmount(userId);
      console.log(total);
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
  placeOrder: async (req, res) => {
    try {
      let user = req.session.user;
      let usrId = req.session.user._id;
      let userId = new ObjectId(usrId);
      let cartCount = null;
      if (user) {
        cartCount = await userHelpers.getCartCount(user._id);
      }
      let address = await userHelpers.getAddress(user._id);
      let products = await userHelpers.getCartProducts(userId);
      let total = await userHelpers.totalAmount(userId);
      res.render("user/place_order", {
        user,
        cartCount,
        address,
        products,
        total,
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
  addAddress: async (req, res) => {
    try {
      let userid = req.session.user._id;
      let formData = req.body;
      await userHelpers.addUserAddress(userid, formData).then((response) => {
        res.redirect("/place_order");
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
      await userHelpers.deleteAddress(addressId).then((response) => {
        res.json({ message: 'Address deleted successfully' });
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
      let userId = req.session.user._id;
      let usrId = new ObjectId(userId);
      let paymentMode = req.body.payment_method;
      let products = await userHelpers.getCartProducts(usrId);
      let total = await userHelpers.totalAmount(usrId);
      await userHelpers
        .postUserOders(userId, products, total, paymentMode, address)
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
      await userHelpers.updatePassword(userId, req.body).then(() => {
        res.redirect("/profile");
      });
    } catch (err) {
      console.log(err);
    }
  },
};
