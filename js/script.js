$(document).ready(async function (event) {
	console.log("page loaded, calling readJSON function");

	// call function to load the default record in the json data
	await loadDummyDataOnCard();
});

let isError = false;
const jsonFileURL = "./js/data.json";

// read the JSON data
async function readJSONData() {
	const res = await fetch(jsonFileURL);
	const data = await res.json();
	return data;
}

// load the default record in the cards on page load
const loadDummyDataOnCard = async () => {
	// read the json data
	const data = await readJSONData();
	//console.log("data", data);

	// get the record with 'isDummy' =  true
	const lastRecord = await data.filter((item) => item.isDummy == true)[0];
	//console.log("lastRecord", lastRecord);
	$(".card-number").html(lastRecord.cardNumber);
	$(".card-name").html(lastRecord.name);
	$(".exp-mm").html(lastRecord.expMM);
	$(".exp-yy").html(lastRecord.expYY);
	$(".cvv").html(lastRecord.cvv);
};

// function to inset data on card while user types
const updateCardName = async () => {
	$(".card-name").html(await $("#card-form-name").val());
};

// update card number with the format
const creditCardInput = document.getElementById("card-form-number");

creditCardInput.addEventListener("keyup", function (event) {
	const inputText = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
	const formattedText = formatCreditCardNumbers(inputText, 16);
	document.querySelector(".card-number").textContent = formattedText;
	event.target.value = formattedText;
});

// update card Expiry MM date
const cardExMM = document.getElementById("card-form-mm");
cardExMM.addEventListener("keyup", function (event) {
	const inputText = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
	const formattedText = formatCreditCardNumbers(inputText, 2);
	document.querySelector(".exp-mm").textContent = formattedText;
	event.target.value = formattedText;
});

// update card Expiry YY date
const cardExYY = document.getElementById("card-form-yy");
cardExYY.addEventListener("keyup", function (event) {
	const inputText = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
	const formattedText = formatCreditCardNumbers(inputText, 2);
	document.querySelector(".exp-yy").textContent = formattedText;
	event.target.value = formattedText;
});

// update card CVV
const cardCVV = document.getElementById("card-form-cvv");
cardCVV.addEventListener("keyup", function (event) {
	const inputText = event.target.value.replace(/\D/g, ""); // Remove non-numeric characters
	const formattedText = formatCreditCardNumbers(inputText, 3);
	document.querySelector(".cvv").textContent = formattedText;
	event.target.value = formattedText;
});

// submit form
//const cardForm = document.getElementById("card-form");
$("#card-form").on("submit", async function (event) {
	event.preventDefault();
	//console.log("submitted", event);
	validateForm();
	if (isError) return;
	// get the count of the json data
	let data = await readJSONData();
	//console.log("data count", data.length);

	// const response = await fetch(jsonFileURL);
	const sessionData = sessionStorage.getItem("ccddData");

	if (sessionData == undefined || sessionData == null || sessionData == "") {
		// create empty data in the sessionStorage
		sessionStorage.setItem("ccddData", null);

		//throw new Error("Failed to fetch JSON data");
	}
	if (sessionData != null && sessionData.length > 0) {
		data = JSON.parse(sessionData);
	}

	const formData = {
		id: data.length + 1,
		name: document.querySelector("#card-form-name").value,
		cardNumber: document.querySelector("#card-form-number").value,
		expMM: document.querySelector("#card-form-mm").value,
		expYY: document.querySelector("#card-form-yy").value,
		cvv: document.querySelector("#card-form-cvv").value,
		isDummy: false,
	};

	//console.log("formData", formData);

	// save the formData in data.json file / from settion storage
	const response = await updateJSONData(formData, data, jsonFileURL);
	//console.log("save response", response);

	// display the thank you page and hide the form n success
	toggleComplete(response);
});

// // function to display help
// const helpIcon = document.querySelector(".help-icon-wrap img");
// helpIcon.addEventListener("click", (event) => {
// 	console.log("show help");
// 	showHelp();
// });
// // function to display help
// const closeIcon = document.querySelector(".close-wrap span");
// closeIcon.addEventListener("click", (event) => {
// 	console.log("show help");
// 	hideHelp();
// });
// // show Help Box
// const showHelp = () => {
// 	const helpBox = document.querySelector(".help-box-wrap");
// 	helpBox.style.display = "flex";
// };
// // hide Help Box
// const hideHelp = () => {
// 	const helpBox = document.querySelector(".help-box-wrap");
// 	helpBox.style.display = "none";
// };

// validate form on submit
const validateForm = () => {
	isError = false;
	console.log("validating...");
	const inputBoxes = document.querySelectorAll("input");
	inputBoxes.forEach((box) => {
		console.log("box value", box.value);
		if (box.value == null || box.value == "") {
			console.log("error", box.value);
			isError = true;
		}
	});

	// display the error message
	const msgBox = document.querySelector(".msg");
	msgBox.innerHTML = "Ooops! All fields are required. Check and try again";
	if (isError) {
		addShakeClass(".submit-btn");
		showError();
	} else {
		// hideError();
	}
};

// function to close feedback
// const feedbackCloseIcon = document.querySelector(".feedback-close-wrap span");
// feedbackCloseIcon.addEventListener("click", (event) => {
// 	console.log("hide error");
// 	hideError();
// });
// display error box
const showError = () => {
	const toastLiveExample = document.getElementById("liveToast");
	const toastBootstrap =
		bootstrap.Toast.getOrCreateInstance(toastLiveExample);
	toastBootstrap.show();
	// const feedbackBox = document.querySelector(".feedback-box-wrap");
	// feedbackBox.style.display = "flex";
};

