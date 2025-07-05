const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Настройка multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const filename = `avatar_${req.session.userId}${ext}`;
    cb(null, filename);
  }
});
const upload = multer({ storage: storage });
const { getLoginPage, register, login, getAuth, updateProfile, updateDesignerProfile, selectProduct } = require('../controllers/profileController');



router.get('/',getAuth);

router.get('/auth',getLoginPage);

router.post('/register', register);

router.post('/login', login);

router.post("/select-product", selectProduct)



router.post('/update', upload.single('avatar'), updateProfile);
router.post('/update-designer', upload.single('avatar'), updateDesignerProfile);



router.get('/logout', (req, res) => {
  req.session.destroy()
  res.render('auth', { role: null, errors: null  });
});





module.exports = router;
