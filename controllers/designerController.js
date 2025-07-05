const fs = require('fs');
const path = require('path');
const { getFullDesignerProfile, insertPortfolioProject, insertGalleryImages, updateProject, getOldPortfolioImages,  deletePortfolioById, getCoverPath, getGalleryPaths,
     getDesignerProjects, updateOrderStatus} = require('../models/designerModel');


//Получение всех типов дизайна
async function getDesignerPage(req, res) {
    try {

        const user = await getFullDesignerProfile(req.session.userId);
        res.render('designer_profile', { user });
    } catch (err) {
        console.error('Ошибка при получении данных:', err);
        res.status(500).json({ error: 'Ошибка сервера при получении данных.' });
    }
}

async function addPortfolioProject(req, res) {
    try {
        const designerId = req.session.userId;
        const { projectTitle, projectCategory, projectDescription } = req.body;

        const cover = req.files['coverImage']?.[0];
        const gallery = req.files['galleryImages'] || [];

        if (!cover) {
            return res.status(400).send('Обложка обязательна');
        }

        const coverPath = '/uploads/portfolio/' + cover.filename;

        // Вставка проекта и получение ID
        const projectId = await insertPortfolioProject({
            accountId: designerId,
            title: projectTitle,
            description: projectDescription,
            categoryId: projectCategory,
            coverPath
        });

        // Вставка изображений галереи
        const galleryPaths = gallery.map(image => '/uploads/portfolio/' + image.filename);
        await insertGalleryImages(projectId, galleryPaths);

        res.json({ success: true, message: "Проект успешно обновлён" });
    } catch (err) {
        console.error('Ошибка при добавлении проекта:', err);
        res.status(500).send('Внутренняя ошибка сервера');
    }
}


async function updatePortfolio(req, res) {
    try {
        const {
            projectId,
            projectTitle,
            projectDescription,
            projectCategory
        } = req.body;

        


        const coverImage = req.files?.['coverImage']?.[0] || null;
        const galleryImages = req.files?.['galleryImages'] || [];

        // Получаем старые пути
        const { oldCover, oldGallery } = await getOldPortfolioImages(projectId);

        let coverPath = oldCover; // по умолчанию оставляем старую обложку
        let galleryPaths;
        if (Array.isArray(galleryImages)) {
            galleryPaths = galleryImages.map(image => '/uploads/portfolio/' + path.basename(image.path));
        } else if (galleryImages && typeof galleryImages === 'object' && galleryImages.path) {
            // Если это одиночный файл
            galleryPaths = ['/uploads/portfolio/' + path.basename(galleryImages.path)];
        } else {
            galleryPaths = oldGallery.map(img => img.work_path); // оставить старые
        }

        // Если загружена новая обложка
        if (coverImage) {
            // Удаляем старую обложку
            if (oldCover) {
                fs.unlink(path.resolve(path.join(__dirname, '..',path.join(oldCover))), (err) => {
                    if (err) console.error('Ошибка удаления старой обложки:', err);
                });
            }
            // Обновляем путь к новой обложке
            coverPath = '/uploads/portfolio/' + path.basename(coverImage.path);
        }

        // Если загружены новые изображения галереи
        if (galleryImages.length > 0) {
            // Удаляем старые
            for (const image of oldGallery) {
                fs.unlink(path.resolve(path.join(__dirname, '..',image.work_path)), (err) => {
                    if (err) console.error('Ошибка удаления работы:', err);
                });
            }

            // Сохраняем новые пути
            galleryPaths = galleryImages.map(image => '/uploads/portfolio/' + path.basename(image.path));
            console.log(galleryPaths)
        }

        
        // Обновляем данные проекта в БД
        await updateProject({
            projectId,
            projectTitle,
            projectDescription,
            projectCategory,
            coverPath,
            galleryPaths
        });

        res.redirect('/designer/');
    } catch (error) {
        console.error('Ошибка при обновлении портфолио:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function deletePortfolio(req, res){
  const projectId = req.params.id;

  try {
    // Получаем пути изображений
    const coverPath = await getCoverPath(projectId);
    const galleryPaths = await getGalleryPaths(projectId);

    // Удаляем файлы с диска
    if (coverPath) {
        const fullCoverPath = path.join(__dirname, '..', coverPath);
        fs.unlink(fullCoverPath, (err) => {
           if (err) console.error('Ошибка удаления обложки:', err);
        });
    }

    for (const imgPath of galleryPaths) {
        const fullGalleryPath = path.join(__dirname, '..', imgPath);
        fs.unlink(fullGalleryPath, (err) => {
          if (err) console.error('Ошибка удаления изображения галереи:', err);
        });
    }

    await deletePortfolioById(projectId);

    res.json({ success: true, message: 'Проект удалён' });
  } catch (error) {
    console.error('Ошибка при удалении проекта:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

async function findDesignerProjects(req, res) {
  try {
    const userId = req.session.userId; // или req.session.id_account
    const orders = await getDesignerProjects(userId);
    res.render('designer_orders', { orders });
  } catch (err) {
    console.error('Ошибка при получении проектов клиента:', err);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
}

async function acceptOrder (req, res){
  const orderId = req.body.orderId;
  try {
    await updateOrderStatus(orderId, 2); // статус "в процессе"
    res.redirect('/designer/projects'); 
  } catch (error) {
    console.error('Ошибка при принятии заказа:', error);
    res.status(500).send('Ошибка сервера');
  }
};


async function cancelledOrder (req, res){
  const orderId = req.body.orderId;
  try {
    await updateOrderStatus(orderId, 4); 
    res.redirect('/designer/projects'); 
  } catch (error) {
    console.error('Ошибка при принятии заказа:', error);
    res.status(500).send('Ошибка сервера');
  }
};

async function completeOrder (req, res){
  const orderId = req.body.orderId;
  try {
    await updateOrderStatus(orderId, 3); 
    res.redirect('/designer/projects'); 
  } catch (error) {
    console.error('Ошибка при принятии заказа:', error);
    res.status(500).send('Ошибка сервера');
  }
};
module.exports = {
    getDesignerPage,
    addPortfolioProject,
    updatePortfolio,
    deletePortfolio,
    findDesignerProjects,
    acceptOrder,
    cancelledOrder,
    completeOrder
};