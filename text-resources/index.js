/* Internal Logic Script */

/* Global variables */
var floatingActionButtonElements;
var floatingActionButtonInstances;
var tooltipElements;
var tooltipInstances;
var modalElements;
var modalInstances;
var formSelectElements;
var formSelectInstances;

var otpFlag = false;
var ctpFlag = false;
var ctnFlag = true;
var homeFlag = false;

var user;
var selectedCountryCode;
var countryPhoneCodes;

/* Global Functions */

// Asynchronous HTTP GET Request Function
function httpGetAsync(theUrl, callback){
	var xmlHttp = new XMLHttpRequest();
	xmlHttp.onreadystatechange = function(){ 
		if(xmlHttp.readyState == 4 && xmlHttp.status == 200)
			callback(xmlHttp.responseText);
	}
	xmlHttp.open("GET", theUrl, true);
	xmlHttp.send(null);
}

// Handle page onload events
window.onload = function(){

	/* Essential Onload Events */

	// Register Service Worker

	if ("serviceWorker" in navigator){navigator.serviceWorker.register("sw.js");}

	// Get country data (block sign in modal while data loads)
	blockSignInModal();
	document.getElementById("signIn").innerHTML = "Please wait...";
	httpGetAsync("text-resources/country-code-to-phone-code.json", ctp);
	httpGetAsync("text-resources/country-code-to-country-name.json", ctn);

	// Populate country list
	function ctp(data){
		// Unblock sign in modal
		if(ctn){
			unblockSignInModal();
			document.getElementById("signIn").innerHTML = "Send OTP";
		}
		// Convert data to JSON Object
		data = JSON.parse(data);
		countryPhoneCodes = data;
		ctpFlag = true;
	}

	function ctn(data){
		// Unblock sign in modal
		if(ctp){
			unblockSignInModal();
			document.getElementById("signIn").innerHTML = "Send OTP";
		}
		// Convert data to JSON Object
		data = JSON.parse(data);
		for(var cc in data){
			// Handle absurd/home countries
			switch(cc){
				case 'BV': cc = 'SZ'; break;
				case 'BQ': cc = 'SZ'; break;
				case 'RE': cc = 'SZ'; break;
				case 'GP': cc = 'SZ'; break;
				case 'GF': cc = 'SZ'; break;
				case 'HM': cc = 'SZ'; break;
				case 'SJ': cc = 'SZ'; break;
				case 'PM': cc = 'SZ'; break;
				case 'IO': cc = 'SZ'; break;
				case 'XK': cc = 'SZ'; break;
				case 'UM': cc = 'SZ'; break;
				case 'IN': document.getElementById("countries").innerHTML += '<option value="' + cc + '" data-icon="https://www.countryflags.io/' + cc + '/flat/32.png" selected>' + data[cc] + '</option>';
					   homeFlag = true;
					   break;
				default: break;
			}
			if(!homeFlag)document.getElementById("countries").innerHTML += '<option value="' + cc + '" data-icon="https://www.countryflags.io/' + cc + '/flat/32.png">' + data[cc] + '</option>';
			else homeFlag = false;
		}
		initializeFormSelectElements();
		ctnFlag = true;
	}

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

	// Initialize form selects after the country list is populated
	function initializeFormSelectElements(){
		formSelectElements = document.querySelectorAll('select');
		formSelectInstances = M.FormSelect.init(formSelectElements);
	}

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

	// Send SMS for verification and then verify the OTP

	document.getElementById("signIn").onclick= function(){

		if(otpFlag){
			otpFlag = false;
			blockSignInModal();
			document.getElementById("signIn").innerHTML = "Verifying OTP...";
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
			document.getElementById("signIn").innerHTML = "Sending OTP...";
			console.log("%cSending SMS to " + getPhoneCodeFromCountryCode(selectedCountryCode) + document.getElementById("phoneNumber").value, "background-color:#222222; color:#FFD700;");
			firebase.auth().signInWithPhoneNumber(getPhoneCodeFromCountryCode(selectedCountryCode) + document.getElementById("phoneNumber").value, window.recaptchaVerifier).then(function(confirmationResult){
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
		console.log("%cSuccessfully signed in!", "background-color:#222222; color:#BADA55;");
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

	// Method to return country phone code string

	function getPhoneCodeFromCountryCode(countryCode){
		if(ctpFlag && ctnFlag){
			if(countryPhoneCodes[countryCode].charAt(0) != '+') return '+' + countryPhoneCodes[countryCode];
			else return countryPhoneCodes[countryCode];
		}
		else return null;
	}

	/* Other Events */

	// Handle mouseover events for floating action buttons
	document.getElementById("addNewCard").onmouseover = function(){document.getElementById("addNewCard").classList.add("pulse");}
	document.getElementById("addNewCard").onmouseout = function(){document.getElementById("addNewCard").classList.remove("pulse");}

	// Handle change event for country list
	document.getElementById("countries").onchange = function(){selectedCountryCode = document.getElementById("countries").value;}

}
