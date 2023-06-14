var express = require("express");
var router = express.Router();
const adminController = require("../controllers/admin_controller");
const middleware = require("../middleware/middleware");
const multer = require("../multer/multer");

// admin opening page
router.get("/", adminController.dashBoard);


// admin login page
router.get("/login", adminController.getlogin);
router.post("/login", adminController.postLogin);
router.get("/admin_logout", adminController.adminLogout);
// add products page
router.get(
  "/add_products",
  middleware.adminSession,
  adminController.getProducts
);
// add products to database
router.post(
  "/add_products",
  multer.uploads.array("image", 4),
  adminController.addProducts
);
// edit products
router.post(
  "/edit_product/:id",
  multer.uploads.array("image",4),
  adminController.updateProducts
)

// manage orders
router.get(
  "/manage_orders",
  middleware.adminSession,
  adminController.manageOrders
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

// create report
router.get(
  "/create_report",
  middleware.adminSession,
  adminController.report
)
module.exports = router;
