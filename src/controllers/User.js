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
      return res.status(400).send({ 'message': 'User not exists' });
    }

    if (!comparePassword(password, rows[0].password)) {
      return res.status(400).send({ 'message': 'You have entered an invalid username or password' });
    }
    if (!rows.length) {
      return res.status(400).send({ 'message': 'User with current email is not exists' })
    }
    const token = generateToken(rows[0].id);
    return res.status(200).send({ token })
  } catch (error) {
    return res.status(400).send(error)
  }
});

router.post('/edit', async (req, res) => {
  let token = req.headers['x-access-token'];
  const { firstName, lastName, email, password } = req.body;
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(400).send({ 'message': 'Token has been expired' });
  }
  const { userId } = decoded;
  const hashedPassword = hashPassword(password);
  const values = [
    firstName,
    lastName,
    email,
    hashedPassword,
    moment(new Date()),
    userId
  ];
  const { rows } = await pool.query(queries.editUser(), values);
  res.status(200).send({ newUser: rows[0] });
});

router.delete('/delete', async (req, res) => {
  let token = req.headers['x-access-token'];
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(400).send({ 'message': 'Token has been expired' });
  }
  const { userId } = decoded;
  await pool.query(queries.deleteUser(), [userId]);
  res.status(200).send({ 'message': 'User was successfully deleted' });
})

module.exports = router;
