const express = require('express');
const router = express.Router();
const { getClientPage,getCart, createProject, findClientProjects, submitReview} = require('../controllers/clientController');


router.get('/', getClientPage)
router.get('/cart', getCart)
router.delete('/cart/remove', (req, res) => {
  req.session.selectedProductId = null
  res.status(200).json({ success: true });
});

router.post('/project/create', createProject)
router.get('/projects', findClientProjects);
router.post("/reviews/add", submitReview)



module.exports = router;
