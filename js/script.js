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