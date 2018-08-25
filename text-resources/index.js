/* Internal Logic Script */

// Global variables
var floatingActionButtonElements;
var floatingActionButtonInstances;
var tooltipElements;
var tooltipInstances;
var modalElements;
var modalInstances;

// Handle page onload events
window.onload = function(){

	/* Essential Onload Events */

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
	window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('signIn', {
		'size': 'invisible',
		'callback': function(response) {
			// reCAPTCHA solved, allow signInWithPhoneNumber.
		}
	});

	// Send SMS for verification

	document.getElementById("signIn").onclick= function(){
		firebase.auth().signInWithPhoneNumber(document.getElementById("phoneNumber").value, window.recaptchaVerifier).then(function(confirmationResult){
			// SMS sent. Prompt user to type the code from the message, then sign the user in with confirmationResult.confirm(code).
			window.confirmationResult = confirmationResult;
		}).catch(function(error){
			// Error; SMS not sent
		});
	}

	//TODO: Handle recieved code.
	// Reference: https://firebase.google.com/docs/auth/web/phone-auth

	/* Other Events */

	// Handle mouseover events for floating action buttons
	document.getElementById("addNewCard").onmouseover = function(){document.getElementById("addNewCard").classList.add("pulse");}
	document.getElementById("addNewCard").onmouseout = function(){document.getElementById("addNewCard").classList.remove("pulse");}

}
