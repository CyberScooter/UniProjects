const request = require("supertest");
const app = require("../app");
const fetch = require("node-fetch");

describe("Test the search page content", () => {
    test('All strings should be correct', (done) => {

        request(app)
            .get("/search")
            .then(function (response) {

                document.body.innerHTML = response.text;

                expect(document.getElementById("CO2permileinput").exists()).toBeTruthy()
                expect(document.getElementById("CO2SubmitButton").exists()).toBeTruthy()

                done();
            });
    });
});