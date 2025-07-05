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

const { getAllDesignTypes, getDesignerPortfolio } = require('../models/baseModel');


async function getAccountAndDesignerInfo(id_account) {
  const result = await pool.query(`
    SELECT 
      pa.id_account,
      pa.id_role,
      pa.account_name,
      pa.account_email,
      pa.account_path,
      d.id_designer,
      d.designer_description,
      d.id_level
    FROM personal_account pa
    JOIN designer d ON pa.id_account = d.id_account
    WHERE pa.id_account = $1
  `, [id_account]);

  return result.rows[0]; // объект с данными аккаунта и дизайнера
}



async function getFullDesignerProfile(id_account) {

  const accountInfo = await getAccountAndDesignerInfo(id_account);
  if (!accountInfo) return null;

  const portfolios = await getDesignerPortfolio(accountInfo.id_designer);
  const designTypes = await getAllDesignTypes();

  return {
    accountInfo: accountInfo,
    portfolios: portfolios,
    all_design_types: designTypes
  };
}

async function insertPortfolioProject({ accountId, title, description, categoryId, coverPath }) {
  // Сначала находим id_designer по id_account
  const designerResult = await pool.query(
    `SELECT id_designer FROM designer WHERE id_account = $1`,
    [accountId]
  );

  if (designerResult.rowCount === 0) {
    throw new Error(`Designer with account ID ${accountId} not found`);
  }

  const designerId = designerResult.rows[0].id_designer;

  // Вставляем проект в портфолио
  const result = await pool.query(
    `INSERT INTO portfolio 
      (id_design_type, id_designer, name_portfolio, portfolio_description, portfilio_cover)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id_portfolio`,
    [categoryId || null, designerId, title, description, coverPath]
  );

  return result.rows[0].id_portfolio;
}


async function insertGalleryImages(portfolioId, imagePaths) {
  const insertQuery = `INSERT INTO art_work (id_portfolio, work_path) VALUES ($1, $2)`;

  for (const path of imagePaths) {
    await pool.query(insertQuery, [portfolioId, path]);
  }
}


async function updateProject ({ projectId, projectTitle, projectDescription, projectCategory, coverPath, galleryPaths }) {
  // Обновить основную информацию
  await pool.query(`
    UPDATE portfolio
    SET name_portfolio = $1,
        portfolio_description = $2,
        id_design_type = $3,
        portfilio_cover = COALESCE($4, portfilio_cover)
    WHERE id_portfolio = $5
  `, [projectTitle, projectDescription, projectCategory, coverPath, projectId]);

  // Если передан массив новых изображений галереи
  if (galleryPaths && galleryPaths.length > 0) {
    // Удаляем старые изображения галереи из таблицы
    await pool.query(`
      DELETE FROM art_work
      WHERE id_portfolio = $1
    `, [projectId]);

    // Добавляем новые
    for (const imagePath of galleryPaths) {
      await pool.query(`
        INSERT INTO art_work (id_portfolio, work_path)
        VALUES ($1, $2)
      `, [projectId, imagePath]);
    }
  }
};


async function getOldPortfolioImages (projectId) {
  // Получаем старую обложку
  const coverRes = await pool.query(`
    SELECT portfilio_cover FROM portfolio WHERE id_portfolio = $1
  `, [projectId]);

  const oldCover = coverRes.rows[0]?.portfilio_cover;

  // Получаем старые работы (галерея)
  const galleryRes = await pool.query(`
    SELECT work_path FROM art_work WHERE id_portfolio = $1
  `, [projectId]);

  const oldGallery = galleryRes.rows;

  return { oldCover, oldGallery };
};


async function getCoverPath (projectId) {
  const { rows } = await pool.query(`
    SELECT portfilio_cover FROM portfolio WHERE id_portfolio = $1
  `, [projectId]);

  return rows[0]?.portfilio_cover || null;
};

async function getGalleryPaths (projectId) {
  const { rows } = await pool.query(`
    SELECT work_path FROM art_work WHERE id_portfolio = $1
  `, [projectId]);

  return rows.map(row => row.work_path);
};


async function deletePortfolioById (projectId) {
  await pool.query(`DELETE FROM portfolio WHERE id_portfolio = $1`, [projectId]);
};

async function getDesignerProjects(designerId) {
  const result = await pool.query(`
    SELECT 
      p.id_project,
      p.id_project_status,
      TO_CHAR(p.order_date, 'DD.MM.YYYY HH24:MI') AS order_date_formatted,
      TO_CHAR(p.finish_date, 'DD.MM.YYYY HH24:MI') AS finish_date_formatted,
      c.account_name AS client_name,
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
    LEFT JOIN personal_account c ON p.id_account = c.id_account  -- клиент
    LEFT JOIN designer des ON p.id_designer = des.id_account
    LEFT JOIN qualification_level q ON des.id_level = q.id_level
    LEFT JOIN product_type pt ON p.id_product_type = pt.id_product_type
    LEFT JOIN service s ON pt.id_service = s.id_service
    LEFT JOIN feedback f ON p.id_project = f.id_project
    WHERE p.id_designer = $1
  `, [designerId]);

  return result.rows;
}

async function updateOrderStatus(orderId, statusName){
  const result = await pool.query(
    `UPDATE project 
     SET id_project_status = $1
     WHERE id_project = $2`,
    [statusName, orderId]
  );

  return result;
};

module.exports = {
  getAccountAndDesignerInfo,
  getDesignerPortfolio,
  getFullDesignerProfile,
  insertPortfolioProject,
  insertGalleryImages,
  updateProject,
  getOldPortfolioImages,
  getCoverPath,
  getGalleryPaths,
  deletePortfolioById,
  getDesignerProjects,
  updateOrderStatus
};