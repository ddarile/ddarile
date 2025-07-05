const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getDesignerPage, addPortfolioProject, updatePortfolio, deletePortfolio, 
  findDesignerProjects, acceptOrder, cancelledOrder,completeOrder} = require('../controllers/designerController');

const portfolioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/portfolio/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const timestamp = Date.now();
    const uniqueSuffix = `${req.session.userId}_${timestamp}_${Math.round(Math.random() * 1E9)}`;
    const prefix = file.fieldname === 'coverImage' ? 'cover' : 'gallery';
    cb(null, `${prefix}_${uniqueSuffix}${ext}`);
  }
});

const portfolioUpload = multer({ storage: portfolioStorage });

router.get('/', getDesignerPage)


router.post('/portfolio/add',
  portfolioUpload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'galleryImages', maxCount: 10 }
  ]),
  addPortfolioProject
);

// Обновление проекта (обложка и галерея)
router.post('/portfolio/update', portfolioUpload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'galleryImages', maxCount: 10 }
]), updatePortfolio);

router.delete('/portfolio/delete/:id', deletePortfolio);

router.get('/projects', findDesignerProjects);
router.post('/orders/accept', acceptOrder);
router.post('/orders/cancelled', cancelledOrder);
router.post('/orders/complete', completeOrder);


module.exports = router;