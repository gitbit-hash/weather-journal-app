/* Global Variables */
const apiKey = '4b70fea52db751e99e5ba3673250f589&units=imperial';
const baseURL = 'https://api.openweathermap.org/data/2.5';
// Create a new date instance dynamically with JS
let d = new Date();
let newDate = `${d.getMonth()}.${d.getDate()}.${d.getFullYear()}`;

const getWeather = async (zip = '', baseURL = '', apiKey = '') => {
	try {
		//Please note if countryCode parameter is not specified then the search works for USA as a default.
		const res = await fetch(`${baseURL}/weather?zip=${zip},us&appid=${apiKey}`);

		//Transform into json
		const data = await res.json();

		return data;
	} catch (error) {
		console.log(error);
	}
};

const postData = async (url = '', data = {}) => {
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

const getPostData = () => {
	getWeather(94040, baseURL, apiKey).then((data) => {
		postData('http://localhost:3000/weather', {
			temperature: data.main.temp,
			date: newDate,
			userResponse: 'Your feelings',
		});
	});
};

getPostData();
