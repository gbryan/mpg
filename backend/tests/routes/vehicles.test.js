const app = require('../../app');
const generateVehicle = require('../util').generateVehicle;
const supertest = require('supertest');
const db = require('../../models/index').sequelize;

const request = supertest(app);

describe('Vehicle API endpoints', () => {
  beforeEach(() => {
    return db.sync({force: true});
  });

  afterAll(() => {
    return db.close();
  });

  describe('/vehicles', () => {
    test('Returns empty list when no vehicles exist.', async () => {
      const resp = await request.get('/api/v1/vehicles');
      const expected = {"vehicles": []};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Returns all vehicles when fewer than per-page limit.', async () => {
      const vehicles = [
        await generateVehicle({model: 'Civic'}),
        await generateVehicle({model: 'Insight'}),
      ];

      const resp = await request.get('/api/v1/vehicles');
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.vehicles.length).toEqual(vehicles.length);
    });
    test('Respects the per-page limit.', async () => {
      const matchingVehicle = await generateVehicle({model: 'Civic'});

      // This one shouldn't be returned due to the per-page limit.
      await generateVehicle({model: 'Insight'});

      const resp = await request.get('/api/v1/vehicles?perPage=1');
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('Fetches 2nd page of results.', async () => {
      // This one shouldn't be returned since it is on page 1.
      await generateVehicle({model: 'Civic'});
      const matchingVehicle = await generateVehicle({model: 'Insight'});

      const resp = await request.get('/api/v1/vehicles?perPage=1&page=2');
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('Respects year filter.', async () => {
      await generateVehicle({year: 2020});
      const matchingVehicle = await generateVehicle({year: 2019});

      const resp = await request.get('/api/v1/vehicles?year=2019');
      expect(resp.statusCode).toEqual(200);
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('Respects model filter.', async () => {
      await generateVehicle({model: 'Civic'});
      const matchingVehicle = await generateVehicle({model: 'Insight'});

      const resp = await request.get('/api/v1/vehicles?model=Insight');
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('"Model" filter is case-insensitive.', async () => {
      await generateVehicle({model: 'Civic'});
      const matchingVehicle = await generateVehicle({model: 'Insight'});

      const resp = await request.get('/api/v1/vehicles?model=insight');
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('Respects make filter.', async () => {
      await generateVehicle({make: 'Honda'});
      const matchingVehicle = await generateVehicle({make: 'Toyota'});

      const resp = await request.get('/api/v1/vehicles?make=Toyota');
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
    test('Respects combined filters.', async () => {
      await generateVehicle({make: 'Honda', model: 'Corolla', year: 2019});
      await generateVehicle({make: 'Toyota', model: 'Corolla', year: 2020});
      const matchingVehicle = await generateVehicle({
        make: 'Toyota',
        model: 'Corolla',
        year: 2019,
      });

      const resp = await request.get('/api/v1/vehicles?make=Toyota&model=Corolla&year=2019');
      expect(resp.body.vehicles.length).toEqual(1);

      const actualVehicle = resp.body.vehicles[0];
      Object.keys(matchingVehicle.dataValues).forEach((key) => {
        expect(actualVehicle[key]).toEqual(matchingVehicle.get(key));
      });
    });
  });

  describe('/vehicles/makes', () => {
    test('Returns an empty array when there are 0 records in the DB.', async () => {
      const resp = await request.get('/api/v1/vehicles/makes');
      const expected = {"makes": []};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Returns a list of all unique makes.', async () => {
      await generateVehicle({make: 'Honda'});
      await generateVehicle({make: 'Toyota'});
      await generateVehicle({make: 'Toyota'});

      const resp = await request.get('/api/v1/vehicles/makes');
      const expected = {"makes": ["Honda", "Toyota"]};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Results are sorted alphabetically.', async () => {
      await generateVehicle({make: 'Toyota'});
      await generateVehicle({make: 'Honda'});

      const resp = await request.get('/api/v1/vehicles/makes');
      const expected = {"makes": ["Honda", "Toyota"]};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
  });
  describe('/vehicles/models', () => {
    test('Returns an empty array when there are 0 records in the DB.', async () => {
      const resp = await request.get('/api/v1/vehicles/models');
      const expected = {"models": []};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Returns a list of all unique models.', async () => {
      await generateVehicle({model: 'Civic'});
      await generateVehicle({model: 'Highlander'});
      await generateVehicle({model: 'Highlander'});

      const resp = await request.get('/api/v1/vehicles/models');
      const expected = {"models": ["Civic", "Highlander"]};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Results are sorted alphabetically.', async () => {
      await generateVehicle({model: 'Highlander'});
      await generateVehicle({model: 'Civic'});

      const resp = await request.get('/api/v1/vehicles/models');
      const expected = {"models": ["Civic", "Highlander"]};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Filters by make.', async () => {
      await generateVehicle({model: 'Highlander', make: 'Toyota'});
      await generateVehicle({model: 'Civic', make: 'Honda'});

      const resp = await request.get('/api/v1/vehicles/models?make=Honda');
      const expected = {"models": ["Civic"]};
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
  });
});
