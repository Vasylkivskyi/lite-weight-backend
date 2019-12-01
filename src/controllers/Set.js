const queries = require('../db/queries');
const express = require('express');
const router = express.Router();
const db = require('../../db');
const Auth = require('../middleware/Auth');
const moment = require('moment');
const format = require('pg-format');

router.post('/', Auth.verifyToken, async (req, res) => {
  // ATTENTION !!! Need to verify exercise name & num of reps on frontend
  // Expecting an array of data
  const userId = req.user.userId;
  const date = moment().format();

  try {
    const result = await db.query(queries.saveTraining(), [userId, date]);
    const trainingId = result.rows[0].id;
    const values = req.body.map((set) => {
      return [set.exercise_name, set.reps, set.weight, date, userId, trainingId];
    });

    await db.query(format(queries.createSet(), values));
    return res.status(200).send({ message: 'Дані збережено...' });
  } catch (error) {
    console.error(error);
    return res.status(400).send(error);
  }
});

router.get('/', Auth.verifyToken, async (req, res) => {
  try {
    const { userId } = req.user;
    let page = req.headers['page'];
    if (page < 1) {
      page = 1;
    }
    const limit = 3;
    const offset = page * limit;
    const { rows } = await db.query(queries.getLatestSets(), [userId, limit, offset]);
    if (!rows.length) {
      return res.status(400).send({ message: 'Ще немає жодних даних...' });
    }
    const ids = rows.map((row) => row.training_id);
    const distinctIds = [...new Set(ids)];
    const sortedTraining = distinctIds.map((id) => {
      const training = rows.filter((row) => id === row.training_id);
      return training;
    });
    return res.status(200).send(sortedTraining);
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
});

router.delete('/', Auth.verifyToken, async (req, res) => {
  const { userId } = req.user;
  try {
    await db.query(queries.deleteAllUserSets(), [userId]);
    return res.status(200).send({ message: 'Ваші результати були видадені...' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
