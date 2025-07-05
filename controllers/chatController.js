const chatModel = require('../models/chatModel');


async function getUserChats(req, res) {
  const userId = req.session.userId;
  try {
    const chats = await chatModel.getUserChats(userId);
    res.render('chats', { chats });
  } catch (err) {
    console.error('Ошибка при получении списка чатов:', err);
    res.status(500).send('Ошибка сервера');
  }
};


async function getChatById(req, res) {
  const chatId = parseInt(req.params.id, 10)

  if (isNaN(chatId)) {
    return res.status(400).json({ error: 'Некорректный ID чата' })
  }

  try {
    const chatInfo = await chatModel.getChatHeader(chatId)
    const messages = await chatModel.getChatMessages(chatId, req.session.userId)

    if (!chatInfo) {
      return res.status(404).json({ error: 'Чат не найден' })
    }

    res.json({
      title: chatInfo.title,
      messages,
    })
  } catch (error) {
    console.error('Ошибка при получении чата:', error)
    res.status(500).json({ error: 'Ошибка сервера' })
  }
}

async function getChatFiles(req, res) {
  const { chatId } = req.params
  try {
    const files = await chatModel.getChatFiles(chatId)
    res.json(files)
  } catch (error) {
    console.error("Ошибка при получении файлов чата:", error)
    res.status(500).json({ error: "Ошибка сервера при получении файлов" })
  }
}

async function sendMessage(req, res) {
  const { chatId } = req.params
  const { text, date } = req.body
  const accountId = req.session.userId;

  console.log(req.files)
  try {
    const messageText = text && text.trim() !== "" ? text.trim() : "Прикреплён файл"

    // Если date не передана — установить текущую дату и время
    const messageDate = new Date()

    const messageId = await chatModel.insertMessage(chatId, accountId, messageText, messageDate)


    const files = []
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        await chatModel.insertMessageFile(messageId, file.path, messageDate)
        files.push({
          path: "/" + file.path.replace(/\\/g, "/"),
          name: file.originalname,
        })
      }
    }

    res.json({
      text,
      date,
      files,
    })

  } catch (error) {
    console.error("Ошибка при отправке сообщения:", error)
    res.status(500).json({ error: "Ошибка сервера" })
  }
}



module.exports = {
  getUserChats,
  getChatById,
  getChatFiles,
  sendMessage
};