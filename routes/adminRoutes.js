const express = require('express');
const router = express.Router();
const multer = require('multer')
const path = require('path')
const { addDesignTypeHandler, getAdminPage, 
    deleteDesignTypeHandler,updateDesignTypeHandler, createServiceHandler,
    updateServiceHandler, deleteServiceHandler, 
    createProductTypeHandler, deleteProductType, 
    updateUserRoleHandler, updateDesignerLevelHandler } = require('../controllers/adminController');


// Настройка хранилища для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/services'))
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9)
    cb(null, 'cover_' + uniqueSuffix + path.extname(file.originalname))
  }
})
const upload = multer({ storage })
router.get('/', getAdminPage)
// POST /admin/design-type
router.post('/design-type', addDesignTypeHandler);
// POST /admin/design-type/delete
router.post('/design-type/delete', deleteDesignTypeHandler);
// POST /admin/design-type/update
router.post('/design-type/update', updateDesignTypeHandler);

router.post('/services/create', upload.single('serviceCover'), createServiceHandler)
router.post('/service/update', upload.single('serviceCover'), updateServiceHandler);
router.post('/service/delete', deleteServiceHandler);

router.post('/product-type/create', createProductTypeHandler);
router.post('/product-type/delete/:id', deleteProductType);

router.post('/update-role', updateUserRoleHandler);
router.post('/update-level', updateDesignerLevelHandler);

module.exports = router;
