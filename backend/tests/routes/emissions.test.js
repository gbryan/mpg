const app = require('../../app');
const supertest = require('supertest');
const {generateZipCode, generateGridSubregion} = require('../util');
const db = require('../../models/index').sequelize;

const request = supertest(app);

describe('Emissions API endpoints', () => {
  beforeEach(() => {
    return db.sync({force: true});
  });

  afterAll(() => {
    return db.close();
  });

  describe('/emissions', () => {
    test('Returns 400 when no zip_code supplied.', async () => {
      const resp = await request.get('/api/v1/emissions');
      const expected = {"error": "You must specify a zip_code."};
      expect(resp.statusCode).toEqual(400);
      expect(resp.body).toEqual(expected);
    });
    test('Returns object with empty values when no matching zip_code.', async () => {
      const resp = await request.get('/api/v1/emissions?zip_code=00000');
      const expected = {
        "avgCo2eLbsMwh": null,
        "gridSubregions": [],
      };
      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Average reflects single value when only a single matching grid subregion.', async () => {
      const zipVal = '71667';
      const zipCode = await generateZipCode(zipVal);
      const gridSubregion = await generateGridSubregion();
      await zipCode.addGridSubregion(gridSubregion);

      const resp = await request.get(`/api/v1/emissions?zip_code=${zipVal}`);
      const expected = {
        "avgCo2eLbsMwh": gridSubregion.co2e_lb_mwh,
        "gridSubregions": [gridSubregion.dataValues],
      };

      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
    test('Averages multiple grid subregions.', async () => {
      const zipVal = '71667';
      const zipCode = await generateZipCode(zipVal);
      const gridSubregions = [
        await generateGridSubregion({co2e_lb_mwh: 1000, name: '1'}),
        await generateGridSubregion({co2e_lb_mwh: 2000, name: '2'}),
      ];
      await zipCode.addGridSubregions(gridSubregions);

      const resp = await request.get(`/api/v1/emissions?zip_code=${zipVal}`);
      const expected = {
        "avgCo2eLbsMwh": 1500,
        "gridSubregions": gridSubregions.map(s => s.dataValues),
      };

      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(expected);
    });
  });
});
