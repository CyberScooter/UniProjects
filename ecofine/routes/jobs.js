var express = require("express");
var router = express.Router();
var admin = require("firebase-admin");
var fetch = require("node-fetch");
const pool = require("./helperFunctions/database")



module.exports = function(analytics){

  router.post("/jobs", async (req, res, next) => {
      var loggedIn = false;
      const sessionCookie = req.cookies.session || "";
      admin
        .auth()
        .verifySessionCookie(sessionCookie, true)
        .then(() => {
          loggedIn = true
        })
        .catch(() => {
          loggedIn = false
        });
    
      // gets the form input data called name in the index.ejs file
      let job = req.body.job.toString();
    
      // attached the job name at the end of the url
      let url = `https://remoteok.io/api?tag=${job}`;
    
      // await basically allows asynchronous code to run
      // stores data from request to the variable called response
      // put inside try/catch block in case there was an error trying to run this code as its asynchronous so its more likely
      try {
        const response = await fetch(url, {
          headers: {
            // API requires user agent to access data
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.89 Safari/537.36",
            Accept: "application/json; charset=UTF-8",
          },
        });
    
        // extracts json data from request data
        let data = await response.json();
    
        //contains all the data for given job starting from index 1 till the end of the list
        data = data.slice(1);
    

        analytics.jobSearches++;
        //renders the index.ejs file in the views folder with a variable called 'apidata' which contains the api data as passed in below
        res.send({
          loggedIn: loggedIn,
          apiData: data
        });
      } catch (e) {
        res.send({
          error: "Found an error"
        });
      }
  });

  /* GET search page. */
  router.get("/search", (req, res, next) => {
      res.render("search");
  });

  router.post("/deleteBookmark", (req, res, next) => {
    let url = req.body.value
    const sessionCookie = req.cookies.session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((user) => {
        let uid = user.uid
        const promise = new Promise((resolve, reject) => {
          // open new pool connection and delete bookmark belonging to specified user
          pool.connect((err, client, done) => {
            if (err) throw err
            client.query("DELETE FROM bookmarks WHERE url=$1 AND uid=$2", [url, uid], (err, res) => {
              done()
              if (err) {
                reject(err)
              } else {
                resolve(true)
              }
            })
          })
        })
        promise.then(() => {
          if(analytics.bookmarks > 0) analytics.bookmarks--;
          res.send("Successful")
        }).catch((e) => {
          res.send("Error has occured")
        })
      })
      .catch(() => {
        res.render("index", {
          loggedIn: false
        });
      });
  })

  router.post("/addBookmark", (req, res, next) => {
    let data = req.body.urlAndCompanyData
    // gets cookie session from req header
    const sessionCookie = req.cookies.session || "";
    admin
      .auth()
      .verifySessionCookie(sessionCookie, true)
      .then((user) => {
        const promise = new Promise((resolve, reject) => {
          let uid = user.uid
          // open new pool connection and add bookmark to specified user
          pool.connect((err, client, done) => {
            if (err) throw err
            client.query(`INSERT INTO bookmarks(url, uid, company) VALUES($1, $2, $3)`, [data[0], uid, data[1]], (err, res) => {
              done()
              if (err) {
                reject(err)
              } else {
                resolve(true)
              }
            })
          })
        })

        // if successful
        promise.then((res) => {
          // increment analytics for bookmarks and send response
          analytics.bookmarks++;
          res.send("Successful")
        }).catch((e) => {
          // send response
          res.send(e)
        })
      })
    .catch(() => {
      res.render("index", {
        loggedIn: false
      });
    });
  })

  return router;

}