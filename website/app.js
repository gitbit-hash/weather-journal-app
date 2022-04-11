/* Global Variables */
const apiKey = '4b70fea52db751e99e5ba3673250f589&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;

/**
 * Get Weather data from openweathermap api
 * @param {string} zip
 * @param {string} baseURL
 * @param {string} apiKey
 * @returns Promise
 */
const getWeatherData = async (zip, baseURL, apiKey) => {
	try {
		// fetch openweathermap response
		const res = await fetch(`${baseURL}/weather?zip=${zip},us&appid=${apiKey}`);

		if (res.status === 400) {
			throw new Error('Invalid zip code');
		}

		if (res.status === 404) {
			throw new Error('city not found');
		}
		//Transform into json
		const data = await res.json();

		return data;
	} catch (error) {
		console.log(error.message);
	}
};
/**
 * add an entry to the project endpoint
 * @param {string} url
 * @param {object} data
 * @returns Promise
 */
const postData = async (url, data) => {
	const response = await fetch(url, {
		method: 'POST',
		credentials: 'same-origin',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	try {
		const newData = await response.json();

		return newData;
	} catch (error) {
		console.log('error', error);
	}
};

/**
 *
 * @param {PointerEvent} e
 */
const callback = async (e) => {
	e.preventDefault();
	console.log(e);
	const zipInputValue = document.getElementById('zip').value;
	const feelingsInputValue = document.getElementById('feelings').value;

	try {
		const weatherData = await getWeatherData(zipInputValue, baseURL, apiKey);

		await postData('http://localhost:3000/all', {
			temperature: weatherData.main.temp,
			date: newDate,
			userResponse: feelingsInputValue,
		});

		await retrieveData();
	} catch (error) {
		console.log(error);
	}
};

document.getElementById('generate').addEventListener('click', callback);

const retrieveData = async () => {
	const request = await fetch('http://localhost:3000/all');
	try {
		// Transform into JSON
		const allData = await request.json();

		//UpdateUI
		updateUI(allData);
	} catch (error) {
		console.log('error', error);
		// appropriately handle the error
	}
};

/**
 * Dynamically Update UI
 * @param {object} allData
 */
const updateUI = (allData = {}) => {
	// Write updated data to DOM elements
	document.getElementById('temp').innerHTML =
		Math.round(allData.temperature) + 'degrees';
	document.getElementById('content').innerHTML = allData.userResponse;
	document.getElementById('date').innerHTML = allData.date;
};
