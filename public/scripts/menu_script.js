document.addEventListener('DOMContentLoaded', function () {
    // Бургер-меню
    const burgerMenu = document.getElementById('burger-menu');
    const openMenuBtn = document.getElementById('open-menu');
    const closeMenuBtn = document.getElementById('close-menu');

    if (openMenuBtn && closeMenuBtn && burgerMenu) {
        // Открытие меню
        openMenuBtn.addEventListener('click', function() {
            burgerMenu.classList.add('open');
            openMenuBtn.classList.add('active'); // Добавляем класс для анимации
            
        });

        // Закрытие меню
        closeMenuBtn.addEventListener('click', function() {
            burgerMenu.classList.remove('open');
            openMenuBtn.classList.remove('active'); // Удаляем класс для анимации
            
        });
        
        // Закрытие меню при клике вне его области
        document.addEventListener('click', function(e) {
            if (burgerMenu.classList.contains('open') && 
                !burgerMenu.contains(e.target) && 
                e.target !== openMenuBtn && 
                !openMenuBtn.contains(e.target)) {
                
                burgerMenu.classList.remove('open');
                openMenuBtn.classList.remove('active');
                document.body.classList.remove('menu-open');
                document.body.style.overflow = '';
            }
        });
    }

    // Выпадающее меню "Каталог"
    const catalogDropdown = document.getElementById('catalog-dropdown');
    const dropdownContent = document.getElementById('dropdown-content');

    if (catalogDropdown && dropdownContent) {
        catalogDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
            catalogDropdown.classList.toggle('active');
            dropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', function (e) {
            if (!catalogDropdown.contains(e.target)) {
                catalogDropdown.classList.remove('active');
                dropdownContent.classList.remove('show');
            }
        });

        dropdownContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Кнопки категорий
    const categoryButtons = document.querySelectorAll('.category-button');
    const servicesGrid = document.querySelector('.services-grid');

    if (categoryButtons.length && servicesGrid) {
        categoryButtons.forEach(button => {
            button.addEventListener('click', function () {
                let url = '';

                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                    url = '/services_smal';
                } else {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const designTypeId = button.dataset.designTypeId;
                    url = `/services_smal?design_type_id=${designTypeId}`;
                }

                fetch(url)
                    .then(response => response.text())
                    .then(data => {
                        servicesGrid.innerHTML = data;
                    })
                    .catch(error => console.error('Ошибка при запросе:', error));
            });
        });
    }

    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop && scrollTop > headerHeight) {
            // Прокрутка вниз
            header.style.transform = 'translateY(-100%)';
        } else {
            // Прокрутка вверх
            header.style.transform = 'translateY(0)';
        }

        lastScrollTop = scrollTop;
    });

    // Пример: скрыть/показать индикатор уведомлений
    function updateNotificationBadge(hasNotifications) {
        const badge = document.querySelector('.notification-badge');
        if (badge) {
            if (hasNotifications) {
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    }

    // Пример использования:
    // updateNotificationBadge(true); // Показать индикатор
    // updateNotificationBadge(false); // Скрыть индикатор
    // Выпадающий список уведомлений
    const notificationIcon = document.getElementById('notification-icon');
    const notificationContent = document.getElementById('notification-content');

    if (notificationIcon && notificationContent) {
        notificationIcon.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            notificationContent.classList.toggle('show');
        });

        // Закрытие выпадающего списка при клике вне его
        document.addEventListener('click', function (e) {
            if (!notificationContent.contains(e.target) && e.target !== notificationIcon) {
                notificationContent.classList.remove('show');
            }
        });

        // Предотвращаем закрытие при клике внутри списка
        notificationContent.addEventListener('click', function (e) {
            e.stopPropagation();
        });

        // Функционал "Отметить все как прочитанные"
        const markAllReadBtn = document.querySelector('.mark-all-read');
        if (markAllReadBtn) {
            markAllReadBtn.addEventListener('click', function (e) {
                e.preventDefault();
                const unreadItems = document.querySelectorAll('.notification-item.unread');
                unreadItems.forEach(item => {
                    item.classList.remove('unread');
                });

                // Скрываем индикатор непрочитанных уведомлений
                const badge = document.querySelector('.notification-badge');
                if (badge) {
                    badge.style.display = 'none';
                }
            });
        }
    }

});
