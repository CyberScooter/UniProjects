var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");


router.post("/setCO2Cookie", (req, res, next) => {
    const expiresIn = 60 * 60 * 24 * 1 * 1000;
    const carbonPerMile = req.body.CO2permileinput;
  
    const options = {
      maxAge: expiresIn
    };
  
    // create cookie called carbon that lasts a day, in order to store the carbon emissions value
    res.cookie("carbon", carbonPerMile, options);
    res.end(JSON.stringify({
      status: "success"
    }));
  })
  

router.get("/deleteCO2Cookie", (req, res, next) => {
    // destroy the carbon cookie
    res.clearCookie("carbon")
    res.end(JSON.stringify({
      status: "success"
    }));
})

// maps, set to logged in to true at first
router.get("/maps", (req, res, next) => {
    // gets cookie session from req header
    // checks if user is logged in, displays the page differently because of it
    const sessionCookie = req.cookies.session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(() => {
        res.render("maps", {
          loggedIn: true
        })
      })
      .catch((error) => {
        res.render("maps", {
          loggedIn: false
        });
      });
  
})

module.exports = router;
  