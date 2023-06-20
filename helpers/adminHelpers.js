const { response } = require("express");
const db = require("../model/connection");
const { ObjectId } = require("mongodb");
module.exports = {
  // ADD PRODUCT
  addProducts: (productData, filename) => {
    return new Promise((resolve, reject) => {
      const item = new db.products({
        productName: productData.Name,
        category: productData.Category,
        description: productData.Description,
        price: productData.Price,
        image: filename,
        block: false,
      });
      item.save().then((data) => {
        resolve({ added: true });
      });
    });
  },
  // ORDERS
  orders: () => {
    return new Promise(async (resolve, reject) => {
      await db.orders.find({ orderstatus: { $ne: "return" } })
      .then((response) => {
        resolve(response);
      });
    });
  },
    // RETURN ORDERS
    returnOrders: () => {
      return new Promise(async (resolve, reject) => {
        await db.orders.find({orderstatus: "return",}).then((response) => {
          resolve(response);
        });
      });
    },
  // ORDERS WITH ID

  viewOrders: (id) => {
    let ordId = new ObjectId(id);
    return new Promise(async (resolve, reject) => {
      await db.orders.find({ _id: ordId }).then((response) => {
        resolve(response);
      });
    });
  },

  // ORDERED ADDRESS
  getOrderAddress: (id) => {
    let addressId = new ObjectId(id);
    return new Promise(async (resolve, reject) => {
      await db.addresses.find({ _id: addressId }).then((response) => {
        resolve(response);
      });
    });
  },
  // UPDATE PRODUCT
  updateProducts: (id, productData, filenames) => {
    return new Promise((resolve, reject) => {
      try {
        let updateData = {
          productName: productData.Name,
          category: productData.Category,
          description: productData.Description,
          price: productData.Price,
          block: false,
        };

        if (filenames.length > 0) {
          updateData.image = filenames;
        }

        db.products.updateOne({ _id: id }, { $set: updateData }).then(() => {
          resolve();
        });
      } catch (error) {
        console.log(error);
      }
    });
  },

  // ADD CATEGORY
  messages:() => {
    try{
      return new Promise(async (resolve, reject) => {
        await db.contacts.find({}).then((response) => {
          resolve(response);
        });
      });
    }catch(err){
      console.log(err);
    }
    },
  // MANAGE MAIL
  removeMail:(id)=>{
    try{
      return new Promise(async(resolve,reject)=>{
        await db.contacts.deleteOne({_id:id}).then(()=>{
          resolve();
        })
      })
    }catch(err){
      console.log(err);
    }
  }, 

  addCategories: (categoryData) => {
    return new Promise(async (resolve, reject) => {
      // Check if categoryName already exists in the database
      const existingCategory = await db.categories.findOne({
        categoryName: categoryData.Name,
      });

      if (existingCategory) {
        resolve({ added: false, message: "Category already exists" });
      } else {
        const uploadCategory = new db.categories({
          categoryName: categoryData.Name,
          description: categoryData.Description,
        });

        uploadCategory
          .save()
          .then((data) => {
            resolve({ added: true });
          })
          .catch((error) => {
            reject(error);
          });
      }
    });
  },

  //UPDATE CATERGORY
  updateCategories: (id, categoryData) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Check if categoryName already exists in the database
        const existingCategory = await db.categories.findOne({
          categoryName: categoryData.Name,
        });

        if (existingCategory && existingCategory._id.toString() !== id) {
          resolve({ updated: false, message: "Category name already exists" });
        } else {
          await db.categories.updateOne(
            { _id: id },
            {
              $set: {
                categoryName: categoryData.Name,
                description: categoryData.Description,
              },
            }
          );
          resolve({ updated: true });
        }
      } catch (error) {
        reject(error);
      }
    });
  },

  // GET CATEGORY

  viewAddCategory: () => {
    return new Promise(async (resolve, reject) => {
      await db.categories.find().then((response) => {
        resolve(response);
      });
    });
  },
  // GET SINGLE CATEGORY
  viewCategoryData: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.categories.find({ _id: id }).then((response) => {
        resolve(response);
      });
    });
  },

  // DELETE CATEGORY
  deleteCategory: (delete_id) => {
    return new Promise(async (resolve, reject) => {
      await db.categories.deleteOne({ _id: delete_id }).then((response) => {
        resolve(response);
      });
    });
  },
  // DELETE PRODUCT
  deleteProduct: (delete_id) => {
    return new Promise(async (resolve, reject) => {
      await db.products.deleteOne({ _id: delete_id }).then((response) => {
        resolve(response);
      });
    });
  },
  // SOFT DELETE
  productInactive: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.products
        .updateOne({ _id: id }, { $set: { block: true } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // SOFT UNDELETE
  productActive: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.products
        .updateOne({ _id: id }, { $set: { block: false } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // EDIT PRODUCT
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

  // GET PRODUCT
  viewAddProduct: () => {
    return new Promise(async (resolve, reject) => {
      await db.products.find().then((response) => {
        resolve(response);
      });
    });
  },

  // GET USERS
  viewSignedUsers: () => {
    return new Promise(async (resolve, reject) => {
      await db.users.find().then((response) => {
        resolve(response);
      });
    });
  },
  // DELETE USER
  deleteUserData: (delete_id) => {
    return new Promise(async (resolve, reject) => {
      await db.users.deleteOne({ _id: delete_id }).then((response) => {
        resolve(response);
      });
    });
  },
  blockUserData: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.users
        .updateOne({ _id: id }, { $set: { block: true } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  unblockUserData: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.users
        .updateOne({ _id: id }, { $set: { block: false } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // REMOVE ORDER
  removeOrder: (id) => {
    return new Promise(async (resolve, reject) => {
      let ordId = new ObjectId(id);
      await db.orders.deleteOne({ _id: ordId }).then((response) => {
        resolve(response);
      });
    });
  },
  //order packed
  orderPacked: async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { orderstatus: "packed",
        pdate: new Date().toDateString(),
        sdate: null, 
        ddate: null, 
        } }
      );
      console.log("Order packed successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  //order shipped
  orderShipped: async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { orderstatus: "shipped",
        sdate: new Date().toDateString(),
        ddate: null,
        } }
      );
      console.log("Order packed successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  }, //order delivered
  orderDelivered: async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { orderstatus: "delivered",
                  ddate: new Date().toDateString(),
                } }
      );
      console.log("Order packed successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // return rejected
  returnReject:async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { returnstatus: "rejected",
                } }
      );
      console.log("Return rejected successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // return approved
  returnApproved:async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { returnstatus: "approved",
                } }
      );
      console.log("Return approved successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // return picked
  returnPicked:async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { returnstatus: "picked",
                } }
      );
      console.log("Return picked successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  //return refunded
  returnRefund:async (orderId) => {
    try {
      await db.orders.updateOne(
        { _id: orderId },
        { $set: { returnstatus: "refund",
                } }
      );
      console.log("Return refunded successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  // find return order
  findRetunOrder: (id) => {
    return new Promise(async (resolve, reject) => {
      await db.orders
        .find({ _id: id })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // refund amount
  refundAmount: async (orderId, amount) => {
    try {
      await db.users.updateOne(
        { _id: orderId },
        { $inc: { wallet: amount } }
      );
      console.log("Amount refunded successfully.");
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
    // sales report
    getAllDeliveredOrders: () => {
      return new Promise(async (resolve, reject) => {
        await db.orders.aggregate([
          {
            $match: { orderstatus: "delivered" },
          },
          {
            $lookup: {
              from: "users",
              localField: "userid",
              foreignField: "_id",
              as: "userDetails",
            },
          },
        ]).then((result) => {
          resolve(result);
        });
      });
    },
    // SALES REPORT DATE BY DATE
    getAllDeliveredOrdersByDate: (startDate, endDate) => {
      return new Promise(async (resolve, reject) => {
        // Convert startDate and endDate to appropriate format
        const formattedStartDate = new Date(startDate);
        formattedStartDate.setHours(0, 0, 0, 0); // Set time to the beginning of the day
        const formattedEndDate = new Date(endDate);
        formattedEndDate.setHours(23, 59, 59, 999); // Set time to the end of the day
  
        try {
          const orders = await db.orders.find({
            ddate: { $gte: formattedStartDate, $lte: formattedEndDate },
            orderstatus: "delivered",
          })
          .populate({
            path: "userid",
            model: "users",
            select: "name email phone", // Specify the fields to select from the user
          })
          .lean();
  
          console.log("Orders in range:", orders);
          console.log("getAllDeliveredOrdersByDate completed successfully.");
          resolve(orders);
        } catch (error) {
          console.error("Error in getAllDeliveredOrdersByDate:", error);
          reject(error);
        }
      });
    },
  
};
