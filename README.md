# SQLite Storage
SQLite connection provider for multi javascript environments

# Installation
```bash
npm install sqlite-storage --save
```

# Usage
```javascript
const sqliteStorage = require('sqlite-storage');

const databases = [
  {
    name: "data",
    path: "/path/to/databases/data.db"
  },
  {
    name: "images",
    path: "/path/to/databases/images.db",
    attach: true
  }
];

const connection = new sqliteStorage({
  databases
});

connection.connect().then(() => {
  connection.executeQuery(`SELECT 1 as data FROM test;`).then((rows) => {
    console.log(rows);
    connection.close();
  });
});
```