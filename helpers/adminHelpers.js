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
  orders:()=>{
    return new Promise(async(resolve, reject) => {
       await db.orders.find().then((response)=>{
        resolve(response)
       })
    });
  },
  // ORDERS WITH ID

  viewOrders:(id)=>{
    let ordId = new ObjectId(id);
    return new Promise(async(resolve, reject) => {
      await db.orders.find({_id:ordId}).then((response)=>{
       resolve(response)
      })
   });
  },

 // ORDERED ADDRESS
 getOrderAddress: (id)=>{
  let addressId = new ObjectId(id);
  return new Promise(async(resolve, reject) => {
    await db.addresses.find({_id:addressId}).then((response)=>{
    resolve(response)
    })
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
  
        db.products
          .updateOne({ _id: id }, { $set: updateData })
          .then(() => {
            resolve();
          });
      } catch (error) {
        console.log(error);
      }
    });
  },
  // GET PRODUCT

  getAllProducts: () => {
    return new Promise((resolve, reject) => {
      let products = db.get().collection("products").find();
    });
  },
  // ADD CATEGORY

  addCategories: (categoryData) => {
    return new Promise(async (resolve, reject) => {
      // Check if categoryName already exists in the database
      const existingCategory = await db.categories.findOne({ categoryName: categoryData.Name });
  
      if (existingCategory) {
        resolve({ added: false, message: 'Category already exists' });
      } else {
        const uploadCategory = new db.categories({
          categoryName: categoryData.Name,
          description: categoryData.Description,
        });
        
        uploadCategory.save().then((data) => {
          resolve({ added: true });
        }).catch((error) => {
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
        const existingCategory = await db.categories.findOne({ categoryName: categoryData.Name });
  
        if (existingCategory && existingCategory._id.toString() !== id) {
          resolve({ updated: false, message: 'Category name already exists' });
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
  productInactive :(id)=>{
    return new Promise(async (resolve, reject) => {
      await db.products
        .updateOne({ _id: id }, { $set: { block: true } })
        .then((response) => {
          resolve(response);
        });
    });
  },
  // SOFT UNDELETE
  productActive :(id)=>{
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
      await db.users
        .deleteOne({ _id: id })
        .then((response) => {
          resolve(response);
        });
    });
  },
};
