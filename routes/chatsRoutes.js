const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/chat"
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "_" + file.originalname
    cb(null, uniqueName)
  },
})

const upload  = multer({ storage: storage });


router.post("/:chatId/message", upload.array("files"), chatController.sendMessage)

router.get('/', chatController.getUserChats);
router.get('/:id', chatController.getChatById)
router.get('/:chatId/files', chatController.getChatFiles)

module.exports = router;
