document.addEventListener("DOMContentLoaded", async function (event) {
	console.log("page loaded, calling readJSON function");

	// call function to load the last record in the json data
	await loadDummyDataOnCard();
});

const jsonFileURL = "./js/data.json"

// read the JSON data
async function readJSONData() {
	const res = await fetch(jsonFileURL);
	const data = await res.json();
	return data;
}

// load the last record in the cards on page load
const loadDummyDataOnCard = async () => {
	// read the json data
	const data = await readJSONData();
	console.log("data", data);

    // get the record with 'isDummy' =  true
    const lastRecord = await data.filter(item => item.isDummy == true)[0]
    console.log('lastRecord', lastRecord)
    document.querySelector('.card-number').textContent = lastRecord.cardNumber
    document.querySelector('.card-name').textContent = lastRecord.name
    document.querySelector('.exp-mm').textContent = lastRecord.expMM
    document.querySelector('.exp-yy').textContent = lastRecord.expYY
    document.querySelector('.cvv').textContent = lastRecord.cvv

};


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
async function updateJSONData(updatedData, jsonFileURL) {
	try {
		// Fetch the JSON file
		const response = await fetch(jsonFileURL);

		if (!response.ok) {
			throw new Error("Failed to fetch JSON data");
		}

		// Parse the JSON response
		const jsonData = await response.json();

		// Update the JSON data as needed
		// For example, add a new item to an array
		jsonData.push(updatedData);

		// Convert the updated data back to a JSON string
		const updatedJSON = JSON.stringify(jsonData);

		// Send a PUT request to update the JSON file on the server
		const updateResponse = await fetch(jsonFileURL, {
			method: "PUT",
			body: updatedJSON,
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!updateResponse.ok) {
			throw new Error("Failed to update JSON data");
		}

		console.log("JSON data updated successfully");
	} catch (error) {
		console.error(error);
	}
}