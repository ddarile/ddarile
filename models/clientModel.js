const { Pool } = require('pg');

// Создание пула подключений к PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: '071018',
  host: "localhost",
  port: 5432,
  database: "design_studio"
})


// Получение всех дизайнеров с данными аккаунта и уровнем квалификации
async function getAllDesigners() {
  const result = await pool.query(`
    SELECT 
      pa.id_account,
      pa.account_name,
      pa.account_path,
      ql.level_name,
      ql.level_percentage_indicator,
      d.designer_description
    FROM designer d
    JOIN personal_account pa ON d.id_account = pa.id_account
    JOIN qualification_level ql ON d.id_level = ql.id_level
  `)
  return result.rows
}

// Получение product_type по ID из сессии и соответствующей услуги
async function getSelectedServiceProduct(productId) {
  const result = await pool.query(`
    SELECT 
      pt.id_product_type,
      pt.product_type_name,
      pt.product_price,
      pt.completion_period,
      pt.product_description,
      s.service_name,
      s.service_description,
      s.service_price,
      s.service_path
    FROM product_type pt
    JOIN service s ON pt.id_service = s.id_service
    WHERE pt.id_product_type = $1
  `, [productId])

  return result.rows[0]
}

async function addProject ({
  id_project_status,
  id_designer,
  id_account,
  id_product_type,
  order_date
}){
  const query = `
    INSERT INTO project (
      id_project_status,
      id_account,
      id_designer,
      id_product_type,
      order_date
    )
    VALUES ($1, $2, $3, $4, $5)
  `
  const values = [
    id_project_status,
    id_account,
    id_designer,
    id_product_type,
    order_date
  ]

  await pool.query(query, values)
}


async function getClientProjects(clientId) {
  const result = await pool.query(`
    SELECT 
      p.id_project,
      p.id_project_status,
  TO_CHAR(p.order_date, 'DD.MM.YYYY HH24:MI') AS order_date_formatted,
  TO_CHAR(p.finish_date, 'DD.MM.YYYY HH24:MI') AS finish_date_formatted,
      d.account_name,
      s.service_name,
      pt.completion_period,
      pt.product_type_name,
      s.service_description || ' Подробности услуги: ' || COALESCE(pt.product_description, '') AS full_description,
      ROUND(
        ((s.service_price + pt.product_price) * q.level_percentage_indicator + (s.service_price + pt.product_price))::NUMERIC,
        2
      ) AS total_price,
      f.feedback_content,
      f.feedback_raiting
    FROM project p
    LEFT JOIN personal_account d ON p.id_designer = d.id_account
    LEFT JOIN designer des ON des.id_account = d.id_account
    LEFT JOIN qualification_level q ON des.id_level = q.id_level
    LEFT JOIN product_type pt ON p.id_product_type = pt.id_product_type
    LEFT JOIN service s ON pt.id_service = s.id_service
    LEFT JOIN feedback f ON p.id_project = f.id_project
    WHERE p.id_account = $1
  `, [clientId]);

  return result.rows;
}

async function insertReview(id_project, feedback_content, feedback_raiting) {
  const query = `
    INSERT INTO feedback (id_project, feedback_content, feedback_raiting)
    VALUES ($1, $2, $3)
  `
  await pool.query(query, [id_project, feedback_content, feedback_raiting])
}



module.exports = {
    getAllDesigners,
    getSelectedServiceProduct,
    addProject,
    getClientProjects,
    insertReview
};