var admin = require("firebase-admin");

// USED AS MIDDLEWARE TO CHECK IF USER IS LOGGED IN
const checkAuth = function (req, res, next) {
    // gets cookie session from req header
    const sessionCookie = req.cookies.session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((user) => {
        // console.log(user)
        res.locals.uid = user.uid;
        res.locals.loggedIn = true;
        next();
      })
      .catch(() => {
        res.redirect("/login");
      });
  };
  
  // STOPS LOGGED IN USERS FROM ACCESSING THE REGISTRATION OR LOGIN PAGE
  const restrictLoggedInAndRegisterPages = function (req, res, next) {
    // gets cookie session from req header
    const sessionCookie = req.cookies.session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(() => {
        res.redirect("/");
      })
      .catch(() => {
        next();
      });
  };
  
exports.checkAuth = checkAuth;
exports.restrictLoggedInAndRegisterPages = restrictLoggedInAndRegisterPages
