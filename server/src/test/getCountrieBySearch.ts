
import axios from 'axios';

export async function getCountriesStartingWith(srch: string) {
  const response = await axios.get("https://api.first.org/data/v1/countries?limit=1000");
  const countries = Object.values(response.data.data);
  return countries.filter((country: any) => {
    return srch ? country.country.toLowerCase().startsWith(srch.toLowerCase()) : true;
  });
}