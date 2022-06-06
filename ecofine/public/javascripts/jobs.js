document.getElementById("jobs").addEventListener("submit", (event) => {
  event.preventDefault();
  const job = escape(event.target.job.value);

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    .split("=")[1];

  var loading = document.getElementById("Loading");

  fetch("/jobs", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": cookieValue, // security, to make sure you're the right person
      },
      body: JSON.stringify({
        job
      }),
    })
    .then((res) => {

      return res.text();
    })
    .then((data) => {
      loggedInAndAPIData = JSON.parse(data);
      loggedIn = loggedInAndAPIData.loggedIn

      data = loggedInAndAPIData.apiData

      // Found X results

      var foundResultsHTML = document.getElementById("FoundResults").innerText = `Found ${data.length} jobs`

      var mainContainer = document.getElementById("jobsData");

      mainContainer.innerHTML = ""

      let bookmark = ""

      for (var i = 0; i < data.length; i++) {
        if (loggedIn) {
          bookmark = `<div class="col-3 pl-1 text-center">
                        <button id=${data[i].url} class="btn btn-primary btn-block" onclick="bookmark(this.value);" value="${data[i].url}|${data[i].company}">
                          <span class="material-icons" style="font-size: large">
                          bookmark_add
                          </span>
                        </button>
                      </div>`
        }

        var col = document.createElement("div");

        var card = document.createElement("div");
        card.setAttribute("class", "card fade-in");
        card.setAttribute("display", "inline-block");
        card.innerHTML = `
              <div class="card-body">
                <img class="rounded w-25 mb-3 fade-in2" style="animation-delay: 100ms" src="${data[i].company_logo}" alt="Sorry, image not found">
                <h5 class="card-title fade-in2" style="animation-delay: 150ms">${data[i].position}</h5>
                <h6 class="card-title fade-in2" style="animation-delay: 200ms">${data[i].company}</h6>
                <p class="card-text text-muted" style="animation-delay: 250ms">${data[i].description.trim().substring(0, 200)}... Read more in site listing</p>
                <div class="row">
                  <div class="col-9 pr-1 text-center">
                    <a target="_blank" href="${data[i].url}" class="btn btn-primary btn-block fade-in2" style="animation-delay: 300ms">Apply Now</a>
                  </div>
                  ${bookmark}
                </div>
              </div>
              <!--
              <div class="card-footer">
                <small class="text-muted">${data[i].location}</small>
              </div>
              -->
        `;
        col.append(card);

        mainContainer.appendChild(col);
      } 

    });
});

function bookmark(event) {
  var urlAndCompanyData = event.split("|")

  const cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    .split('=')[1];

  fetch("/addBookmark", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "CSRF-Token": cookieValue,
      },
      body: JSON.stringify({
        urlAndCompanyData
      }),
    }).then((res) => res.text())
    .then((res) => {
      let element = document.getElementById(urlAndCompanyData[0])
      // if string is in json format
      if (isJson(res)) {
        // change string to object
        let data = JSON.parse(res)
        // if data.code is not undefined
        if (typeof (data.code) !== undefined) {
          // if data.code is 23505 (meaning that if a duplicate value is inserted into database, same primary key)
          if (data.code === "23505") {
            // change to already bookmarked the button and disable it
            element.innerText = "Already added"
            element.className = 'btn btn-warning btn-block'
            element.innerHTML = '<span class="material-icons" style="font-size: large"> bookmark </span>'
            element.disabled = true
            // exit the code
            return
          }
        }
      }
      // change button to bookmarked and disable if there were no issues
      element.innerText = "Bookmarked"
      element.className = 'btn btn-success btn-block'
      element.innerHTML = '<span class="material-icons" style="font-size: large"> bookmark_added </span>'
      element.disabled = true
    })
}

// checks if input string is in json format
function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}