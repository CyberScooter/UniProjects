var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var fetch = require("node-fetch");

var {
    restrictLoggedInAndRegisterPages
  } = require('./helperFunctions/helperFunctions')

// GETS LOGGEDIN PAGE, USES THE MIDDLEWARE 'restrictLoggedInAndRegisterPages' to STOP LOGGED IN USERS ACCESSING THE LOG IN PAGE
router.get("/login", restrictLoggedInAndRegisterPages, function (req, res, next) {
    res.render("login");
});



// gets the register page, USES THE MIDDLEWARE 'restrictLoggedInAndRegisterPages' to STOP LOGGED IN USERS ACCESSING THE LOG IN PAGE
router.get("/register", restrictLoggedInAndRegisterPages, function (req, res, next) {
    res.render("register");
});


// creates a session cookie which is called from the auth.js file in the frontend
router.post("/createSession", async (req, res, next) => {
    var secretKey = process.env.RECAPTCHA_PRIVATE_KEY;
    
    try{

        let response = fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['grecaptchaResponse']}`, {
            method: 'POST',
            json: true
        })

        // if not successful
        if(res.success !== undefined && !res.success) res.send("Recaptcha unsuccessful")

        const idToken = req.body.idToken.toString();
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
    
        admin
            .auth()
            .createSessionCookie(idToken, {
            expiresIn
            })
            .then(
                (sessionCookie) => {
                    const options = {
                    maxAge: expiresIn,
                    httpOnly: true
                    };
                    res.cookie("session", sessionCookie, options);
                    res.end(JSON.stringify({
                    status: "success"
                    }));
                },
                (error) => {
                    res.status(401).send("Not allowed!");
                }
            );


    }catch(e){
        res.send("Recaptcha unsuccessful")
    }

});

// DELETES SESSION COOKIE FOR THE GIVEN USER WHEN IT ACCESSES THE LOGOUT PAGE
router.get("/logout", (req, res, next) => {
    res.clearCookie("session");
    res.redirect("/");
});

module.exports = router;