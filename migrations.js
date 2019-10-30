const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: 'pavelvasylkivskiy', //'Pavlo2',
  host: 'localhost',
  database: 'lite_weight',
  password: '',
  port: '5432',
});

pool.on('connect', () => {
  console.log('connected to the db');
});

const createUsersTable = () => {
  const queryText =
    `CREATE TABLE IF NOT EXISTS
      users(
        id SERIAL NOT NULL PRIMARY KEY,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password VARCHAR(128) NOT NULL,
        is_verified BOOLEAN DEFAULT false,
        created_date TIMESTAMP,
        modified_date TIMESTAMP
      )`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropUsersTable = () => {
  const queryText = 'DROP TABLE IF EXISTS users';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createExercisesTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  exercises(
    id SERIAL NOT NULL PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
  )`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropExercisesTable = () => {
  const queryText = 'DROP TABLE IF EXISTS exercises';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createSetsTable = () => {
  const queryText = `CREATE TABLE IF NOT EXISTS
  sets(
    id SERIAL NOT NULL PRIMARY KEY,
    exercise_name VARCHAR(128) NOT NULL,
    reps SMALLINT NOT NULL,
    weight SMALLINT,
    created_date TIMESTAMP,
    owner_id INTEGER NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users (id) ON DELETE CASCADE
  )`;
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const dropSetsTable = () => {
  const queryText = 'DROP TABLE IF EXISTS sets';
  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.log(err);
      pool.end();
    });
}

const createAllTables = () => {
  createUsersTable();
  createExercisesTable();
  createSetsTable();
}

const dropAllTables = () => {
  dropUsersTable();
  dropExercisesTable();
  dropSetsTable();
}

pool.on('remove', () => {
  console.log('client removed');
  process.exit(0);
});

module.exports = {
  createUsersTable,
  createAllTables,
  createExercisesTable,
  createSetsTable,
  dropUsersTable,
  dropAllTables,
  dropExercisesTable,
  dropSetsTable,
};

require('make-runnable');
