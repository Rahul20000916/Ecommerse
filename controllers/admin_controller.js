const adminHelpers = require("../helpers/adminHelpers");
const adminHelper = require("../helpers/adminHelpers");
const db = require("../model/connection");
const { ObjectId } = require("mongodb");

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
  postLogin: async(req, res) => {
    let admin = req.body;
    console.log(admin);
    console.log(adminCred);
    if (admin.Email === adminCred.username) {
      if (admin.Password == adminCred.password) {
        req.session.adminLogggedIn = true;
        var revenue = await adminHelper.getRevenue();
        var orders = await  adminHelper.getNewOrders();
        var products = await  adminHelper.getProducts();
        var users  = await adminHelper.getUsers();
        var categories = await  adminHelper.getCategories();
        var chartData = await  adminHelper.getChartDetails();
        res.render("admin/index",{revenue,orders,products,users,categories,chartData});
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
  dashBoard: async(req, res) => {
    try {
      if (req.session.adminLogggedIn) {
        var revenue = await adminHelper.getRevenue();
        var orders = await adminHelper.getNewOrders();
        var products = await adminHelper.getProducts();
        var users  = await adminHelper.getUsers();
        var categories = await adminHelper.getCategories();
        var chartData = await adminHelper.getChartDetails();
        res.render("admin/index",{revenue,orders,products,users,categories,chartData});
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
      req.session.message = 'PRODUCT ADDED';
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
      req.session.message = 'PRODUCT EDITED'
      let images = req.files.map((a) => a.filename);
      console.log(images);
      console.log(req.body);
      console.log(id);
      adminHelper.updateProducts(id, req.body, images).then(() => {
        res.redirect("/admin/manage_products");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // manage orders

  manageOrders: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter, default to 1 if not provided
      const pageSize = 5; // Number of orders to show per page

      // Fetch all orders
      let orders = await adminHelper.orders();
      let message = req.session.message;
      req.session.message = null
      // Reverse the order of the orders array
      orders.reverse();

      const totalOrders = orders.length;
      const totalPages = Math.ceil(totalOrders / pageSize);

      // Calculate the start and end index of orders for the current page
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      // Get the orders for the current page
      const currentPageOrders = orders.slice(startIndex, endIndex);

      res.render("admin/manage_orders", {
        orders: currentPageOrders,
        currentPage: page,
        totalPages: totalPages,
        message,
      });
    } catch (err) {
      console.log(err);
    }
  },
    // manage returns

    manageReturns: async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1; // Get the current page from the query parameter, default to 1 if not provided
        const pageSize = 5; // Number of orders to show per page
  
        // Fetch all orders
        let orders = await adminHelper.returnOrders();
  
        // Reverse the order of the orders array
        orders.reverse();
  
        const totalOrders = orders.length;
        const totalPages = Math.ceil(totalOrders / pageSize);
  
        // Calculate the start and end index of orders for the current page
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
  
        // Get the orders for the current page
        const currentPageOrders = orders.slice(startIndex, endIndex);
  
        res.render("admin/manage_returns", {
          orders: currentPageOrders,
          currentPage: page,
          totalPages: totalPages,
        });
      } catch (err) {
        console.log(err);
      }
    },
 // manage mails
 manageMails:async(req,res)=>{
  try{
    let mails = await adminHelper.messages()
    let message = req.session.message;
    req.session.message =null;
    res.render("admin/manage_mails",{mails,message});
  }catch(err){
    console.log(err)
  }
 },
 // remove mail
 removeMail:async(req,res)=>{
  try{
  await adminHelper.removeMail(req.params.id)
  req.session.message = 'MESSAGE DELETED';
  res.redirect("/admin/manage_mails");
  }catch(err){
    console.log(err);
  }
 },
  // view orders
  viewOrders: async (req, res) => {
    try {
      let orderId = req.params.id;
      let message = req.session.message;
      req.session.message = null;
      console.log(orderId);
      let orders = await adminHelper.viewOrders(orderId);
      let addressId = orders[0].address;
      let addresss = await adminHelper.getOrderAddress(addressId);
      let address = addresss[0];
      console.log(address);
      console.log(orders);
      res.render("admin/order_status", { orders, address , message});
    } catch (err) {
      console.log(err);
    }
  },

  manageProducts: async (req, res) => {
    try {
      const currentPage = parseInt(req.query.page) || 1; // Current page number, default to 1
      const perPage = 5; // Number of items to display per page
      const startIndex = (currentPage - 1) * perPage; // Start index of the current page
      const endIndex = startIndex + perPage; // End index of the current page
      var message = req.session.message;
      req.session.message = null;
      const viewProduct = await adminHelper.viewAddProduct();
      const totalItems = viewProduct.length;
      const totalPages = Math.ceil(totalItems / perPage);

      const paginatedProducts = viewProduct.slice(startIndex, endIndex);

      res.render("admin/manage_products", {
        viewProduct: paginatedProducts,
        currentPage,
        totalPages,
        message,
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
        res.json({ message: 'product deleted successfully' });
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
        res.json({ message: 'product Inactivated successfully' });
      });
    } catch (err) {
      console.log(err);
    }
  },
  // SOFT UNDELETE
  softUnDelete: (req, res) => {
    try {
      adminHelper.productActive(req.params.id).then((response) => {
        res.json({ message: 'product Activated successfully' });
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
        message = req.session.message;
        req.session.message = null;
        let viewCategory = response;
        res.render("admin/add_categories", { viewCategory,message });
      });
    } catch (err) {
      console.log(err);
    }
  },

  // ADD CATEGORIES
  addCategories: (req, res) => {
    try {
      let data = req.body;
      req.session.message = 'CATEGORY ADDED'
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
  editCategories: async (req, res) => {
    try {
      const viewCategory = await adminHelpers.viewAddCategory();
      let data = null
      res.render("admin/edit_categories", { viewCategory, data});
    } catch (err) {
      console.log(err);
    }
  },
  // UPDATE CATEGORY
  updateCategory: (req, res) => {
    try {
      const id = req.params.id;
      req.session.message = "CATEGORY UPDATED"
      adminHelper.updateCategories(id, req.body).then((response) => {
        console.log(response);
        res.redirect("/admin/add_categories");
      });
    } catch (err) {
      console.log(err);
    }
  },

  //DELETE CATEGORY
  deleteCategory: (req, res) => {
    try {
      adminHelper.deleteCategory(req.params.id).then((response) => {
        req.session.message = 'CATEGORY DELETED'
        console.log(req.params.id);
        res.redirect("/admin/add_categories");
      });
    } catch (err) {
      console.log(err);
    }
  },

  manageUsers: async (req, res) => {
    try {
      const currentPage = parseInt(req.query.page) || 1; // Current page number, default to 1
      const perPage = 7; // Number of users to display per page
      const startIndex = (currentPage - 1) * perPage; // Start index of the current page
      const endIndex = startIndex + perPage; // End index of the current page

      const allUsers = await adminHelpers.viewSignedUsers();
      const totalItems = allUsers.length;
      const totalPages = Math.ceil(totalItems / perPage);

      const paginatedUsers = allUsers.slice(startIndex, endIndex);

      res.render("admin/manage_users", {
        viewUsers: paginatedUsers,
        currentPage,
        totalPages,
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
  removeOrder: async (req, res) => {
    try {
      await adminHelper.removeOrder(req.params.id).then(() => {
        req.session.message = 'ORDER DELETED'
        res.redirect("/admin/manage_orders");
      });
    } catch (err) {
      console.log(err);
    }
  },
  // order packed
  orderPacked: async (req, res) => {
    try {
      req.session.message = 'ORDER PACKED'
      const orderId = req.params.id;
      await adminHelper.orderPacked(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // order shipped
  orderShipped: async (req, res) => {
    try {
      const orderId = req.params.id;
      req.session.message = 'ORDER SHIPPED'
      await adminHelper.orderShipped(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // order delivered
  orderDelivered: async (req, res) => {
    try {
      req.session.message = 'ORDER DELIVERED'
      const orderId = req.params.id;
      await adminHelper.orderDelivered(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // return reject
  returnReject:async (req, res) => {
    try {
      const orderId = req.params.id;
      req.session.message = 'RETURN REJECTED DONE'
      await adminHelper.returnReject(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // return approved
  returnApproved:async (req, res) => {
    try {
      const orderId = req.params.id;
      req.session.message = 'RETURN APROVED DONE'
      await adminHelper.returnApproved(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // return picked
  returnPicked:async (req, res) => {
    try {
      const orderId = req.params.id;
      req.session.message = 'RETURN PICKED DONE'
      await adminHelper.returnPicked(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  // return refund
  returnRefund:async (req, res) => {
    try {
      const orderId = req.params.id;
      let id = new ObjectId(orderId)
      req.session.message = 'REDUNDED SUCESSFULLY'
      let order = await adminHelper.findRetunOrder(id);
      let userId = order[0].userid;
      let total = order[0].total;
      await adminHelper.refundAmount(userId,total);;
      await adminHelper.returnRefund(orderId);
      res.redirect("/admin/vieworders/" + orderId);
    } catch (err) {
      console.log(err);
    }
  },
  //report
  report: async (req, res) => {
    try {
          const sales = await adminHelper.getAllDeliveredOrders();

    sales.forEach((order) => {
      // Format the orderDate using built-in JavaScript methods or a date formatting library like Moment.js
      const formattedDate = new Date(order.ddate).toLocaleDateString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

      order.ddate = formattedDate;
    });
      res.render("admin/report", { sales });
    } catch (err) {
      console.log(err);
    }
  },
  salesReport: async (req, res) => {
    try {
      console.log(req.body);
      let { startDate, endDate } = req.body;

      startDate = new Date(startDate);
      endDate = new Date(endDate);

      const salesReport = await adminHelper.getAllDeliveredOrdersByDate(
        startDate,
        endDate
      );
      for (let i = 0; i < salesReport.length; i++) {
        salesReport[i].ddateate =
          salesReport[i].ddate.toLocaleDateString(); // Format the orderDate using toLocaleDateString
        salesReport[i].total = salesReport[i].total.toLocaleString(
          "en-IN",
          { style: "currency", currency: "INR" }
        ); // Format totalAmount as currency (INR)
      }
      res
        .status(200)
        .json({ sales: salesReport, startDate: startDate, endDate: endDate });
    } catch (error) {
      console.log(error);
    }
  },
  // coupon page
  coupon:async(req,res)=>{
    try{
      let coupon = await adminHelper.getCoupons()
      message = req.session.message;
      req.session.message = null;
      res.render("admin/add_coupon",{coupon,message});
    }catch(err){
      console.log(err);
    }
  },
  // add coupon
  addCoupon:async(req,res)=>{
    try{
      data = req.body;
      await adminHelper.addcoupon(data)
      req.session.message= 'COUPON ADDED'
      res.redirect("/admin/add_coupon");
    }catch(err){
      console.log(err);
    }
  },
  // update coupon
  updateCoupon:async(req,res)=>{
    try{
      id = req.params.id;
      data =req.body;
      req.session.message = 'COUPON UPDATED'
      await adminHelper.updateCoupon(id,data).then(()=>{
        res.redirect("/admin/add_coupon");
      })
    }catch(err){
      console.log(err);
    }
  },
  // remove coupon
  deleteCoupon:async(req,res)=>{
    try{
      req.session.message ="COUPON DELETED"
      await adminHelper.removeCoupon(req.params.id)
      res.redirect("/admin/add_coupon")
    }catch(err){
      console.log(err)
    }
  },
  // edit coupon page
  editCoupon:async(req,res)=>{
    try{
      let id = req.params.id
      let data = await adminHelper.findCoupon(req.params.id)
      let coupon = await adminHelper.getCoupons()
      res.render("admin/edit_coupon",{coupon,data})
    }catch(err){
      console.log(err)
    }
  },
  editCoupons:async(req,res)=>{
    try{
      console.log('------------------------------------------------------')
      let data = null;
      let coupon = await adminHelper.getCoupons()
      res.render("admin/edit_coupon",{coupon,data})
    }catch(err){
      console.log(err)
    }
  },

};
