const express = require('express');
const router = express.Router();
const Auth = require('../middleware/Auth');

router.get('/', Auth.verifyToken, async (req, res) => {
  return res.json({ msg: 'pong' });
});

module.exports = router;
