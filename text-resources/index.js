/* Internal Logic Script */

// Global variables
var floatingActionButtonElements;
var floatingActionButtonInstances;
var tooltipElements;
var tooltipInstances;
var modalElements;
var modalInstances;

var otpFlag = false;

var user;

// Handle page onload events
window.onload = function(){

	/* Essential Onload Events */

	// Register Service Worker

	if ("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js");}

	// Set copyright text year
	document.getElementById("copyrightYear").innerHTML = new Date().getFullYear();

	/* Initialize Materialize Elements */

	// Initialize Floating Action Buttons
	floatingActionButtonElements = document.querySelectorAll('.fixed-action-btn');
	floatingActionButtonInstances = M.FloatingActionButton.init(floatingActionButtonElements);

	// Initialize Tooltips
	tooltipElements = document.querySelectorAll('.tooltipped');
	tooltipInstances = M.Tooltip.init(tooltipElements);

	// Initialize Modals
	modalElements = document.querySelectorAll('.modal');
	modalInstances = M.Modal.init(modalElements);

	/* Initialize Firebase */

	firebase.initializeApp({
		apiKey: "AIzaSyCTf6B3ZRrtABsCa3vcrvxzXnewhspVAsY",
		authDomain: "card-store.firebaseapp.com",
		databaseURL: "https://card-store.firebaseio.com",
		projectId: "card-store",
		storageBucket: "card-store.appspot.com",
		messagingSenderId: "208535869311"
	});

	/* Firebase Actions */

	// Set Firebase language
	firebase.auth().useDeviceLanguage();

	// Set up invisible reCAPTCHA
	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('rp', {
		'size': 'invisible',
		'callback': function(response) {
			// reCAPTCHA solved, allow signInWithPhoneNumber.
		}
	});

	// Send SMS for verification

	document.getElementById("signIn").onclick= function(){

		if(otpFlag){
			otpFlag = false;
			blockSignInModal();
			confirmationResult.confirm(document.getElementById("phoneNumber").value).then(function (result) {
				// User signed in successfully.
					user = result.user;
					unblockSignInModal();
					signedIn();
				}).catch(function (error) {
					// User couldn't sign in (bad verification code?)
					console.log("%cInvalid OTP. -->" + error, "background-color:#5555FF; color:#FF0000;");
				});
		}

		else{
			blockSignInModal();
			firebase.auth().signInWithPhoneNumber(document.getElementById("phoneNumber").value, window.recaptchaVerifier).then(function(confirmationResult){
				// SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
				window.confirmationResult = confirmationResult;
				unblockSignInModal();
				document.getElementById("signIn").innerHTML = "Verify OTP";
				document.getElementById("phoneNumber").value = "";
				document.getElementById("phno").innerHTML = "OTP";
				document.getElementById("phoneNumber").focus();
				otpFlag = true;
			}).catch(function(error){
				// Error; SMS not sent
				console.log("%cError Sending SMS. -->" + error, "background-color:#5555FF; color:#FF0000;");
			});
		}
	}

	// Callback after successful sign in

	function signedIn(){
		modalInstances[0].close();
		document.getElementById("username").innerHTML = "<b>Sign Out</b>";
		document.getElementById("username").classList.remove("modal-trigger");
		document.getElementById("username").href = "";
		document.getElementById("landingContents").style.display = "none";
		document.getElementById("pageContents").style.display = "block";
	}

	// Callback after successful sign out

	function signedOut(){
		document.getElementById("username").innerHTML = "<b>Sign In</b>";
		document.getElementById("username").classList.add("modal-trigger");
		document.getElementById("username").href = "#signInModal";
		document.getElementById("landingContents").style.display = "block";
		document.getElementById("pageContents").style.display = "none";
	}

	// Block sign in modal

	function blockSignInModal(){
		document.getElementById("phoneOtpDiv").style.display = "none";
		document.getElementById("signIn").classList.add("disabled");
		document.getElementById("spinner").style.display = "block";
	}

	// Unblock sign in modal

	function unblockSignInModal(){
		document.getElementById("phoneOtpDiv").style.display = "block";
		document.getElementById("signIn").classList.remove("disabled");
		document.getElementById("spinner").style.display = "none";
	}

	/* Other Events */

	// Handle mouseover events for floating action buttons
	document.getElementById("addNewCard").onmouseover = function(){document.getElementById("addNewCard").classList.add("pulse");}
	document.getElementById("addNewCard").onmouseout = function(){document.getElementById("addNewCard").classList.remove("pulse");}

}
