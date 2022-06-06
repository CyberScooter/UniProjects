const request = require("supertest");
const app = require("../app");
const fetch = require("node-fetch");

describe("Test the profile page content", () => {
    test('All strings should be correct', (done) => {
    
      request(app)
      .get("/profile")
      .then(function(response) {
  
        document.body.innerHTML = response.text;
        
        
  
        done();
      });
    });
   });