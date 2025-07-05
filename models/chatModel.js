const { Pool } = require('pg');

// Создание пула подключений к PostgreSQL
const pool = new Pool({
  user: "postgres",
  password: '071018',
  host: "localhost",
  port: 5432,
  database: "design_studio"
})



async function getUserChats(userId) {
  const result = await pool.query(`
    SELECT
      ch.id_chat,
      TO_CHAR(ch.chat_date, 'DD.MM.YYYY HH24:MI') AS chat_date,
      COALESCE(s.service_name, 'Поддержка') AS chat_name,

      CASE
        WHEN ch.id_account = $1 THEN d.account_name
        WHEN ch.id_designer = $1 THEN c.account_name
        ELSE 'Неизвестный'
      END AS opponent_name

    FROM chat ch
    LEFT JOIN project p ON p.id_project = ch.id_project
    LEFT JOIN product_type pt ON pt.id_product_type = p.id_product_type
    LEFT JOIN service s ON s.id_service = pt.id_service
    LEFT JOIN personal_account c ON ch.id_account = c.id_account
    LEFT JOIN personal_account d ON ch.id_designer = d.id_account
    WHERE ch.id_account = $1 OR ch.id_designer = $1
    ORDER BY ch.chat_date DESC
  `, [userId]);

  return result.rows;
}

async function getChatHeader(chatId) {
  const query = `
    SELECT 
      s.service_name AS title
    FROM chat c
    LEFT JOIN project p ON c.id_project = p.id_project
    LEFT JOIN product_type pt ON p.id_product_type = pt.id_product_type
    LEFT JOIN service s ON pt.id_service = s.id_service
    WHERE c.id_chat = $1
  `
  const result = await pool.query(query, [chatId])
  return result.rows[0]
}


async function getChatMessages(chatId, currentUserId) {
  const query = `
    SELECT 
      m.id_messege,
      a.id_account,
      a.account_name,
      m.messege_content AS text,
      TO_CHAR(m.messege_date, 'HH24:MI') AS time,
      CASE
        WHEN m.id_account = $2 THEN 'user'
        ELSE 'other'
      END AS type
    FROM chat_message m
    LEFT JOIN personal_account a ON a.id_account = m.id_account
    WHERE m.id_chat = $1
    ORDER BY m.messege_date ASC
  `
  const messagesResult = await pool.query(query, [chatId, currentUserId])

  const messages = await Promise.all(
    messagesResult.rows.map(async (msg) => {
      const filesQuery = `
        SELECT 
          file_path AS url,
          SPLIT_PART(file_path, '/', array_length(string_to_array(file_path, '/'), 1)) AS name,
          123456 AS size -- временно, т.к. размер не хранится
        FROM messege_file
        WHERE id_messege = $1
      `
      const filesResult = await pool.query(filesQuery, [msg.id_messege])

      return {
        ...msg,
        files: filesResult.rows,
      }
    })
  )

  return messages
}



async function getChatFiles (chatId) {
  const query = `
    SELECT 
      mf.file_path AS path,
      mf.file_upload_date::TEXT AS date,
      -- Можно использовать имя файла из пути, если не хранится отдельно
      split_part(mf.file_path, '/', -1) AS name,
      NULL AS size,          -- Если размер не хранится — можно убрать
      NULL AS mimeType       -- Можно попытаться определить на клиенте
    FROM chat_message cm
    JOIN messege_file mf ON cm.id_messege = mf.id_messege
    WHERE cm.id_chat = $1
    ORDER BY mf.file_upload_date
  `
  const result = await pool.query(query, [chatId])
  return result.rows
}


async function insertMessage(chatId, accountId, text, date){
  const query = `
    INSERT INTO chat_message (id_account, id_chat, messege_content, messege_date, read_messege)
    VALUES ($1, $2, $3, $4, false)
    RETURNING id_messege
  `
  const result = await pool.query(query, [accountId, chatId, text, date])
  return result.rows[0].id_messege
}

async function insertMessageFile (messageId, filePath, date){
  const query = `
    INSERT INTO messege_file (id_messege, file_path, file_upload_date)
    VALUES ($1, $2, $3)
  `
  await pool.query(query, [messageId, filePath, date])
}


module.exports = {
    getUserChats,
    getChatHeader,
    getChatMessages,
    getChatFiles,
    insertMessage,
    insertMessageFile

};