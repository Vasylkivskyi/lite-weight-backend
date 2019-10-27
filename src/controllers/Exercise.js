const queries = require('../db/queries');
const express = require("express");
const router = express.Router();
const db = require('../../db');
const Auth = require('../middleware/Auth');

router.post('/', Auth.verifyToken, async (req, res) => {
  const { name } = req.body;
  console.log(name)
  if (!name) {
    return res.status(400).send({ 'message': 'Name is missing...' });
  }

  const values = [
    name,
    req.user.userId
  ];

  const { rows } = await db.query(queries.getExerciseByName(), values);
  if (rows.length) {
    return res.status(400).send({ 'message': 'Exercise already exist' });
  };

  const queryResult = await db.query(queries.createExercise(), values);

  return res.status(200).send({ queryResult: queryResult.rows[0] });
});

router.get('/', Auth.verifyToken, async (req, res) => {
  const { rows } = await db.query(queries.getAllExercises(), [req.user.userId]);
  if (!rows.length) {
    return res.status(400).send({ 'message': 'Where is no exercises yet...' });
  }
  return res.status(200).send({ rows });
})

module.exports = router;
