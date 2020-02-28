import humps from 'humps';

let BASE_URL = '/api/v1';

if (process.env.NODE_ENV !== 'production') {
  BASE_URL = 'http://127.0.0.1:4000/api/v1';
}

const respKeyMap = {
  combMpgFuel1: 'mpg',
  fuelType1: 'fuelType',
};

export async function getMatchingVehicles(filters) {
  const queryString = ['year', 'make', 'model'].map(key => {
    return filters[key].value ? `${key}=${filters[key].value}` : null;
  }).filter(val => {
    return val !== null;
  }).join('&');
  const response = await fetch(`${BASE_URL}/vehicles?${queryString}`);
  const json = await response.json();

  //TODO: error handling
  return json.vehicles.map(v => {
    return humps.camelizeKeys(v);
  })
    .map(v => {
      const formattedVehicle = Object.assign({}, v);

      Object.keys(respKeyMap).forEach(origKey => {
        const newKey = respKeyMap[origKey];
        formattedVehicle[newKey] = formattedVehicle[origKey];
        delete formattedVehicle[origKey];
      });

      return formattedVehicle;
    });
}

export async function getMakes(year) {
  //TODO: error handling
  const response = await fetch(`${BASE_URL}/vehicles/makes?year=${year}`);
  const json = await response.json();

  return json.makes;
}

export async function getModels(year, make) {
  //TODO: error handling
  const response = await fetch(`${BASE_URL}/vehicles/models?year=${year}&make=${make}`);
  const json = await response.json();

  return json.models;
}

export function getYears() {
  const startYear = 1985;
  const numYears = (new Date().getFullYear() - startYear) + 1;

  return [...Array(numYears).keys()].map((_, i) => i + startYear).reverse();
}
