const { findById} = require('../models/profileModel');


//Получение всех типов дизайна
async function getManagerPage(req, res) {
  try {

    const user = await findById(req.session.userId);
    res.render('manager_profile', { user });
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
  }
}


module.exports = {
  getManagerPage
};
