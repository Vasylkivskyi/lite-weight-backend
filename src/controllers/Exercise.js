const { Pool } = require('pg');
const dotenv = require('dotenv');
const moment = require('moment');
const queries = require('../db/queries');
const express = require("express");
let router = express.Router();
const {
  hashPassword,
  comparePassword,
  isValidEmail,
  generateToken,
  verifyToken
} = require('../helpers/authHelpers');

dotenv.config();

const pool = new Pool({
  user: 'pavelvasylkivskiy',
  host: 'localhost',
  database: 'lite_weight',
  password: '',
  port: '5432',
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  let token = req.headers['x-access-token'];
  console.log(name)
  if (!name) {
    return res.status(400).send({ 'message': 'Name is missing...' });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(400).send({ 'message': 'Token has been expired' });
  }
  const { userId } = decoded;

  const values = [
    name,
    userId
  ]

  const { rows } = await pool.query(queries.getExerciseByName(), values);
  if (rows.length) {
    res.status(400).send({ 'message': 'Exercise already exist' });
  };

  const queryResult = await pool.query(queries.createExercise(), values);

  res.status(200).send({ queryResult: queryResult.rows[0] });
});

module.exports = router;
