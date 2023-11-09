document.addEventListener("DOMContentLoaded", async function (event) {
	console.log("page loaded, calling readJSON function");

	// call function to load the last record in the json data
	await loadDummyDataOnCard();
});