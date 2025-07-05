

// 📁 controllers/adminController.js
const { getAllDesignTypes, addDesignType,deleteDesignType,updateDesignType,
  insertService, getAllServices, updateService, deleteService,
  createProductType, productTypesAll, productTypeDeleteById,
  getAllUsers, getAllRoles, updateUserRole, getRoleIdByName, 
  getAllDesigners, updateDesignerLevel } = require('../models/baseModel');
const { findById} = require('../models/profileModel');


//Получение всех типов дизайна
async function getAdminPage(req, res) {
  try {
    const user =  await findById(req.session.req.session.userId);
    const designTypes = await getAllDesignTypes();
    const services = await getAllServices()
    const product_types = await productTypesAll()
    const users = await getAllUsers();
    const roles = await getAllRoles();
    const designers = await getAllDesigners();

    res.render('admin_profile', {user, designTypes, services, product_types, users, roles, designers});
  } catch (err) {
    console.error('Ошибка при получении данных:', err);
    res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
  }
}


async function addDesignTypeHandler(req, res) {

    const  {design_type_name}  = req.body;
  try {
    await addDesignType(design_type_name);
    res.redirect('/admin');
  } catch (err) {
    console.error('Ошибка при добавлении design_type:', err);
    res.status(500).json({ error: 'Ошибка сервера при добавлении.' });
  }
}
async function deleteDesignTypeHandler(req, res) {
  const { id_design_type } = req.body;
  try {
    await deleteDesignType(id_design_type);
    res.redirect('/admin');
  } catch (err) {
    console.error('Ошибка при удалении design_type:', err);
    res.status(500).json({ error: 'Ошибка сервера при удалении.' });
  }
}
async function updateDesignTypeHandler(req, res) {
  const { id_design_type, design_type_name } = req.body;
  try {
    console.log(id_design_type, design_type_name)
    await updateDesignType(id_design_type, design_type_name);
    res.redirect('/admin/');
  } catch (err) {
    console.error('Ошибка при обновлении design_type:', err);
    res.status(500).json({ error: 'Ошибка сервера при обновлении.' });
  }
}

async function createServiceHandler (req, res) {
  try {
    const { serviceName, serviceCategory, serviceDescription, servicePriceFrom } = req.body
    const coverPath = req.file ? '/uploads/services/' + req.file.filename : null

    await insertService({
      name: serviceName,
      categoryId: serviceCategory,
      description: serviceDescription,
      priceFrom: servicePriceFrom,
      coverPath
    })

    res.redirect('/admin/') 
  } catch (error) {
    console.error('Ошибка создания услуги:', error)
    res.status(500).send('Ошибка сервера')
  }
}



async function updateServiceHandler (req, res) {
  try {
    const {
      serviceId,
      serviceName,
      serviceCategory,
      serviceDescription,
      servicePriceFrom
    } = req.body;

    console.log(req.file)
    let coverPath = null;
    if (req.file) {
      coverPath = req.file ? '/uploads/services/' + req.file.filename : null

    }

    await updateService({
      id: serviceId,
      name: serviceName,
      categoryId: serviceCategory,
      description: serviceDescription,
      priceFrom: servicePriceFrom,
      cover: coverPath,
    });

    res.redirect('/admin/');
  } catch (error) {
    console.error('Ошибка при обновлении услуги:', error);
    res.status(500).send('Ошибка сервера');
  }
};

async function deleteServiceHandler (req, res){
  try {
    const { serviceId } = req.body;

    await deleteService(serviceId);

    res.redirect('/admin/'); // или JSON, если используешь fetch
  } catch (error) {
    console.error('Ошибка при удалении услуги:', error);
    res.status(500).send('Ошибка сервера');
  }
};

async function createProductTypeHandler (req, res){
  try {
    const {
      productTypeName,
      productTypeService,
      productTypePrice,
      productTypeDuration,
      productTypeDescription,
    } = req.body;

    const duration = parseInt(productTypeDuration);

    await createProductType({
      name: productTypeName,
      serviceId: productTypeService,
      price: productTypePrice,
      duration,
      description: productTypeDescription,
    });

    res.redirect('/admin/'); // перенаправление после успешного создания
  } catch (error) {
    console.error('Ошибка при создании типа продукции:', error);
    res.status(500).send('Ошибка сервера при создании типа продукции');
  }
};


async function deleteProductType (req, res){
  const productTypeId = req.params.id;

  try {
    await productTypeDeleteById(productTypeId);
    res.redirect('/admin/'); // Или куда необходимо
  } catch (error) {
    console.error('Ошибка при удалении типа продукции:', error);
    res.status(500).send('Ошибка сервера при удалении');
  }
};


async function  updateUserRoleHandler(req, res){
  const { userId, newRole } = req.body;

  try {
    const roleId = await getRoleIdByName(newRole);
    if (!roleId) {
      return res.status(400).json({ error: 'Роль не найдена' });
    }

    await updateUserRole(userId, roleId);
    res.json({ success: true });
  } catch (err) {
    console.error('Ошибка контроллера при обновлении роли:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

async function updateDesignerLevelHandler(req, res) {
  const { id_designer, id_level } = req.body;

  try {
    await updateDesignerLevel(id_designer, id_level);
    res.json({ success: true });
  } catch (error) {
    console.error('Ошибка при обновлении уровня дизайнера:', error);
    res.status(500).json({ success: false, message: 'Ошибка сервера' });
  }
}

module.exports = {
  getAdminPage,
  addDesignTypeHandler,
  deleteDesignTypeHandler,
  updateDesignTypeHandler,
  createServiceHandler,
  updateServiceHandler,
  deleteServiceHandler,
  createProductTypeHandler,
  deleteProductType,
  updateUserRoleHandler,
  updateDesignerLevelHandler
};
