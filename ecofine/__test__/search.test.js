const request = require("supertest");
const app = require("../app");
const fetch = require("node-fetch");


describe("Test the search page content", () => {
    test('All strings should be correct', (done) => {
    
      request(app)
      .get("/search")
      .then(function(response) {
  
        document.body.innerHTML = response.text;
        
        expect(document.getElementsByClassName("searchbar-logo").innerHTML).toBe("ecofine");
        expect(document.getElementsByClassName("form-control border-left-0").innerHTML).toBe("Search Jobs"));
  
        done();
      });
    });
  });