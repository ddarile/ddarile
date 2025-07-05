// 📁 models/designTypeModel.js
const { Pool } = require('pg');

// Создание пула подключений к PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: '071018',
  host: "localhost",
  port: 5432,
  database: "design_studio"
})


// Поиск по email
async function findByEmail(email) {
  const result = await pool.query(
    'SELECT * FROM personal_account WHERE account_email = $1',
    [email]
  );
  return result.rows[0];
}
async function findById(id) {
  const result = await pool.query(
    'SELECT * FROM personal_account WHERE id_account = $1',
    [id]
  );
  return result.rows[0];
}
// Добавление нового аккаунта
async function createAccount({ id_role, account_name, account_email, hashed_password, account_path }) {
  const result = await pool.query(
    `INSERT INTO personal_account (id_role, account_name, account_email, account_password, account_path)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_account, id_role`,
    [id_role, account_name, account_email, hashed_password, account_path]
  );
  return result.rows[0];
}


async function updateAccount ({ id_account, account_name, account_email, new_password, account_path }) {
  if (new_password) {
    await pool.query(
      `UPDATE personal_account 
       SET account_name = $1, account_email = $2, account_password = $3, account_path = $4 
       WHERE id_account = $5`,
      [account_name, account_email, new_password, account_path, id_account]
    );
  } else {
    await pool.query(
      `UPDATE personal_account 
       SET account_name = $1, account_email = $2, account_path = $3 
       WHERE id_account = $4`,
      [account_name, account_email, account_path, id_account]
    );
  }
};

async function updateDesignerDescription(id_account, description) {
  await pool.query(
    `UPDATE designer SET designer_description = $1 WHERE id_account = $2`,
    [description, id_account]
  );
}

module.exports = {
  findByEmail,
  createAccount,
  findById,
  updateAccount,
  updateDesignerDescription
};