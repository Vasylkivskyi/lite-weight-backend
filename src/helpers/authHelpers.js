const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const hashPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

const comparePassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
}

const isValidEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
}

const generateToken = (id) => {
  const token = jwt.sign({
    userId: id
  },
    process.env.SECRET, { expiresIn: '7d' }
  );
  return token;
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidEmail,
  generateToken,
}
