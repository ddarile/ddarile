const express = require('express');
const router = express.Router();
const { getManagerPage} = require('../controllers/managerController');



router.get('/', getManagerPage)







module.exports = router;
