const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');





const app = express();
const PORT = 3000;


// Настройка middleware для сессий
app.use(session({
  secret: 'tt5FvubaaAA', // Секретный ключ для подписи сессии
  resave: false, // Не сохранять сессию, если она не изменялась
  saveUninitialized: true, // Сохранять пустые сессии
}));

// Раздача статических файлов
app.use('/styles', express.static(path.join(__dirname, 'public/styles')));
app.use('/scripts', express.static(path.join(__dirname, 'public/scripts')));
app.use('/pictures', express.static(path.join(__dirname, 'pictures')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.set('view engine', 'ejs'); // пример с EJS
app.set('views', path.join(__dirname, 'pages'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // для обработки application/json


// Импорт маршрутов
const adminRoutes = require('./routes/adminRoutes');
const profileRoutes = require('./routes/profileRoutes');
const clientRoutes = require('./routes/clientRoutes');
const designerRoutes = require('./routes/designerRoutes');
const baseRoutes = require('./routes/baseRoutes');
const chatsRoutes = require('./routes/chatsRoutes');
const menagerRoutes = require('./routes/managerRoutes');

app.use('/admin', adminRoutes);
app.use('/profile', profileRoutes);
app.use('/client', clientRoutes);
app.use('/designer', designerRoutes);
app.use('/', baseRoutes);
app.use('/chats', chatsRoutes);
app.use('/manager', menagerRoutes);



// Обработка GET-запросов для HTML-страниц
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'services.html'));
});

app.get('/portfolio', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'portfolio.html'));
});

app.get('/feedback', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'reviews.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'team.html'));
});

//app.get('/profile', (req, res) => {
//  res.sendFile(path.join(__dirname, 'pages', 'admin_profile.html'));
//});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'admin_profile.html'));
});

app.get('/cart', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'auth.html'));
});

app.get('/designer_orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'designer_orders.html'));
});

app.get('/client_orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'client_orders.html'));
});

app.get('/chats', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'chats.html'));
});


// Обработка несуществующих маршрутов
app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
