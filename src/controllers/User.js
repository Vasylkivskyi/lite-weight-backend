const { Pool } = require('pg');
const dotenv = require('dotenv');
const moment = require('moment');
const queries = require('../db/queries');
const express = require("express");
let router = express.Router();

dotenv.config();

const pool = new Pool({
  user: 'pavelvasylkivskiy',
  host: 'localhost',
  database: 'lite_weight',
  password: '',
  port: '5432',
});

pool.on('connect', () => {
  console.log('connected to the db');
});

router.post('/', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName && !lastName && !email && !password) {
    return res.status(400).send({ 'message': 'Some value are missing...' });
  }
  const values = [firstName, lastName, email, password, moment(new Date()), moment(new Date())];
  console.log('query: ', queries.createUser());
  console.log('values: ', values);
  const result = await pool.query(queries.createUser(), values);
  console.log(result.rows);
  return res.status(200).send({ 'message': 'New user was saved...' });
});

module.exports = router;
