const path = require('path');

const databasePath = path.resolve(__dirname, '..', 'databases');

const databases = [
  {
    name: 'data',
    path: path.join(databasePath, 'test.db'),
  },
  {
    name: 'images',
    path: path.join(databasePath, 'images'),
    attach: true,
  }
];

module.exports = databases;