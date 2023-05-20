module.exports = {
  userSession: (req, res, next) => {
    let user = req.session.loggedIn;
    let cartCount = null;
    if (user) {
      next();
    } else {
      res.render("user/login", { user , cartCount});
    }
  },
  adminSession: (req, res, next) => {
    if (req.session.adminLogggedIn) {
      next();
    } else {
      res.render("admin/login");
    }
  },
};
