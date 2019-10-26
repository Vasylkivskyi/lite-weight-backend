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
  generateToken
} = require('../helpers/authHelpers');

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

  if (!(!!firstName && !!lastName && !!email && !!password)) {
    return res.status(400).send({ 'message': 'Some value are missing...' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter valid email' })
  }

  const hashedPassword = hashPassword(password);
  const values = [
    firstName,
    lastName,
    email,
    hashedPassword,
    moment(new Date()),
    moment(new Date())
  ];

  try {
    const { rows } = await pool.query(queries.createUser(), values);
    const token = generateToken(rows[0].id);
    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ 'message': 'User with that EMAIL already exist' })
    }
    return res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!(!!email && !!password)) {
    return res.status(400).send({ 'message': 'Some value are missing...' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ 'message': 'Please enter valid email' })
  }

  try {
    const { rows } = await pool.query(queries.getUserByEmail(), [email]);
    if (!rows.length) {
      return res.status(400).send({ 'message': 'User with current email is not exists' })
    }
    const token = generateToken(rows[0].id);
    return res.status(200).send({ token })
  } catch (error) {
    return res.status(400).send(error)
  }

})

module.exports = router;
