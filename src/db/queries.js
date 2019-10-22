const createUser = () => {
  return `INSERT INTO
  users(email, password, created_date, updated_date)
  VALUES($1, $2, $3, $4)
  returning *`;
}

module.exports = {
  createUser,
}


