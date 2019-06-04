const sqlite = require('sqlite3');
const assign = require('lodash/assign');

class SQLiteNodeAdapter {
  constructor(opts = {}) {
    assign(this, opts);
  }

  isConnected() {
    return this.connection && !!this.connection.open;
  }

  connect() {
    const databasePath = this.path;
    return new Promise((resolve, reject) => {
      const onConnectionCallback = err => (err ? reject(err) : resolve());
      this.connection = new sqlite.Database(databasePath, onConnectionCallback);
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      const onCloseConnectionCallback = err => (err ? reject(err) : resolve());
      this.connection.close(onCloseConnectionCallback);
    });
  }

  attach(database) {
    const { path, name } = database;
    const query = `ATTACH DATABASE '${path}' AS ${name};`;
    return this.executeQuery(query);
  }

  detach(database) {
    const { name } = database;
    const query = `DETACH DATABASE ${name};`;
    return this.executeQuery(query);
  }

  executeQuery(query) {
    const { connection } = this;
    return new Promise((resolve, reject) => {
      const onQueryResponse = (err, rows) => (err ? reject(err) : resolve(rows));
      const isSelectStatement = /^\s{0,}select/i.test(query);
      return connection[isSelectStatement ? 'all' : 'run'](query, onQueryResponse);
    });
  }
}

module.exports = SQLiteNodeAdapter;
