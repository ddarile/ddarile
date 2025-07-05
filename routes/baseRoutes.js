const express = require('express');
const router = express.Router();
const { getServisePage, getMainPage, getAllDesigners, findAllPortfolios, findAllFeedback } = require('../controllers/baseController');

router.get('/', getMainPage);
router.get('/services', getServisePage);
router.get('/team', getAllDesigners);
router.get('/portfolio', findAllPortfolios);
router.get('/feedback', findAllFeedback);

module.exports = router;
