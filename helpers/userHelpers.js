const { response } = require("express");
const db = require("../model/connection");
const { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");

const bcrypt = require("bcrypt");

// razor pay
var instance = new Razorpay({
  key_id: "rzp_test_onTZMcpnZgRY0j",
  key_secret: "d4xfSpxnHiRmdYyfnVIkvAkV",
});

module.exports = {
  doSignup: (userData) => {
    console.log(userData);
    return new Promise(async (resolve, reject) => {
      userData.Password = await bcrypt.hash(userData.Password, 10);
      uploadUserData = new db.users({
        name: userData.Name,
        email: userData.Email,
        phone: userData.Phone,
        password: userData.Password,
        block: false,
      });
      uploadUserData.save().then((data) => {
        resolve(data);
      });
    });
  },

  doLogin: (userData) => {
    return new Promise(async (resolve, reject) => {
      let loginStatus = false;
      let response = {};
      let user = await db.users.findOne({ email: userData.Email }); // Changed from 'userData.Email' to 'userData.email'

      if (user) {
        // Moved the check for 'user' inside the 'if' condition
        if (user.block === false) {
          // Changed from 'user.block == false' to 'user.block === false'
          bcrypt
            .compare(userData.Password, user.password) // Changed from 'userData.Password' to 'userData.password'
            .then((status) => {
              if (status) {
                console.log("Login success");
                response.user = user;
                response.status = true;
                resolve(response);
              } else {
                console.log("Login failed");
                resolve({ status: false });
              }
            });
        } else {
          console.log("User is blocked. Login failed");
          resolve({ status: false });
        }
      } else {
        console.log("User not found. Login failed");
        resolve({ status: false });
      }
    });
  },

  // otp login done
  doLoginWithOtp: (number) => {
    return new Promise(async (resolve, reject) => {
      try {
        let loginStatus = false;
        let response = {};
        await db.users.findOne({ phone: number }).then((user) => {
          if (user) {
            console.log("login Success");
            response.user = user;
            response.status = true;
            resolve(response);
          } else {
            console.log("Login Failed");
            resolve({ status: false });
          }
        });
      } catch (err) {
        console.log("ERROR OCCURED", err);
        reject(err);
      }
    });
  },
  // view products
  viewProduct: () => {
    return new Promise(async (resolve, reject) => {
      await db.products.find({}).then((response) => {
        resolve(response);
        console.log(response);
      });
    });
  },
  // all category
  allCategory: () => {
    return new Promise(async (resolve, reject) => {
      await db.categories.find({}).then((response) => {
        resolve(response);
      });
    });
  },
  viewProductDetails: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await db.products.findOne({ _id: id });
        console.log(response);
        resolve(response);
      } catch (err) {
        reject(err);
      }
    });
  },
  // cart

  addToCart: (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let productObj = {
          products: productId, // Assign the productId directly
        };
        let cartObj = {
          userid: userId,
          products: productObj,
        };
        let userCart = await db.carts.find({ userid: userId });
        if (userCart.length > 0) {
          let cart = userCart[0]; // Assuming only one cart per user

          // Check if the product already exists in the cart
          let productExists = cart.products.some(
            (item) => item.products.toString() === productId.toString()
          );

          if (productExists) {
            resolve(); // Product already exists in the cart, resolve without updating
          } else {
            let updatedCart = await db.carts.updateOne(
              { userid: userId },
              { $push: { products: productObj } }
            );
            resolve(updatedCart);
          }
        } else {
          db.carts.create(cartObj);
          resolve();
        }
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  // remove product from cart
  removeFromCart: (userId, productId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let userCart = await db.carts.find({ userid: userId });
        if (userCart.length > 0) {
          let cart = userCart[0]; // Assuming only one cart per user

          // Check if the product exists in the cart
          let productIndex = cart.products.findIndex(
            (item) => item.products.toString() === productId.toString()
          );

          if (productIndex !== -1) {
            cart.products.splice(productIndex, 1); // Remove the product from the cart
            await cart.save(); // Save the updated cart
          }
        }

        resolve();
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  },
  // remove user cart
  removeCartItems: async (userId) => {
    try {
      await db.carts.deleteMany({ userid: userId });
    } catch (err) {
      console.log(err);
    }
  },
  // inventory soft delete
  inventory: (products) => {
    try {
      const productIds = products.map((product) => product._id); // Extracting the _id values
      return new Promise(async (resolve, reject) => {
        await db.products
          .updateMany({ _id: { $in: productIds } }, { $set: { block: true } }) // Updating the documents with matching _id values
          .then((response) => {
            resolve(response);
          });
      });
    } catch (err) {
      console.log(err);
    }
  },
  // get order id
  findOrderId: (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        const orders = await db.orders.find(data);
        if (orders.length > 0) {
          const order = orders[0];
          console.log(order._id);
          resolve(order._id);
        } else {
          console.log("No matching orders found.");
          resolve(null); // or reject() if you want to indicate an error
        }
      } catch (err) {
        console.log(err);
      }
    });
  },

  // cancel order
  cancelOrder: (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.orders
          .findOneAndUpdate({ _id: orderId }, { orderstatus: "canceled" })
          .then(() => {
            console.log("Order canceled successfully.");
            resolve(); // Resolve the promise to indicate successful completion
          });
      } catch (err) {
        console.log(err);
      }
    });
  },

    // return order
    returnOrder: (orderId) => {
      return new Promise(async (resolve, reject) => {
        try {
          await db.orders
            .updateOne({ _id: orderId }, { orderstatus: "return" ,
            rdate: new Date().toDateString(),
          })
            .then(() => {
              console.log("Order returned successfully.");
              resolve(); // Resolve the promise to indicate successful completion
            });
        } catch (err) {
          console.log(err);
        }
      });
    },

  // generate razorpay
  generateRazorpay: (orderId, total) => {
    return new Promise(async (resolve, reject) => {
      try {
        var option = {
          amount: total,
          currency: "INR",
          receipt: "" + orderId,
        };
        instance.orders.create(option, (err, order) => {
          resolve(order);
        });
      } catch (err) {
        console.log(err);
      }
    });
  },
  // get cart products
  getCartProducts: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cartItems = await db.carts.aggregate([
          {
            $match: {
              userid: userId,
            },
          },
          {
            $unwind: {
              path: "$products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "products.products",
              foreignField: "_id",
              as: "cartItems",
            },
          },
        ]);
        // Extract cartItems from each cart item
        const resolvedCartItems = cartItems.map((cart) => cart.cartItems[0]);
        resolve(resolvedCartItems);
      } catch {
        resolve(null);
      }
    });
  },

  // get cart count
  getCartCount: (userId) => {
    try {
      return new Promise(async (resolve, reject) => {
        let count = 0;
        try {
          const cartCount = await db.carts.findOne({ userid: userId });
          if (cartCount) {
            count = cartCount.products.length;
          }
          resolve(count);
        } catch (err) {
          reject(err);
        }
      });
    } catch (err) {
      console.log(err);
    }
  },

  // check user with phone number
  checkphonenumber: (phonenumber) => {
    return new Promise((resolve, reject) => {
      db.users.findOne({ phone: phonenumber }).then((data) => {
        console.log(data);
        if (data) {
          resolve(data);
        } else {
          reject();
        }
      });
    });
  },

  // total amount
  totalAmount: (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cartItems = await db.carts.aggregate([
          {
            $match: {
              userid: userId,
            },
          },
          {
            $unwind: {
              path: "$products",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $lookup: {
              from: "products",
              localField: "products.products",
              foreignField: "_id",
              as: "cartItems",
            },
          },
        ]);

        // Extract cartItems from each cart item
        const resolvedCartItems = cartItems.map((cart) => cart.cartItems[0]);
        // Calculate the total amount
        let total = 0;
        for (const item of resolvedCartItems) {
          total += item.price;
        }
        resolve(total);
      } catch {
        resolve(null);
      }
    });
  },

  // insert user address
  addUserAddress: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      console.log(data);
      try {
        let userAdress = {
          userid: userId,
          name: data.name,
          address: data.address,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          phone: data.phone,
          email: data.email,
          type: data.type,
        };
        db.addresses.create(userAdress);
        resolve();
      } catch (err) {
        console.log(err);
      }
    });
  },

  // delete address
  deleteAddress: (id) => {
    return new Promise(async (resolve, reject) => {
      try {
        await db.addresses.deleteOne({ _id: id });
        resolve();
      } catch (err) {
        console.log(err);
      }
    });
  },

  // get address
  getAddress: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let address = await db.addresses.find({ userid: userId });
        resolve(address);
      } catch (err) {
        console.log(err);
      }
    });
  },
 
  // get order address
  getOrderAddress: async (addressId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let address = await db.addresses.find({ _id: addressId });
        resolve(address);
      } catch (err) {
        console.log(err);
      }
    });
  },

  // find user
  findUser: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let user = await db.users.find({ _id: userId });
        resolve(user);
      } catch (err) {
        console.log(err);
      }
    });
  },
  // get orders
  getOrders: async (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = await db.orders.find({ userid: userId });
        resolve(orders);
      } catch (err) {
        console.log(err);
      }
    });
  },
  // get single order
  getOneOrders: async (orderId) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = await db.orders.find({ _id: orderId });
        resolve(orders);
      } catch (err) {
        console.log(err);
      }
    });
  },

  // post orders
  postUserOders: async (userId, products, total, paymentMode, address) => {
    return new Promise(async (resolve, reject) => {
      try {
        let orders = {
          userid: userId,
          address: address,
          products: products,
          date: new Date().toDateString(),
          pdate:null,
          sdate:null,
          ddate:null,
          rdate:null,
          coupon: "no coupon applied",
          total: total,
          paymentmode: paymentMode,
          paymentstatus: "pending",
          orderstatus: "placed",
          returnstatus:null,
        };
        db.orders.create(orders);
        resolve(orders);
      } catch (err) {
        console.log(err);
      }
    });
  },

  //update profile
  updateProfile: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(data, "--------------------------------");
        console.log(userId);
        await db.users
          .updateOne(
            { _id: userId },
            {
              $set: {
                name: data.name,
                email: data.email,
                phone: data.phone,
              },
            }
          )
          .then(() => {
            console.log("successfully updated.");
            resolve();
          });
      } catch (err) {
        console.log(err);
      }
    });
  },

  //update password
  updatePassword: (userId, data) => {
    return new Promise(async (resolve, reject) => {
      try {
        console.log(userId);
        data.password = await bcrypt.hash(data.password, 10);
        console.log(data.password, "--------------------------------");
        await db.users
          .updateOne(
            { _id: userId },
            {
              $set: {
                password: data.password,
              },
            }
          )
          .then(() => {
            console.log("successfully updated.");
            resolve();
          });
      } catch (err) {
        console.log(err);
      }
    });
  },
};
