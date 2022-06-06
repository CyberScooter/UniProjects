const request = require("supertest");
const app = require("../app");
const fetch = require("node-fetch");

describe("Test the root path", () => {
  test("It should response the GET method", done => {
    request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        done();
      });
  });
});

describe("Test the index page content", () => {
  test('All strings should be correct', (done) => {
  
    request(app)
    .get("/")
    .then(function(response) {

      document.body.innerHTML = response.text;
      
      expect(document.getElementById("job-search-slogan").innerHTML).toBe("Job search, reinvented");
      expect(document.getElementById("job-search-description").innerHTML).toBe("Find thousands of remote job opportunities to keep you living greener and comfortably.");
      expect(document.getElementById("job-search-button").innerHTML).toBe("Search Jobs");
      expect(document.getElementById("job-search-analytics").innerHTML).toBe("Total Job Searches");
      expect(document.getElementById("visitors-analytics").innerHTML).toBe("Daily Visitors");
      expect(document.getElementById("bookmarks-analytics").innerHTML).toBe("Total Bookmarks");
      expect(document.getElementById("chat-feature").innerHTML).toBe("Socials");
      expect(document.getElementById("chat-feature-description").innerHTML).toBe("");
      expect(document.getElementById("remote-jobs-feature").innerHTML).toBe("Remote Work");
      expect(document.getElementById("remote-jobs-feature-description").innerHTML).toBe("");
      expect(document.getElementById("map-feature").innerHTML).toBe("Navigation");
      expect(document.getElementById("map-feature-description").innerHTML).toBe("");
      expect(document.getElementById("contact-header").innerHTML.toBe("Contact"));
      done();
    });
  });
 });