module.exports = {
  userSession: (req, res, next) => {
    let user = req.session.loggedIn;
    let cartCount = null;
    if (user) {
      next();
    } else {
      let loginErr = null;
      res.render("user/login", { user, cartCount,loginErr });
    }
  },
  adminSession: (req, res, next) => {
    if (req.session.adminLogggedIn) {
      next();
    } else {
      let loginErr = req.session.adminLogggedIn;
      req.session.adminLogggedIn = null;
      res.render("admin/login", { loginErr });
    }
  },
};
