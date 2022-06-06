var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
const pool = require("./helperFunctions/database")


var {
  checkAuth
} = require('./helperFunctions/helperFunctions')

// gets the profile page uses 'checkAuth' to prevent non logged in users from accessing the profile page
router.get("/profile", checkAuth, (req, res, next) => {
    admin
      .auth()
      .getUser(res.locals.uid)
      .then((userRecord) => {
        let uid = userRecord.uid
        const promise = new Promise((resolve, reject) => {
          // opens new pool connection which selects all bookmarks belonging to the user
          pool.connect((err, client, done) => {
            if (err) throw err
            client.query('SELECT * FROM bookmarks WHERE uid=$1', [uid], (err, res) => {
              done()
              if (err) {
                reject(err)
              } else {
                resolve(res.rows)
              }
            })
          })
  
        })
        // if successful then render profile.ejs and pass variables into it
        promise.then((data) => {
          res.render("profile", {
            loggedIn: res.locals.loggedIn,
            username: userRecord.displayName,
            bookmarks: data
          });
        }).catch((e) => {
          res.render("profile", {
            loggedIn: res.locals.loggedIn,
            username: userRecord.displayName,
            error: e
          });
        })
      })
      .catch((error) => {
        res.render("index", {
          loggedIn: true
        });
      });
  });

module.exports = router;