const session = require('express-session');
const { format } = require('date-fns');
const { ru } = require('date-fns/locale');


const { getAllDesignTypes,
  getAllServices,
  productTypesAll, getFullAllDesigners, getAllPortfolios, getAllFeedback } = require('../models/baseModel');


//Получение всех типов дизайна
async function getServisePage(req, res) {
  try {
    const design_types = await getAllDesignTypes();
    const services = await getAllServices()
    const product_types = await productTypesAll()

    const filteredServices = services.filter(service =>
      product_types.some(pt => pt.id_service === service.id_service)
    );

    res.render('services', { design_types, services: filteredServices, product_types, role: req.session.role });
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
  }
}

async function getMainPage(req, res) {


  //const product_types = await productTypesAll()
  res.render('index', { role: req.session.role });
};

async function getAllDesigners (req, res) {
    try {
        const designers = await getFullAllDesigners();
        res.render('team', { designers });
    } catch (err) {
        console.error('Ошибка при получении дизайнеров:', err);
        res.status(500).send('Ошибка сервера');
    }
};


async function findAllPortfolios (req, res) {
    try {
        const design_types = await getAllDesignTypes();
        const portfolios = await getAllPortfolios();
        res.render('portfolio', { design_types, portfolios });
    } catch (error) {
        console.error('Ошибка при получении портфолио:', error);
        res.status(500).send('Ошибка сервера');
    }
};

async function findAllFeedback (req, res){
    try {
        const design_types = await getAllDesignTypes();
        const feedbacksRaw = await getAllFeedback();
        const feedbacks = feedbacksRaw.map(item => ({
            ...item,
            formatted_date: format(new Date(item.order_date), 'd MMMM yyyy', { locale: ru }),
        }));
        res.render('reviews', { design_types, feedbacks });
    } catch (err) {
        console.error('Ошибка при получении отзывов:', err);
        res.status(500).send('Ошибка сервера');
    }
};

module.exports = {
  getServisePage,
  getMainPage,
  getAllDesigners,
  findAllPortfolios,
  findAllFeedback
};
