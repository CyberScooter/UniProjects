const request = require("supertest");
const app = require("../app");
const fetch = require("node-fetch");
const { response } = require("express");


describe("Test jobs route", () => {
    test("It should response the GET method", done => {
      request(app)
        .get("/search")
        .end(function(err, response) {

            // gets the XSRF-TOKEN From the response headers in the search page,
            // this is needed as a request to the server n
            let token = unescape(/XSRF-TOKEN=(.*?);/.exec(response.headers['set-cookie'])[1]);

            // response.headers['set-cookie'][2] = "session=zFflkkIzRwOrL3eYMEZcIsqGMK03; Path=/"
            // console.log(response.headers['set-cookie'])

            request(app)
                .post("/jobs")
                .set({cookie: response.headers['set-cookie']})
                .send({
                    _csrf: token,
                    'job': "java"
                })
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err,res) => {
                    // expect apiData list to be greater than zero
                    expect(res.body.apiData.length > 0)
                    done()
                })

            
        })

        
    });
  });
