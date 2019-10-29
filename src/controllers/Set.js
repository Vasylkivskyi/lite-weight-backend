const queries = require('../db/queries');
const express = require("express");
const router = express.Router();
const db = require('../../db');
const Auth = require('../middleware/Auth');
const moment = require('moment');

router.post('/', Auth.verifyToken, async (req, res) => {
  // ATTENTION !!! Need to verify exercise name & num of reps on frontend
  // Expecting an array of data
  const inserts = req.body.map((set) => {
    return [
      set.exercise_name,
      set.reps,
      set.weight,
      req.user.userId,
      moment(new Date()),
    ];
  });

  try {
    inserts.forEach(async (values) => {
      await db.query(queries.createSet(), values);
    });
    return res.status(200).send({ 'message': 'Your workout is save...' });
  } catch (error) {
    return res.status(400).send(error);
  }
})

module.exports = router;