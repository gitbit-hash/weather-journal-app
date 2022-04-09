/* Global Variables */
const apiKey = '4b70fea52db751e99e5ba3673250f589&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;

const getWeather = async (countryCode = '', zip = '') => {
	try {
		//Please note if countryCode parameter is not specified then the search works for USA as a default.
		const res = await fetch(
			`${baseURL}/weather?zip=${zip},${countryCode}&appid=${apiKey}`
		);

		//Transform into json
		const data = await res.json();

		console.log(data);
	} catch (error) {
		console.log(error);
	}
};
const weatherResponse = getWeather('us', 94040);
