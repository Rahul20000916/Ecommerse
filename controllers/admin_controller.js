const { response } = require("../app");
const adminHelpers = require("../helpers/adminHelpers");
const adminHelper = require("../helpers/adminHelpers");
const db = require("../model/connection");

const adminCred = {
  username: "admin@gmail.com",
  password: "Admin@123",
};

module.exports = {
  // ADMIN LOGIN PAGE
  getlogin: (req, res) => {
    try {
      if (req.session.adminLogggedIn) {
        res.render("admin/index");
      } else {
        let loginErr = req.session.adminLogggedIn;
        req.session.adminLogggedIn = null;
        res.render("admin/login", { loginErr });
      }
    } catch (err) {
      console.log(err);
    }
  },
  postLogin: (req, res) => {
    console.log("hello");
    let admin = req.body;
    console.log(admin);
    console.log(adminCred);
    if (admin.Email === adminCred.username) {
      if (admin.Password == adminCred.password) {
        req.session.adminLogggedIn = true;
        res.render("admin/index");
      } else {
        req.session.adminLogggedIn = false;
        console.log("password is invalid");
        res.redirect("/admin/login");
      }
    } else {
      req.session.adminLogggedIn = false;
      console.log("Email is invalid");
      res.redirect("/admin/login");
    }
  },
  // ADMIN LOGOUT
  adminLogout: (req, res) => {
    req.session.adminLogggedIn = null;
    res.redirect("/admin/login");
  },
  // ADMIN DASH PAGE
  dashBoard: (req, res) => {
    try {
      if (req.session.adminLogggedIn) {
        res.render("admin/index");
      } else {
        res.redirect("/admin/login");
      }
    } catch (err) {
      console.log(err);
    }
  },

  // PRODUCTS PAGE
  getProducts: (req, res) => {
    try {
      adminHelpers.viewAddCategory().then((response) => {
        let viewCategory = response;
        res.render("admin/add_products", { viewCategory });
      });
    } catch (err) {
      console.log(err);
    }
  },
  // ADD PRODUCTS

  addProducts: (req, res) => {
    try {
      console.log(req.body);
      let images = req.files.map((a) => a.filename);
      console.log(images);
      adminHelper.addProducts(req.body, images).then((add) => {
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // UPDATE PRODUCT

  updateProducts: (req, res) => {
    try {
      let id = req.params.id;
      let images = req.files.map((a) => a.filename);
      console.log(images);
      console.log(req.body);
      console.log(id);
      adminHelper.updateProducts(id, req.body, images).then((add) => {
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // MANAGE PRODUCTS
  manageProducts: (req, res) => {
    try {
      adminHelper.viewAddProduct().then((response) => {
        let viewProduct = response;
        console.log(viewProduct);
        res.render("admin/manage_products", { viewProduct });
      });
    } catch (err) {
      console.log(err);
    }
  },
  // DELETE PROUCT
  deleteProduct: (req, res) => {
    try {
      adminHelper.deleteProduct(req.params.id).then((response) => {
        console.log(req.params.id);
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },

   // SOFT DELETE
   softDelete: (req, res) => {
    try {
      adminHelper.productInactive(req.params.id).then((response) => {
        console.log(req.params.id);
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // SOFT UNDELETE
  softUnDelete : (req, res) => {
    try {
      adminHelper.productActive(req.params.id).then((response) => {
        console.log(req.params.id);
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },

  // EDIT PRODUCT
  editProduct: async (req, res) => {
    try {
      // Convert the viewCategory array of objects into an embedded array
      const viewCategory = (await adminHelpers.viewAddCategory()).map(
        (category) => [category.categoryName]
      );
      const id = req.params.id;
      const data = await adminHelpers.viewProductDetails(id);
      console.log(data);
      console.log(viewCategory);
      res.render("admin/edit_product", { data, viewCategory });
    } catch (err) {
      console.log(err);
    }
  },


  // CATEGORIES  PAGE
  getCategories: (req, res) => {
    try {
      adminHelpers.viewAddCategory().then((response) => {
        let viewCategory = response;
        res.render("admin/add_categories", { viewCategory });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // ADD CATEGORIES
  addCategories: (req, res) => {
    try {
      let data=req.body
      adminHelper.addCategories(data).then((response) => {
        res.redirect("/admin/add_categories");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // EDIT CATEGORY
  editCategory: async (req, res) => {
    try {
      const id = req.params.id;
      const viewCategory = await adminHelpers.viewAddCategory();
      const data = await adminHelpers.viewCategoryData(id);
      res.render("admin/edit_categories", { viewCategory, data: data[0] });
    } catch (err) {
      console.log(err);
    }
  },
  // UPDATE CATEGORY
  updateCategory: (req, res) => {
    try {
      const id= req.params.id;
      adminHelper.updateCategories(id,req.body ).then((response) => {
        console.log(response)
        res.redirect("/admin/add_categories");
      });
    } catch (err) {
      console.log(err)
    }
  },

  //DELETE CATEGORY
  deleteCategory: (req, res) => {
    try {
      adminHelper.deleteCategory(req.params.id).then((response) => {
        console.log(req.params.id);
        res.redirect("/admin/add_categories");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // MANAGE USERS
  manageUsers: (req, res) => {
    try {
      adminHelpers.viewSignedUsers().then((response) => {
        let viewUsers = response;
        res.render("admin/manage_users", { viewUsers });
      });
    } catch (err) {
      console.log(err);
    }
  },
  // DELETE USER
  deleteUser: (req, res) => {
    try {
      adminHelper.deleteUserData(req.params.id).then((response) => {
        console.log(req.params.id);
        res.redirect("/admin/manage_users");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // BLOCK USER
  blockUser: (req, res) => {
    try {
      adminHelper.blockUserData(req.params.id).then((response) => {
        const status = response;
        console.log(status);
        res.redirect("/admin/manage_users");
      });
    } catch (err) {
      console.log(err);
    }
  },
  unblockUser: (req, res) => {
    try {
      adminHelper.unblockUserData(req.params.id).then((response) => {
        const status = response;
        console.log(status);
        res.redirect("/admin/manage_users");
      });
    } catch (err) {
      console.log(err);
    }
  },
};
