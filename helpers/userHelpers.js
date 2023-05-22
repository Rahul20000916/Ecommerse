const { response } = require("express");
const db = require("../model/connection");
const { ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");

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
      let user = await db.users.findOne({ email: userData.Email });
      if (user.block == false) {
        if (user) {
          bcrypt
            .compare(userData.Password, user.password) // changed from db.users.password to user.password
            .then((status) => {
              if (status) {
                console.log("login Success");
                response.user = user;
                response.status = true;
                resolve(response);
              } else {
                console.log("login Failed");
                resolve({ status: false });
              }
            });
        }
      } else {
        console.log("Login Failed");
        resolve({ status: false });
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
          type : data.type,
        };
          db.addresses.create(userAdress);
          resolve();
        
      } catch (err) {
        console.log(err);
      }
    });
  },

  // get address
  getAddress: async(userId) => {
    return new Promise(async(resolve, reject) => {
      try {
        let address = await db.addresses.find({ userid: userId })
        resolve(address);
      } catch (err) {
        console.log(err);
      }
    });
  },

  // post orders
  postUserOders: async(userId,products,total,paymentMode,address)=>{
    return new Promise(async(resolve,reject)=>{
      try{
        let orders = {
          userid: userId,
          address: address,
          products: products,
          date :new Date().toDateString(),
          coupon:'no coupon applied',
          total : total,
          paymentmode:paymentMode,
          paymentstatus:'pending',
          orderstatus:'placed',
        };
          db.orders.create(orders);
          resolve(orders);
      }catch(err){
        console.log(err)
      }
    })
  },
};