// display error box
// const hideError = () => {
// 	const feedbackBox = document.querySelector(".feedback-box-wrap");
// 	feedbackBox.style.display = "none";
// 	isError = false;
// };

// function to toggle the complete page
const toggleComplete = (isComplete) => {
	const formEl = document.querySelector("#card-form");
	const thankYouEl = document.querySelector(".complete-wrap");

	if (isComplete) {
		scaleCheckIcon();
		formEl.style.display = "none";
		thankYouEl.style.display = "flex";
	} else {
		formEl.style.display = "block";
		thankYouEl.style.display = "none";
	}
};

// show the form upon completion
const continueBtn = document.querySelector("#continue-btn");
continueBtn.addEventListener("click", (event) => {
	event.preventDefault();

	const showComplete = false;
	toggleComplete(showComplete);

	// reload page
	window.location.reload();
});

// function to format numbers only text inputs
function formatCreditCardNumbers(inputText, maxNum) {
	if (inputText.length > maxNum) {
		inputText = inputText.slice(0, maxNum);
	}

	let formattedText = "";
	for (let i = 0; i < inputText.length; i++) {
		if (i > 0 && i % 4 === 0) {
			formattedText += " ";
		}
		formattedText += inputText[i];
	}

	return formattedText;
}

// Function to update JSON data
async function updateJSONData(updatedData, oldData, jsonFileURL) {
	try {
		// Fetch the JSON file
		//const response = await fetch(jsonFileURL);
		const response = sessionStorage.getItem("ccddData");

		console.log("oldData...", oldData);
		console.log("updatedData...", updatedData);

		if (oldData.length > 0) {
			//let data = await readJSONData();
			// Parse the JSON response
			const jsonData = oldData;

			console.log("jsonData", jsonData);
			// // Update the JSON data as needed
			// // For example, add a new item to an array
			jsonData.push(updatedData);
			console.log("jsonData2", jsonData);

			// Convert the updated data back to a JSON string
			const updatedJSON = jsonData;

			console.log("updatedJSON", updatedJSON);

			//check if value is stored in session storage
			// if set, remove it and save the new file

			// save the data in session storage
			const sessionRes = sessionStorage.setItem(
				"ccddData",
				JSON.stringify(updatedJSON)
			);

			console.log("sessionRes", sessionRes);

			// get session storage
			const getSessionStorage = sessionStorage.getItem("ccddData");
			console.log("getSessionStorage", getSessionStorage);
			const jsonRes = JSON.parse(getSessionStorage);
			console.log("jsonRes", jsonRes);

			//verify that item was saved
			const verify = jsonRes.filter((item) => {
				return item.id == updatedData.id;
			});

			console.log("verify", verify);
			if (verify != null && verify.length > 0) return true;
			return false;
		}
	} catch (error) {
		console.error(error);
	}
}

// ANIMATIONS

// add or remove the shake class to / from button
const addShakeClass = (element) => {
	console.log("in addShakeClass", element);
	const el = $(element);
	console.log("shake el", el);
	el.addClass("shake");
	//remove the class after 1sec
	setTimeout(() => {
		el.removeClass("shake");
	}, 1000);
};

// bounce element/icon on hover

$(".soc-icon1").mouseenter(() => {
	$(this).addClass("bounce");
	console.log("mouseentered", $(this));
	$(".soc-icon1").addClass("bounce");
});
$(".soc-icon1").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".soc-icon1").removeClass("bounce");
});
$(".soc-icon2").mouseenter(() => {
	console.log("mouseentered", $(this));
	$(".soc-icon2").addClass("bounce");
});
$(".soc-icon2").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".soc-icon2").removeClass("bounce");
});
$(".soc-icon3").mouseenter(() => {
	console.log("mouseentered", $(this));
	$(".soc-icon3").addClass("bounce");
});
$(".soc-icon3").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".soc-icon3").removeClass("bounce");
});

// scale help icon
$(".help-icon").mouseenter(() => {
	console.log("mouseentered", $(this));
	$(".help-icon").addClass("scale-help");
});
$(".help-icon").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".help-icon").removeClass("scale-help");
});

//scale front card
$(".card-front").mouseenter(() => {
	console.log("mouseentered", $(this));
	$(".card-front").addClass("scale-front-card");
});
$(".card-front").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".card-front").removeClass("scale-front-card");
});

//scale back card
$(".card-back").mouseenter(() => {
	console.log("mouseentered", $(this));
	$(".card-back").addClass("scale-back-card");
});
$(".card-back").mouseleave(() => {
	console.log("mouseleave", $(this));
	$(".card-back").removeClass("scale-back-card");
});

//scale check icon
const scaleCheckIcon = () => {
	$(".complete-check").addClass("scale-complete-check");
	//remove class after 1sec
	setTimeout(() => {
		$(".complete-check").removeClass("scale-complete-check");
	}, 1000);
};
// $(".complete-check").ready(() => {
// 	console.log("mouseentered", $(this));
// 	$(".complete-check").addClass("scale-complete-check");
// });
// $(".complete-check").mouseleave(() => {
// 	console.log("mouseleave", $(this));
// 	$(".complete-check").removeClass("scale-complete-check");
// });
