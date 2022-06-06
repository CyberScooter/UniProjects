// THIS CODE RUNS EVERYTIME THE LOGIN OR REGISTER PAGE IS ACCESSED

// STORE THESE DETAILS IN THE EXACT FORMAT IN A NEW 'config' FOLDER IN ROOT OF THE PROJECT AND CALLED IT 'publicKey.json'
var publicKeyInfo = {
  apiKey: "AIzaSyAh_-MJ0Z1XjJTqa8XwbT3_1FaTr0_4oD8",
  authDomain: "ecofine-d1568.firebaseapp.com",
  databaseURL: "https://ecofine-d1568-default-rtdb.firebaseio.com",
  projectId: "ecofine-d1568",
  storageBucket: "ecofine-d1568.appspot.com",
  messagingSenderId: "244243978487",
  appId: "1:244243978487:web:ff1e00c00ecda6ee7adbf2",
  measurementId: "G-RKWF80o4K3S"
};

// THIS CHECKS IF FIREBASE IS ALREADY INTIALISED
if (!firebase.apps.length) {
  firebase.initializeApp(publicKeyInfo);
}else {
  firebase.app(); // if already initialized, use that one
}


  // IF THE URL PATH IS IN LOGIN
  if(window.location.pathname == "/login") {
    // WAIT FOR HTML CONTENT TO BE LOADED
    window.addEventListener("DOMContentLoaded", () => {  

      //DISABLE FIREBASE SESSION HANDLING TO MAKE OUR OWN (USING COOKIES)
      firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    
      // GET ELEMENT FORM BY ID LOGIN
      document.getElementById("login")
      // IF THE FORM IS SUBMITTED
        .addEventListener("submit", (event) => {
          // STOP HTTP REQUEST TO THE SERVER, RUN THE CODE BELOW INSTEAD
          event.preventDefault();
          // GET EMAIL AND PASSSWORD FROM FIELDS
          const email = escape(event.target.email.value);
          const password = escape(event.target.password.value);

          document.getElementById("Error").innerText = ""
    

          // gets XSRF-TOKEN (sent from server) cookie set at the start by the server
          // XSRF TOKEN ENSURES SAFE COOKIE HANDLING BETWEEN USER AND SERVER
          const cookieValue = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          .split('=')[1];


          var loading = document.getElementById("Loading-icon")

          loading.style.opacity = 100;
          //loading.innerHTML = "Attempting to log in... please wait ..."

          // ACCESS FIREBASE API
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(({ user }) => {
              // GET ID TOKEN OF THE USER THAT HAS JUST BEEN SAVED TO THE FIREBASE AUTHENTICATION DATABASE
              return user.getIdToken().then((idToken) => {
                // USE THAT ID TOKEN AS THE VALUE FOR THE SESSION COOKIE,
                // THIS SENDS A REQUEST TO createSession route in the server
                return fetch("/createSession", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": cookieValue, // Passing cookieValue (whatever we received) back to the server
                  },
                  body: JSON.stringify({ idToken }),
                });
              });
            

            })
            .catch((err) => {
              document.getElementById("Error").innerText = err
              loading.style.opacity = 0

            })
            .then(() => {
              // SIGN OUT OF THE FIREBASE AUTHENTICATION SESSION, WE'RE USING THE COOKIES ABOVE INSTEAD
              return firebase.auth().signOut();
            })
            .then(() => {
              if(document.getElementById("Error").innerText == ""){
                // redirect to home page (index)
                window.location.replace("/");
              }
            });
        });
    })  
    // if user is in the register page
  }else if (window.location.pathname == "/register"){
    // remove session handling from firebase, use cookies instead
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);

    document.getElementById("register")
      .addEventListener("submit", (event) => {
        event.preventDefault();
        const email = escape(event.target.email.value);
        const password = escape(event.target.password.value);
        const username = escape(event.target.username.value);

        // gets XSRF-TOKEN cookie set at the start by the server
        // this is for privacy to send back to server and validated to make sure its correct
        const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        .split('=')[1];

        let grecaptchaResponse = grecaptcha.getResponse()
        var loading = document.getElementById("Loading-icon")
        var recaptchaUnfilled = document.getElementById("RecaptchaUnfilled")
        recaptchaUnfilled.innerText = ""

        

        if(grecaptchaResponse.length != 0){

          firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {

              // firebase.database().ref('users/' + user.uid).set({
              //   username: username,
              //   email: email,
              // });
              
              loading.style.opacity = 100;

              return user.getIdToken().then((idToken) => {
                return fetch("/createSession", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "CSRF-Token": cookieValue,
                  },
                  body: JSON.stringify({ idToken, grecaptchaResponse }),
                });
              });
              
            })
            .catch((err) => {
              document.getElementById("Error").innerText = err
            })
            .then(() => {
              // once USER HAS BEEN CREATED ABOVE UPDATE THE DISPLAY NAME IN FIREBASE TO THE USERNAME PASSED INTO THE REGISTRATION FORM
              var user = firebase.auth().currentUser;
              return user.updateProfile({
                displayName: username
              })
            })
            .then(() => {
              // SIGN OUT TO DISABLE FIREBASE'S AUTHENTICATION SESSION HANDLING SYSTEM
              return firebase.auth().signOut();
            })
            .then(() => {
              // REDIRECT TO HOME PAGE
              window.location.replace("/");
            });
          
          return false;
  
        }else {
          recaptchaUnfilled.innerText = "Recaptcha not filled in"
        }
      });


  }