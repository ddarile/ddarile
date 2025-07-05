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




async function getAllDesignTypes() {
  const result = await pool.query(`
    SELECT id_design_type, design_type_name FROM design_type
  `);
  return result.rows; // массив всех типов дизайна
}

async function addDesignType(designTypeName) {
  const query = 'INSERT INTO design_type (design_type_name) VALUES ($1)';
  try {
    await pool.query(query, [designTypeName]);
  } catch (err) {
    console.error('Ошибка при вставке в design_type:', err);
    throw err;
  }
}


async function deleteDesignType(id) {
  const query = 'DELETE FROM design_type WHERE id_design_type = $1';
  try {
    await pool.query(query, [id]);
  } catch (err) {
    console.error('Ошибка при удалении из design_type:', err);
    throw err;
  }
}

async function updateDesignType(id, name) {
  const query = 'UPDATE design_type SET design_type_name = $1 WHERE id_design_type = $2';
  try {
    await pool.query(query, [name, id]);
  } catch (err) {
    console.error('Ошибка при обновлении design_type:', err);
    throw err;
  }
}



async function getDesignerPortfolio(id_designer) {
  const result = await pool.query(`
    SELECT 
      p.id_portfolio,
      p.id_design_type,
      p.id_designer,
      p.name_portfolio,
      p.portfolio_description,
      p.portfilio_cover,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id_work', a.id_work,
            'work_path', a.work_path
          )
        ) FILTER (WHERE a.id_work IS NOT NULL), 
        '[]'
      ) AS works
    FROM portfolio p
    LEFT JOIN art_work a ON a.id_portfolio = p.id_portfolio
    WHERE p.id_designer = $1
    GROUP BY p.id_portfolio
  `, [id_designer]);

  return result.rows; // массив портфолио с массивом работ внутри
}


async function insertService({ name, categoryId, description, priceFrom, coverPath }){
  await pool.query(
    `INSERT INTO service (service_name, id_design_type, service_description, service_price, service_path)
     VALUES ($1, $2, $3, $4, $5)`,
    [name, categoryId, description, priceFrom, coverPath]
  )
}

async function getAllServices () {
  const result = await pool.query(`
    SELECT 
      s.id_service,
      s.service_name,
      s.service_description,
      s.service_path,
      s.service_price,
      dt.id_design_type,
      dt.design_type_name
    FROM service s
    JOIN design_type dt ON s.id_design_type = dt.id_design_type
    ORDER BY s.id_service DESC
  `)
  return result.rows
}

async function updateService ({ id, name, categoryId, description, priceFrom, cover }) {
  const values = [name, categoryId, description, priceFrom];
  let query = `
    UPDATE service
    SET service_name = $1,
        id_design_type = $2,
        service_description = $3,
        service_price = $4`;

  if (cover) {
    values.push(cover);
    query += `, service_path = $5`;
  }

  values.push(id);
  query += ` WHERE id_service = $${values.length}`;

  await pool.query(query, values);
};

async function deleteService (id){
  await pool.query('DELETE FROM service WHERE id_service = $1', [id]);
};

async function createProductType ({ name, serviceId, price, duration, description }) {
  const query = `
    INSERT INTO product_type (
      product_type_name,
      id_service,
      product_price,
      completion_period,
      product_description
    ) VALUES ($1, $2, $3, $4, $5)
  `;

  await pool.query(query, [name, serviceId, price, duration, description]);
};

async function productTypesAll (req, res){
  const result = await pool.query(`
    SELECT pt.*, s.service_name
    FROM product_type pt
    JOIN service s ON pt.id_service = s.id_service
  `);
  return result.rows
};

async function productTypeDeleteById (id) {
  const query = 'DELETE FROM product_type WHERE id_product_type = $1';
  const values = [id];
  return pool.query(query, values);
};

async function getAllUsers() {
  const query = `
    SELECT id_account, id_role, account_name, account_email
    FROM personal_account
    ORDER BY id_account;
  `;
  const { rows } = await pool.query(query);
  return rows;
}

async function getAllRoles() {
  const query = `
    SELECT id_role, role_name
    FROM account_role
    ORDER BY id_role;
  `;
  const { rows } = await pool.query(query);
  return rows;
}


async function getRoleIdByName(roleName){
  const result = await pool.query('SELECT id_role FROM account_role WHERE role_name = $1', [roleName]);
  return result.rows[0]?.id_role || null;
};

async function updateUserRole (userId, roleId){
  await pool.query('UPDATE personal_account SET id_role = $1 WHERE id_account = $2', [roleId, userId]);
};

async function getAllDesigners () {
  const result = await pool.query(`
    SELECT d.id_designer, pa.account_name, d.id_level
    FROM designer d
    JOIN personal_account pa ON d.id_account = pa.id_account
  `);
  return result.rows;
};

async function updateDesignerLevel(id_designer, id_level) {
  const query = `
    UPDATE designer
    SET id_level = $1
    WHERE id_designer = $2
  `;
  await pool.query(query, [id_level, id_designer]);
}

async function getFullAllDesigners(){
    const query = `
        SELECT 
            d.id_designer,
            d.designer_description,
            d.designer_status,
            d.id_level,
            pa.account_name,
            pa.account_email,
            pa.account_path
        FROM designer d
        JOIN personal_account pa ON d.id_account = pa.id_account
    `;
    const result = await pool.query(query);
    return result.rows;
};


async function getAllPortfolios (){
    const query = `
        SELECT 
            p.id_portfolio,
            p.name_portfolio,
            p.portfolio_description,
            p.portfilio_cover,
            d.id_designer,
            pa.account_name AS designer_name
        FROM portfolio p
        JOIN designer d ON p.id_designer = d.id_designer
        JOIN personal_account pa ON d.id_account = pa.id_account
    `;
    const result = await pool.query(query);
    return result.rows;
};

async function getAllFeedback (){
    const query = `
        SELECT 
    f.feedback_content,
    f.feedback_raiting,
    f.id_feedback,
    p.order_date,
    client.account_name AS client_name,
    designer.account_name AS designer_name,
    s.service_name
FROM feedback f
JOIN project p ON f.id_project = p.id_project
LEFT JOIN personal_account client ON p.id_account = client.id_account
LEFT JOIN personal_account designer ON p.id_designer = designer.id_account
LEFT JOIN product_type pt ON p.id_product_type = pt.id_product_type
LEFT JOIN service s ON pt.id_service = s.id_service
ORDER BY f.id_feedback DESC;
    `;
    const result = await pool.query(query);
    return result.rows;
};

module.exports = {
  getAllDesignTypes,
  addDesignType,
  deleteDesignType,
  updateDesignType,
  getDesignerPortfolio,
  insertService,
  getAllServices,
  updateService,
  deleteService,
  createProductType,
  productTypesAll,
  productTypeDeleteById,
  getAllUsers,
  getAllRoles,
  updateUserRole,
  getRoleIdByName,
  getAllDesigners,
  updateDesignerLevel,
  getFullAllDesigners,
  getAllPortfolios,
  getAllFeedback
};
