const databases = require('./config/databases.config');
const sqliteStorage = require('../');

let storage;

beforeAll(async() => {
  storage = new sqliteStorage({ databases });
  await storage.connect();
});

afterAll(async() => {
  storage.close();
});

describe('sqlite-storage', () => {
  it('should return the tables count as minimun as 1', async() => {
    const rows = await storage.executeQuery('SELECT count(*) as size FROM sqlite_master;');
    const [result] = rows;
    const hasTables = result.size >= 1;
    expect(hasTables).toBe(true);
  });
});