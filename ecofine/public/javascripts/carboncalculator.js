// DELETES THE CARBON COOKIE/RESETS THE COOKIE
function deleteCarbonCookie() {
    const csrfToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    .split('=')[1];
    
    fetch("/deleteCO2Cookie", {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken, // Passing cookieValue (whatever we received) back to the server

        },
    }).then(() => {
        document.getElementById("CarbonFormSection").hidden = false
        document.getElementById("ResetCarbon").hidden = true
    })
}


$(document).ready(function () {

    // checks if carbon cookie is already stored as soon as page is ready, if so then hide the input element
    if(document.cookie.split("; ").find((row) => row.startsWith("carbon=")) !== undefined){
        document.getElementById("CarbonFormSection").hidden = true
        document.getElementById("ResetCarbon").hidden = false
    }else {
        document.getElementById("CarbonFormSection").hidden = false
        document.getElementById("ResetCarbon").hidden = true
    }

    let data = null
    let miles = 0;


    // GET ELEMENT FORM BY ID LOGIN
    document.getElementById("CarbonDioxidePerMile").addEventListener("submit", (event) => {
        // STOP HTTP REQUEST TO THE SERVER, RUN THE CODE BELOW INSTEAD
        event.preventDefault();

        let cookie = document.cookie.split("; ").find((row) => row.startsWith("carbon="))

        // if carbon cookie is not already made
        if(cookie === undefined){
            var CO2permileinput = parseFloat(document.getElementById("CO2permileinput").value)

            var CO2perMileTimesMiles = CO2permileinput * miles;
            document.getElementById("CO2PerJourney").innerText = CO2perMileTimesMiles.toFixed(2)
    
            const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            .split('=')[1];
    
            fetch("/setCO2Cookie", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": csrfToken, // Passing cookieValue (whatever we received) back to the server
    
                },
                body: JSON.stringify({ CO2permileinput }),
            }).then(() => {
                document.getElementById("CarbonFormSection").hidden = true
                document.getElementById("ResetCarbon").hidden = false
            })
        }

    })

    $(document).change(function () {
        
        let cookieValue = document.cookie.split("; ").find((row) => row.startsWith("carbon="))

        // if website change is triggered hide or show the elements
        if(cookieValue === undefined){
            document.getElementById("CarbonFormSection").hidden = false
            document.getElementById("ResetCarbon").hidden = true
        }
    
        try {
            var result = document.getElementsByClassName("mapbox-directions-route-summary")

            // wait 1 second before finding the distance from the map
            setTimeout(function () {
                if (result[0] !== undefined) {
                    if (data != result[0]) {
                        data = result[0]

                        var milesInString = result[0].innerText.substr(0, result[0]
                            .innerText.indexOf(' ') - 2)


                        miles = parseFloat(milesInString)

                        if(cookieValue !== undefined) {
                            var CO2perMileTimesMiles = cookieValue.split('=')[1] * miles;
                            document.getElementById("CO2PerJourney").innerText = CO2perMileTimesMiles.toFixed(2)
                        }
                    }
                }
            }, 1000)
        } catch (e) {

        }
    });
});