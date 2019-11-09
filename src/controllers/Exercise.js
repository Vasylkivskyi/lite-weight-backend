const queries = require('../db/queries');
const express = require('express');
const router = express.Router();
const db = require('../../db');
const Auth = require('../middleware/Auth');

router.post('/', Auth.verifyToken, async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).send({ message: "Ім'я відсутнє..." });
  }

  const values = [name, req.user.userId];

  try {
    const { rows } = await db.query(queries.getExerciseByName(), values);
    if (rows.length) {
      return res.status(400).send({ message: 'Така вправа уже існує...' });
    }
    const queryResult = await db.query(queries.createExercise(), values);
    return res.status(200).send({ queryResult: queryResult.rows[0] });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.get('/', Auth.verifyToken, async (req, res) => {
  try {
    const { rows } = await db.query(queries.getAllExercises(), [req.user.userId]);
    if (!rows.length) {
      return res.status(400).send({ message: 'Ще немає жодних даних...' });
    }
    return res.status(200).send({ rows });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.put('/:id', Auth.verifyToken, async (req, res) => {
  values = [req.body.name, req.params.id, req.user.userId];
  try {
    const { rows } = await db.query(queries.editExercise(), values);
    return res.send({ rows });
  } catch (error) {
    return res.status(400).send(error);
  }
});

router.delete('/:id', Auth.verifyToken, async (req, res) => {
  try {
    await db.query(queries.deleteExercise(), [req.params.id, req.user.userId]);

    res.status(200).send({ message: 'Вправа була успішно видалена...' });
  } catch (error) {
    return res.status(400).send(error);
  }
});

module.exports = router;
