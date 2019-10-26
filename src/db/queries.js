const createUser = () => {
  return `INSERT INTO
  users(first_name, last_name, email, password, created_date, modified_date)
  VALUES($1, $2, $3, $4, $5, $6)
  returning *`;
}

const getUserByEmail = () => `SELECT * FROM users WHERE email = $1`;

module.exports = {
  createUser,
  getUserByEmail,
}


