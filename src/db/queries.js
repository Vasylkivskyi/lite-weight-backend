const createUser = () => {
  return `INSERT INTO
  users(first_name, last_name, email, password, created_date, modified_date)
  VALUES($1, $2, $3, $4, $5, $6)
  returning *`;
}

const getUserByEmail = () => `SELECT * FROM users WHERE email = $1`;

// UPDATE link
// SET description = 'Learn PostgreSQL fast and easy',
//  rel = 'follow'
// WHERE
//    ID = 1
// RETURNING id,
//    description,
//    rel;

const editUser = () => `UPDATE users
SET first_name = $1,
last_name = $2,
email = $3,
password = $4,
modified_date = $5
WHERE id = $6
RETURNING *`;

const deleteUser = () => `DELETE FROM users WHERE id = $1 RETURNING *`;

module.exports = {
  createUser,
  getUserByEmail,
  editUser,
  deleteUser,
}


