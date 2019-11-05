const moment = require('moment');
const queries = require('../db/queries');
const express = require('express');
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
    return res.status(400).send({ message: 'Не всі поля є заповнені...' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ message: 'Email введено не вірно...' });
  }

  const hashedPassword = hashPassword(password);
  const values = [firstName, lastName, email, hashedPassword, moment().format(), moment().format()];
  try {
    const { rows } = await db.query(queries.createUser(), values);
    const token = generateToken(rows[0].id);
    return res.status(201).send({ token });
  } catch (error) {
    if (error.routine === '_bt_check_unique') {
      return res.status(400).send({ message: 'Користувач з таким email уже зареєстрований...' });
    }
    return res.status(400).send(error);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!(!!email && !!password)) {
    return res.status(400).send({ message: 'Не всі поля є заповнені...' });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).send({ message: 'Email введено не вірно...' });
  }

  try {
    const { rows } = await db.query(queries.getUserByEmail(), [email]);
    if (!rows.length) {
      return res.status(400).send({ message: 'Такий користувач не зареєстрований...' });
    }

    if (!comparePassword(password, rows[0].password)) {
      return res.status(400).send({ message: 'Пароль або email введено не вірно...' });
    }
    if (!rows.length) {
      return res.status(400).send({ message: 'Користувач з таким email не існує...' });
    }
    const token = generateToken(rows[0].id);
    return res.status(200).send({ token });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.post('/edit', Auth.verifyToken, async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const hashedPassword = hashPassword(password);
  const values = [firstName, lastName, email, hashedPassword, moment().format(), req.user.userId];

  try {
    const { rows } = await db.query(queries.editUser(), values);
    return res.status(200).send({ newUser: rows[0] });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/delete', Auth.verifyToken, async (req, res) => {
  try {
    await db.query(queries.deleteUser(), [req.user.userId]);
    return res.status(200).send({ message: 'Користувач успішно видалений...' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
