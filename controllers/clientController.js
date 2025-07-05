const { findById} = require('../models/profileModel');
const { getAllDesigners, getSelectedServiceProduct, addProject, getClientProjects, insertReview } = require('../models/clientModel');


//Получение всех типов дизайна
async function getClientPage(req, res) {
  try {

    const user = await findById(req.session.userId);
    res.render('client_profile', { user });
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
  }
}

async function getCart(req, res) {
  try {
    const productId = req.session.selectedProductId
    const designers = await getAllDesigners()
    const serviceData = await getSelectedServiceProduct(productId)
    console.log(designers)
    res.render('cart', { designers, serviceData });
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
  }
}

async function createProject (req, res){
  try {
    const { id_designer } = req.body;

    const id_product_type = req.session.selectedProductId
    const id_account = req.session.userId // или другой способ получить пользователя из сессии
    const order_date = new Date().toISOString().split('T')[0] // текущая дата
    const id_project_status = 1 // например: "Ожидает дизайнера"

    if (!id_product_type || !id_account) {
      return res.status(400).send('Недостаточно данных для создания проекта.')
    }

    await addProject({
      id_project_status,
      id_designer,
      id_account,
      id_product_type,
      order_date,
    })
    req.session.selectedProductId = null
    res.redirect('/client/cart') // редирект на список проектов
  } catch (error) {
    console.error('Ошибка при создании проекта:', error)
    res.status(500).send('Ошибка сервера')
  }
}

async function findClientProjects(req, res) {
  try {
    const clientId = req.session.userId; // или req.session.id_account
    const projects = await getClientProjects(clientId);
    res.render('client_orders', { projects });
  } catch (err) {
    console.error('Ошибка при получении проектов клиента:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function submitReview(req, res) {
  try {
    const { id_project, feedback_raiting, feedback_content } = req.body

    if (!id_project || !feedback_raiting || !feedback_content.trim()) {
      return res.status(400).send("Неполные данные для отзыва.")
    }

    await insertReview(
      id_project,
      feedback_content.trim(),
      feedback_raiting
    )

    res.redirect('/client/projects')
  } catch (error) {
    console.error("Ошибка при добавлении отзыва:", error)
    res.status(500).send("Ошибка сервера при сохранении отзыва.")
  }
}
module.exports = {
  getClientPage,
  getCart,
  createProject,
  findClientProjects,
  submitReview
};
