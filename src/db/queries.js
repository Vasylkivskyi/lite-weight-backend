// USERS
const createUser = () => {
  return `INSERT INTO
  users(first_name, last_name, email, password, created_date, modified_date)
  VALUES($1, $2, $3, $4, $5, $6)
  returning *`;
};

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
const saveTraining = () =>
  `INSERT INTO trainings (owner_id, CREATEd_date) VALUES($1, $2) RETURNING id`;

const createSet = () => {
  return `INSERT INTO 
  sets (exercise_name, reps, weight, created_date, owner_id, training_id)
  VALUES %L RETURNING *`;
};

const getLatestSets = () => `WITH tr AS 
(
    SELECT * FROM trainings WHERE owner_id = $1 GROUP BY created_date, id ORDER BY created_date DESC LIMIT $2 OFFSET $3
)
SELECT sets.id, sets.reps, sets.weight, sets.exercise_name, sets.training_id, sets.created_date,
(SELECT count(*) FROM trainings WHERE owner_id = $1) as amount
FROM sets INNER JOIN tr ON sets.training_id = tr.id ORDER BY tr.created_date desc;`;

const deleteAllUserSets = () => `DELETE FROM sets WHERE owner_id = $1`;

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
  deleteAllUserSets,
  saveTraining,
};
