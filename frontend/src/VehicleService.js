//TODO: remove
const pause = () => new Promise(resolve => setTimeout(resolve, 200));

export async function getMatchingVehicles(filters) {
    await pause();

    const allVehicles = [
        {
            id: 1,
            year: 2020,
            make: 'Toyota',
            model: 'Corolla Hybrid',
            mpg: 53,
            fuelType: 'Regular Gasoline',
            kwh100m: null
        },
        {
            id: 2,
            year: 2020,
            make: 'Toyota',
            model: 'Corolla Hatchback',
            mpg: 35,
            fuelType: 'Regular Gasoline',
            kwh100m: null
        },
        {
            id: 3,
            year: 2020,
            make: 'Tesla',
            model: 'Model 3 Long Range',
            mpg: 130,
            fuelType: 'Electricity',
            kwh100m: 24.6923
        }
    ];

    const response = {
        count: 2,
        pageNum: 1,
        vehicles: allVehicles.filter((vehicle) => {
            for (let key in filters) {
                if (!filters.hasOwnProperty(key)) {
                    continue;
                }
                if (vehicle[key] !== filters[key].value) {
                    return false;
                }
            }

            return true;
        })
    };
    return Promise.resolve(response.vehicles);
}
