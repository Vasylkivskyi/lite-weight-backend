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
    process.env.SECRET, { expiresIn: '1d' }
  );
  return token;
}

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    return decoded;
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  hashPassword,
  comparePassword,
  isValidEmail,
  generateToken,
  verifyToken,
}
