
export async function getCountriesStartingWith(srch: string) {
	let response = await fetch("https://api.first.org/data/v1/countries?limit=1000");
	let data = await response.json();
	let countries = Object.values(data.data);
	return countries.filter((country: any) => {
		return srch ? country.country.toLowerCase().startsWith(srch.toLowerCase()) : true;
	});
}