var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin_controller");
const middleware = require("../middleware/middleware");
const multer = require("../multer/multer");

// admin opening page
router.get("/",adminController.dashBoard);

// admin login page
router.get("/login", adminController.getlogin);
router.post("/login", adminController.postLogin);
router.get("/admin_logout", adminController.adminLogout);

// router.get("/admin",middleware.adminSession,adminController.dashBoard);
// add products page
router.get(
  "/add_products",
  middleware.adminSession,
  adminController.getProducts
);
// add products to database
router.post(
  "/add_products",
  multer.uploads.array("image", 2),
  adminController.addProducts
);
// edit products
router.post(
  "/edit_product/:id",
  multer.uploads.array("image",2),
  adminController.updateProducts
)

// manage orders
router.get(
  "/manage_orders",
  middleware.adminSession,
  adminController.manageOrders
)
// manage mails
router.get(
  "/manage_mails",
  middleware.adminSession,
  adminController.manageMails
)
// ddelete mails
router.get(
  "/delete_mail/:id",
  middleware.adminSession,
  adminController.removeMail
)
// manage returns
router.get(
  "/manage_returns",
  middleware.adminSession,
  adminController.manageReturns
)
// view orders
router.get(
  "/vieworders/:id",
  middleware.adminSession,
  adminController.viewOrders
);

// manage products page
router.get(
  "/manage_products",
  middleware.adminSession,
  adminController.manageProducts
);

// delete product
router.get(
  "/delete_product/:id",
  middleware.adminSession,
  adminController.deleteProduct
);

// edit product
router.get(
  "/edit_product/:id",
  middleware.adminSession,
  adminController.editProduct
);

// soft delete
router.get(
  "/soft_delete/:id",
  middleware.adminSession,
  adminController.softDelete
);

// soft delete
router.get(
  "/soft_undelete/:id",
  middleware.adminSession,
  adminController.softUnDelete
)

// add categories page
router.get(
  "/add_categories",
  middleware.adminSession,
  adminController.getCategories
);

// add category to database
router.post(
  "/add_categories",
  middleware.adminSession,
  adminController.addCategories
);
// edit category
router.get(
  "/edit_category/:id",
  middleware.adminSession,
  adminController.editCategory
);
router.get(
  "/edit_category",
  middleware.adminSession,
  adminController.editCategories
);
router.post(
  "/edit_categories/:id",
  middleware.adminSession,
  adminController.updateCategory
);

// delte category
router.get(
  "/delete_category/:id",
  middleware.adminSession,
  adminController.deleteCategory
);

// maange users
router.get(
  "/manage_users",
  middleware.adminSession,
  adminController.manageUsers
);

// delete user
router.get(
  "/delete_user/:id",
  middleware.adminSession,
  adminController.deleteUser
);

// block usesr
router.get(
  "/block_user/:id",
  middleware.adminSession,
  adminController.blockUser
);

// unblock user
router.get(
  "/unblock_user/:id",
  middleware.adminSession,
  adminController.unblockUser
);

// delete order
router.get(
  "/remove_order/:id",
  middleware.adminSession,
  adminController.removeOrder
  );
// order packed
router.get(
  "/order_packed/:id",
  middleware.adminSession,
  adminController.orderPacked
  );
 // order shipped
 router.get(
  "/order_shipped/:id",
  middleware.adminSession,
  adminController.orderShipped
  );
 // order delivered
  router.get(
  "/order_delivered/:id",
  middleware.adminSession,
  adminController.orderDelivered
  );
 // return rejected
  router.get(
  "/remove_return_order/:id",
  middleware.adminSession,
  adminController.returnReject
  );
   // return approved
   router.get(
    "/return_approved/:id",
    middleware.adminSession,
    adminController.returnApproved
    );
  // return picked
    router.get(
      "/return_picked/:id",
      middleware.adminSession,
      adminController.returnPicked
      );
    // return refund
    router.get(
      "/return_refund/:id",
      middleware.adminSession,
      adminController.returnRefund
      );
// create report
router.get(
  "/create_report",
  middleware.adminSession,
  adminController.report
)
// datebydate report
router.post("/sales-report",
middleware.adminSession,
adminController.salesReport);

// add coupon page
router.get("/add_coupon",
middleware.adminSession,
adminController.coupon);
// add coupon
router.post("/add_new_coupon",
middleware.adminSession,
adminController.addCoupon);
//update coupon
router.post("/update_coupon/:id",
middleware.adminSession,
adminController.updateCoupon);
// remove coupon
router.get("/delete_coupon/:id",
middleware.adminSession,
adminController.deleteCoupon);
// edit coupon page
router.get("/edit_coupon/:id",
middleware.adminSession,
adminController.editCoupon);

router.get("/edit_coupons",
middleware.adminSession,
adminController.editCoupons);



module.exports = router;
