const moment = require('moment');
const queries = require('../db/queries');
const express = require("express");
const router = express.Router();
const db = require('../../db');
const Auth = require('../middleware/Auth');
const {
  hashPassword,
  comparePassword,
  isValidEmail,
  generateToken,
} = require('../helpers/authHelpers');

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
    const { rows } = await db.query(queries.createUser(), values);
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
    const { rows } = await db.query(queries.getUserByEmail(), [email]);
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
    return res.status(400).send(error);
  }
});

router.post('/edit', Auth.verifyToken, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  const values = [
    firstName,
    lastName,
    email,
    hashedPassword,
    moment(new Date()),
    req.user.userId
  ];

  try {
    const { rows } = await db.query(queries.editUser(), values);
    res.status(200).send({ newUser: rows[0] });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/delete', Auth.verifyToken, async (req, res) => {
  try {
    await db.query(queries.deleteUser(), [req.user.userId]);
    res.status(200).send({ 'message': 'User was successfully deleted' });
  } catch (error) {
    return res.status(400).send(error);
  }
})

module.exports = router;
