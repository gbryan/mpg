const FUEL_TYPES = {
  REGULAR_GAS: 'Regular Gasoline',
  MIDGRADE_GAS: 'Midgrade Gasoline',
  PREMIUM_GAS: 'Premium Gasoline',
  E85: 'E85',
  DIESEL: 'Diesel',
  ELECTRICITY: 'Electricity',
};
Object.freeze(FUEL_TYPES);

const CHART_VIEW = {
  FUEL_COST: 'fuelCost',
  EMISSIONS: 'emissions',
};
Object.freeze(CHART_VIEW);

export {
  FUEL_TYPES,
  CHART_VIEW,
};
