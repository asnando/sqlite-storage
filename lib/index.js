const promisifiedQueue = require('./utils/promisifiedQueue');
const Keychain = require('./keychain');
const constants = require('./constants');

const {
  DEFAULT_ENV_PLATFORM,
  DEFAULT_DATABASE_NAME,
  DEFAULT_DATABASE_EXTENSION,
} = constants;

const getAdapter = platform => require(`../adapters/${platform}`);

const resolvePlatform = () => process.env.PLATFORM || DEFAULT_ENV_PLATFORM;

const resolveSQLiteStorage = () => {
  switch (resolvePlatform()) {
    case 'react-native':
      return getAdapter('react-native');
    case 'cordova':
      return getAdapter('cordova');
    case 'node':
    default:
      return getAdapter('node');
  }
};

const Adapter = resolveSQLiteStorage();

class SQLiteStorage {
  /**
   *
   * @param {array} opts.databases
   * @param {object} opts.database
   */
  constructor(opts = {}) {
    this.keychain = new Keychain();
    const databases = opts.databases || [opts.database];
    this._createDatabasesFromList(databases);
  }

  _createDatabasesFromList(databases = []) {
    this.databases = databases.map((database, index) => (
      this._createDatabaseInstance(index, database)
    ));
  }

  /**
   *
   * @param {string} database.name
   * @param {string} database.path
   * @param {string} database.key
   *
   */
  _createDatabaseInstance(databaseIndex, database = {}) {
    if (!database.path) {
      throw new Error('Undefined database path');
    }
    const resolvedDatabaseConfig = {
      name: database.name || DEFAULT_DATABASE_NAME,
      path: database.path.replace(/(?<=\/)(\w+)$/, `$1${DEFAULT_DATABASE_EXTENSION}`),
      attached: !!database.attach,
      databaseIndex,
    };
    this.keychain.saveKey(databaseIndex, database.key);
    return new Adapter(resolvedDatabaseConfig);
  }

  _getRootDatabase() {
    return this.databases[0];
  }

  connect() {
    const { databases } = this;
    const rootDatabase = this._getRootDatabase();
    const tasks = databases.map(database => (database.attached
      ? rootDatabase.attach.bind(rootDatabase, database)
      : database.connect.bind(database)));
    return promisifiedQueue(tasks);
  }

  close() {
    const { databases } = this;
    const rootDatabase = this._getRootDatabase();
    // Databases need to be manually reversed or it will change the
    // databases order into the class instance if we use
    // array "reverse" method.
    const orderedDatabases = [];
    for (let index = databases.length - 1; index >= 0; index -= 1) {
      orderedDatabases.push(databases[index]);
    }
    const tasks = orderedDatabases.map(database => (database.attached
      ? rootDatabase.detach.bind(rootDatabase, database)
      : database.close.bind(database)));
    return promisifiedQueue(tasks);
  }

  executeQuery(query) {
    return this._getRootDatabase().executeQuery(query);
  }
}

module.exports = SQLiteStorage;
