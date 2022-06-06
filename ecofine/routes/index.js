var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var fetch = require("node-fetch");

var {
  checkAuth
} = require('./helperFunctions/helperFunctions')
var nodemailer = require('nodemailer')

require("dotenv").config()

const smtpTransport = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASS
  }
})

// allows analytics object from app.js to be manipulated in routes
module.exports = function(analytics){

  /* GET home page. */
  router.get("/", function (req, res, next) {
    // gets cookie session from req header
    const sessionCookie = req.cookies.session || "";
    // uses firebase-admin to verify session cookie which includes the uid for the firebase account
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then(() => {
        res.render("index", {
          loggedIn: true,
          analytics: analytics
        });
      })
      .catch(() => {
        res.render("index", {
          loggedIn: false,
          analytics: analytics
        });
      });
  });

  /* POST contact page. */
  router.post("/contact", async (req, res, next) => {
    const email = req.body.email
    const message = req.body.message
    const name = req.body.name

    // secret key for recaptcha
    var secretKey = process.env.RECAPTCHA_PRIVATE_KEY;
    
    try{

      // sending secret ket to check if valid
      let response = fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['grecaptchaResponse']}`, {
          method: 'POST',
          json: true
      })

      // if invalid send response of unsuccessful
      if(res.success !== undefined && !res.success) res.send("Recaptcha unsuccessful")

      try {
        // else send contact messsage to own email
        let sendResult = await smtpTransport.sendMail({
          from: 'G4Ecofine@gmail.com',
          to: 'G4Ecofine@gmail.com',
          subject: 'Contact enquiry from user on ecofine',
          text: `${unescape(message)}`,
          html: `<body><h3>Contact form  message received:</h3><p>Name: <b>${unescape(name)}</b></p><p>Email: ${unescape(email)} </p><p>Message:  ${unescape(message)}</p> </body>`
        })

        res.send("success")
      } catch (e) {
        console.log(e)
      }
    }catch(e){

    }
  })

  /* GET chat page. */
  router.get("/chat", checkAuth, (req,res,next) => {
    res.render("chat")
  })

  return router
}


// module.exports = router;
