
const bcrypt = require('bcrypt');
const { findByEmail, createAccount, updateAccount, findById, updateDesignerDescription } = require('../models/profileModel');







async function updateProfile(req, res) {
  try {
    const userId = req.session.userId;
    const { clientName, clientEmail, currentPassword, newPassword } = req.body;

    // Получить текущие данные пользователя
    const user = await findById(userId);

    // Проверка текущего пароля, если указан
    if (currentPassword && !(await bcrypt.compare(currentPassword, user.account_password))) {
      return res.status(400).send('Неверный текущий пароль');
    }

    let newHashedPassword = null;
    if (newPassword && newPassword.trim() !== '') {
      newHashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Обработка аватара
    let avatarPath = user.account_path;
    if (req.file) {
      avatarPath = '/uploads/avatars/' + req.file.filename;
    }

    // Обновление данных в базе
    await updateAccount({
      id_account: userId,
      account_name: clientName,
      account_email: clientEmail,
      new_password: newHashedPassword,
      account_path: avatarPath,
    });


    res.redirect('/profile/');
  } catch (err) {
    console.error('Ошибка при обновлении профиля:', err);
    res.status(500).send('Внутренняя ошибка сервера');
  }
};

async function updateDesignerProfile(req, res) {
  try {
    const userId = req.session.userId;
    const {
      designerName,
      designerEmail,
      designerDescription,
      currentPassword,
      newPassword
    } = req.body;

    const user = await findById(userId);
    if (!user) return res.status(404).send('Пользователь не найден');

    // Проверка текущего пароля
    if (currentPassword && !(await bcrypt.compare(currentPassword, user.account_password))) {
      return res.status(400).send('Неверный текущий пароль');
    }

    // Новый хеш пароля, если задан
    let newHashedPassword = null;
    if (newPassword && newPassword.trim() !== '') {
      newHashedPassword = await bcrypt.hash(newPassword, 10);
    }

    // Обработка аватара
    let avatarPath = user.account_path;
    if (req.file) {
      avatarPath = '/uploads/avatars/' + req.file.filename;
    }

    // Обновление аккаунта
    await updateAccount({
      id_account: userId,
      account_name: designerName,
      account_email: designerEmail,
      new_password: newHashedPassword,
      account_path: avatarPath
    });

    // Обновление описания дизайнера
    await updateDesignerDescription(userId, designerDescription);


    res.redirect('/designer'); // или другая страница
  } catch (err) {
    console.error('Ошибка при обновлении профиля дизайнера:', err);
    res.status(500).send('Внутренняя ошибка сервера');
  }
}

async function getAuth(req, res) {
  if (req.session.userId == null) {
    res.redirect('/profile/auth')
  }
  else {
    switch (req.session.role) {
      case 1:
        res.redirect('/client')
        break;
      case 2:
        res.redirect('/designer')
        break;
      case 3:
        res.redirect('/manager')
        break;
      case 4:
        res.redirect('/admin')
        break;
      default:
        // Неизвестная роль
        console.log('Неизвестная роль');
        break;
    }
  }

}

async function getLoginPage(req, res) {
  res.render('auth', { errors: null, role: req.session.role })

}

// Авторизация
async function login(req, res) {
  const { account_email, account_password } = req.body;

  if (!account_email || !account_password) {
    return res.render('auth', { errors: 'Все поля обязательны', role: req.session.role });
  }

  try {
    const user = await findByEmail(account_email);
    if (!user) {
      return res.render('auth', { errors: 'Email не найден', role: req.session.role });
    }

    const isMatch = await bcrypt.compare(account_password, user.account_password);
    if (!isMatch) {
      return res.render('auth', { errors: 'Неверный пароль', role: req.session.role });
    }

    // Успешный вход: сохраняем в сессию
    req.session.userId = user.id_account;
    req.session.role = user.id_role;

    res.redirect('/profile/')
  } catch (err) {
    console.error('Ошибка входа:', err);
    res.status(500).send('Ошибка сервера');
  }
}
async function selectProduct(req, res) {
  try {
    // Проверка авторизации
    if (!req.session.userId) {
      return res.status(401).json({ redirect: "/profile/auth" })
    }


    const { productId } = req.body

    if (!productId) {
      return res.status(400).json({ error: "ID услуги не передан" })
    }
    // Запись выбранного productId в сессию
    req.session.selectedProductId = productId

    console.log(req.session.selectedProductId)
    // Ответ клиенту
    return res.status(200).json({ success: true })

  } catch (error) {
    console.error("Ошибка при выборе услуги:", error)
    return res.status(500).json({ error: "Ошибка сервера" })
  }
}


async function register(req, res) {
  const { account_name, account_email, account_password } = req.body;

  const errors = [];

  // Валидация имени
  if (!account_name || account_name.length < 2) {
    errors.push('Имя слишком короткое');
  }

  // Валидация email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!account_email || !emailRegex.test(account_email)) {
    errors.push('Неверный формат email');
  }

  // Валидация пароля
  if (!account_password || account_password.length < 6) {
    errors.push('Пароль слишком короткий');
  }


  if (Object.keys(errors).length > 0) {
    return res.render('auth', { errors });
  }

  try {
    const existing = await findByEmail(account_email);
    if (existing) {
      errors.push('Почта уже зарегистрирована');
      return res.render('auth', { errors: errors });
    }

    const hashed_password = await bcrypt.hash(account_password, 10);

    const user = await createAccount({
      id_role: 1,
      account_name,
      account_email,
      hashed_password,
      account_path: "/uploads/avatars/avatar_1.jpg"
    });

    req.session.userId = user.id_account;
    req.session.role = user.id_role;
    res.redirect('/profile/');
  } catch (err) {
    console.error('Ошибка при регистрации:', err);
    res.status(500).send('Внутренняя ошибка сервера');
  }
}

module.exports = {
  getLoginPage,
  register,
  getAuth,
  login,
  updateProfile,
  updateDesignerProfile,
  selectProduct
};

