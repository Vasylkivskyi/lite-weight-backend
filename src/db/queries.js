// USERS
const createUser = () => {
  return `INSERT INTO
  users(first_name, last_name, email, password, created_date, modified_date)
  VALUES($1, $2, $3, $4, $5, $6)
  returning *`;
}

const getUserByEmail = () => `SELECT * FROM users WHERE email = $1`;

const editUser = () => `UPDATE users
SET first_name = $1,
last_name = $2,
email = $3,
password = $4,
modified_date = $5
WHERE id = $6
RETURNING *`;

const deleteUser = () => `DELETE FROM users WHERE id = $1 RETURNING *`;


// EXERCISES
const createExercise = () => `INSERT INTO
exercises(name, owner_id)
VALUES($1, $2) returning *`;

const getExerciseByName = () => `SELECT * FROM exercises WHERE name = $1
AND owner_id = $2`;

const getAllExercises = () => `SELECT * FROM exercises WHERE owner_id = $1`;

const editExercise = () => `UPDATE exercises
SET name = $1
WHERE id = $2 AND owner_id = $3
RETURNING *`;

const deleteExercise = () => `DELETE FROM exercises WHERE id = $1 AND owner_id = $2 RETURNING *`;


// SETS
const createSet = () => `INSERT INTO
sets(exercise_name, reps, weight, owner_id, created_date)
VALUES %L
RETURNING *`;

const getLatestSets = () => `SELECT * FROM sets
WHERE owner_id = $1
ORDER BY created_date DESC
LIMIT 100`;

module.exports = {
  createUser,
  getUserByEmail,
  editUser,
  deleteUser,
  createExercise,
  getAllExercises,
  getExerciseByName,
  editExercise,
  deleteExercise,
  createSet,
  getLatestSets,
}


