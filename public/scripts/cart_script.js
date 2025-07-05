document.addEventListener("DOMContentLoaded", () => {
    // Настройка обработчиков событий
    function setupEventListeners() {
        // Выпадающие списки дизайнеров
        setupDesignerDropdowns();

        // Удаление товаров
        setupRemoveButtons();

        // Кнопки действий
        setupActionButtons();
    }

    // Настройка выпадающих списков дизайнеров
    function setupDesignerDropdowns() {
        const dropdown = document.getElementById(`designerDropdown1`);
        const button = document.getElementById(`designerButton1`);
        const content = document.getElementById(`designerDropdownContent1`);

        // Открытие/закрытие выпадающего списка
        button.addEventListener('click', (e) => {
            e.stopPropagation();

            // Закрываем все другие выпадающие списки
            document.querySelectorAll('.designer-dropdown').forEach(dd => {
                if (dd !== dropdown) {
                    dd.classList.remove('active');
                }
            });

            dropdown.classList.toggle('active');
        });

        // Выбор дизайнера
        content.querySelectorAll('.designer-option').forEach(option => {
            option.addEventListener('click', () => {
                const designerId = option.getAttribute('data-id');
                const designerName = option.getAttribute('data-designer');
                const bonus = parseInt(option.getAttribute('data-bonus'));
                const basePrice = parseInt(option.getAttribute('data-price'));
                const stars = parseInt(option.getAttribute('data-stars'));

                // Обновляем UI
                updateDesignerButton(designerName, bonus, stars);
                updateItemPrice(bonus, basePrice);

                // Закрываем выпадающий список
                dropdown.classList.remove('active');

                // Обновляем выбранную опцию
                content.querySelectorAll('.designer-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                option.classList.add('selected');
                // Устанавливаем значение в input
                const designerInput = document.getElementById('id_designer');
                if (designerInput) {
                    designerInput.value = designerId;
                }
            });
        });

        // Закрытие выпадающих списков при клике вне их
        document.addEventListener('click', () => {
            document.querySelectorAll('.designer-dropdown').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        });
    }

    function updateDesignerButton(name, bonus, stars) {
        const button = document.getElementById(`designerButton1`);
        const nameSpan = button.querySelector('.designer-name');
        const bonusSpan = button.querySelector('.designer-bonus');
        const starsContainer = button.querySelector('.stars');

        nameSpan.textContent = name;
        bonusSpan.textContent = `+${bonus}%`;

        // Очистим старые звезды
        starsContainer.innerHTML = '';

        // Добавим новые звезды (5 штук, активные — по количеству bonus)
        const activeStars = stars; // например: 20% => 4 звезды
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.className = 'star' + (i <= activeStars ? ' active' : '');
            star.textContent = '★';
            starsContainer.appendChild(star);
        }
    }





    // Обновление цены товара
    function updateItemPrice(bonus, basePrice) {
        const bonusAmount = Math.round(basePrice * (bonus / 100));
        const totalPrice = basePrice + bonusAmount;

        document.getElementById(`basePrice1`).textContent = `${basePrice.toLocaleString()} ₽`;
        document.getElementById(`bonusPrice1`).textContent = `+${bonusAmount.toLocaleString()} ₽`;
        document.getElementById(`totalPrice1`).textContent = `${totalPrice.toLocaleString()} ₽`;
    }

    // Настройка кнопок удаления
    function setupRemoveButtons() {
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Вы уверены, что хотите удалить этот товар из корзины?')) {
                    removeItem();
                }
            });
        });
    }

    // Удаление товара
    function removeItem() {
        setTimeout(() => {
            // Отправляем на сервер запрос на удаление
            fetch(`/client/cart/remove`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Ошибка при удалении товара');
                    }

                    // Удаляем из DOM
                    window.location.href = "/client/cart"; // Перенаправление на главную или страницу входа

                })
                .catch(err => {
                    console.error(err);
                    alert('Не удалось удалить товар');
                });
        }, 300);
    }


    // Настройка кнопок действий
    function setupActionButtons() {
        // Продолжить покупки
        document.getElementById('continueShopping').addEventListener('click', () => {
            window.location.href = '/main/';
        });

        // Оплатить
        document.getElementById('checkoutButton').addEventListener('click', () => {
            alert('Переход к оплате... (функционал в разработке)');
        });
    }


    setupEventListeners();
});