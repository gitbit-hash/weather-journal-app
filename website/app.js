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

let errorMessage = '';

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
		errorMessage = error.message;
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

const zipInput = document.getElementById('zip');

const errorElement = document.createElement('h3');

/**
 *
 * @param {PointerEvent} e
 */
const callback = async (e) => {
	e.preventDefault();

	const feelingsInputValue = document.getElementById('feelings').value;

	const weatherData = await getWeatherData(zipInput.value, baseURL, apiKey);

	try {
		// If errorMessage is not empty, add error state
		if (errorMessage) {
			errorElement.innerHTML = errorMessage;
			zipInput.classList.add('error');
			zipInput.insertAdjacentElement('afterend', errorElement);
		} else {
			await postData('http://localhost:3000/all', {
				temperature: weatherData.main.temp,
				date: newDate,
				userResponse: feelingsInputValue,
			});

			await retrieveData();
		}
	} catch (error) {
		console.log(error);
	}
};

document.getElementById('generate').addEventListener('click', callback);

// Remove error states when zip input changes
zipInput.addEventListener('keyup', () => {
	errorMessage = '';
	zipInput.classList.remove('error');
	errorElement.innerText = '';
});

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
