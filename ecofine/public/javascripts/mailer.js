$(document).ready(() => {
    document.getElementById("Loading-icon").hidden = true;

    
    document.getElementById("contact_form").addEventListener("submit", (event) => {
        event.preventDefault()

        // gets CSRF TOKEN
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("XSRF-TOKEN="))
            .split("=")[1];


        // gets recaptcha response
        let grecaptchaResponse = grecaptcha.getResponse()
    
        // if its not 0
        if(grecaptchaResponse.length != 0){


            var name = escape(document.getElementById("NameInput").value)
            var email = escape(document.getElementById("EmailInput").value)
            var message = escape(document.getElementById("TextInput").value)

            // Loading-icon

            document.getElementById("SubmitEmail").disabled = true

            if((name && email && message) != ""){
                document.getElementById("Loading-icon").hidden = false;


                // send post request to /contact with the message data as well as the grecaptchaResponse
                fetch("/contact", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        "CSRF-Token": cookieValue, // security, to make sure you're the right person
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        message,
                        grecaptchaResponse
                    }),
                }).then((res) => {
                    // if successful alert
                    alert("Your message has been successfully submitted!")
                    document.getElementById("Loading-icon").hidden = true;
                    document.getElementById("SubmitEmail").disabled = false

                    document.getElementById("NameInput").value = ""
                    document.getElementById("EmailInput").value = ""
                    document.getElementById("TextInput").value = ""
                    grecaptcha.reset();
                
                })
            }else {
                // if error
                alert("Please make sure all of the fields are full")
            
                document.getElementById("SubmitEmail").disabled = false

                document.getElementById("NameInput").value = ""
                document.getElementById("EmailInput").value = ""
                document.getElementById("TextInput").value = ""
                grecaptcha.reset();
            }
        }else {
            // if recaptcha empty
            alert("Recaptcha not filled in")
        }
    })

})


