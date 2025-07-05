document.addEventListener("DOMContentLoaded", () => {
    // Функционал для выпадающего списка фильтров
    const filtersButton = document.getElementById("filtersButton")
    const filtersDropdown = document.getElementById("filtersDropdown")
    const clearFiltersButton = document.getElementById("clearFilters")
    const applyFiltersButton = document.getElementById("applyFilters")
    const filterCheckboxes = document.querySelectorAll(".filter-checkbox input")
  
    // Счетчик выбранных фильтров
    let selectedFiltersCount = 0
  
    // Открытие/закрытие выпадающего списка фильтров
    filtersButton.addEventListener("click", function () {
      filtersDropdown.classList.toggle("show")
      this.classList.toggle("active")
  
      // Закрываем выпадающий список при клике вне его
      document.addEventListener("click", function closeDropdown(e) {
        if (!filtersDropdown.contains(e.target) && e.target !== filtersButton) {
          filtersDropdown.classList.remove("show")
          filtersButton.classList.remove("active")
          document.removeEventListener("click", closeDropdown)
        }
      })
    })
  
    // Обработка изменения состояния чекбоксов
    filterCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        // Обновляем счетчик выбранных фильтров
        selectedFiltersCount = document.querySelectorAll(".filter-checkbox input:checked").length
  
        // Обновляем текст кнопки фильтров
        filtersButton.innerHTML = `ФИЛЬТРЫ (${selectedFiltersCount})
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>`
      })
    })
  
    // Очистка всех фильтров
    clearFiltersButton.addEventListener("click", () => {
      filterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false
      })
  
      // Сбрасываем счетчик и обновляем текст кнопки
      selectedFiltersCount = 0
      filtersButton.innerHTML = `ФИЛЬТРЫ (0)
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>`
    })
  
    // Применение фильтров
    applyFiltersButton.addEventListener("click", () => {
      // Получаем выбранные фильтры
      const selectedSpecializations = Array.from(
        document.querySelectorAll(".filter-section:first-child .filter-checkbox input:checked"),
      ).map((checkbox) => checkbox.value)
  
      const selectedExperience = Array.from(
        document.querySelectorAll(".filter-section:last-child .filter-checkbox input:checked"),
      ).map((checkbox) => checkbox.value)
  
      // Закрываем выпадающий список
      filtersDropdown.classList.remove("show")
      filtersButton.classList.remove("active")
  
      // Применяем фильтрацию
      if (selectedSpecializations.length > 0 || selectedExperience.length > 0) {
        console.log("Применяем фильтры по специализации:", selectedSpecializations)
        console.log("Применяем фильтры по опыту:", selectedExperience)
        // Здесь будет логика фильтрации карточек команды по выбранным критериям
        filterTeamByFilters(selectedSpecializations, selectedExperience)
      } else {
        console.log("Фильтры сброшены, показываем всех специалистов")
        // Показываем всех специалистов, если фильтры не выбраны
        showAllTeamMembers()
      }
    })
  
    // Функция для фильтрации команды по критериям (заглушка)
    function filterTeamByFilters(specializations, experience) {
      // Здесь будет реальная логика фильтрации
      // Например, скрытие/показ карточек команды в зависимости от выбранных критериев
  
      // Для демонстрации просто выводим в консоль
      console.log(`Фильтрация команды по специализациям: ${specializations.join(", ")}`)
      console.log(`Фильтрация команды по опыту: ${experience.join(", ")}`)
  
      // Имитация фильтрации - скрываем случайные карточки
      const teamCards = document.querySelectorAll(".team-card")
      teamCards.forEach((card) => {
        // Для демонстрации: показываем карточку с вероятностью 60%, если выбраны фильтры
        card.style.display = Math.random() > 0.4 ? "block" : "none"
      })
    }
  
    // Функция для отображения всех членов команды
    function showAllTeamMembers() {
      // Показываем все карточки команды
      const teamCards = document.querySelectorAll(".team-card")
      teamCards.forEach((card) => {
        card.style.display = "block"
      })
    }
  
    // Функционал для фильтров категорий
    const filterButtons = document.querySelectorAll(".filter-button")
  
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Удаляем активный класс у всех кнопок
        filterButtons.forEach((btn) => btn.classList.remove("active"))
  
        // Добавляем активный класс нажатой кнопке
        this.classList.add("active")
  
        // Здесь можно добавить логику фильтрации команды
        // Например, получить категорию из data-атрибута и отфильтровать карточки
        const category = this.textContent.trim().toLowerCase()
        filterTeamByCategory(category)
      })
    })
  
    // Функция для фильтрации команды по категории (заглушка)
    function filterTeamByCategory(category) {
      console.log(`Фильтрация по категории: ${category}`)
      // Здесь будет логика фильтрации карточек команды
    }
  
    // Функционал для пагинации
    const paginationButtons = document.querySelectorAll(".pagination-button")
  
    paginationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Удаляем активный класс у всех кнопок
        paginationButtons.forEach((btn) => btn.classList.remove("active"))
  
        // Добавляем активный класс нажатой кнопке
        if (!this.querySelector("svg")) {
          // Не добавляем класс active для кнопки "Следующая"
          this.classList.add("active")
        }
  
        // Здесь можно добавить логику пагинации
        // Например, получить номер страницы и загрузить соответствующих специалистов
        const page = this.textContent.trim()
        if (page && !isNaN(page)) {
          loadPage(Number.parseInt(page))
        } else {
          // Если это кнопка "Следующая"
          const activePage = document.querySelector(".pagination-button.active")
          if (activePage) {
            const nextPage = Number.parseInt(activePage.textContent) + 1
            loadPage(nextPage)
  
            // Обновляем активную кнопку
            paginationButtons.forEach((btn) => {
              if (btn.textContent.trim() == nextPage) {
                btn.classList.add("active")
              } else {
                btn.classList.remove("active")
              }
            })
          }
        }
      })
    })
  
    // Функция для загрузки страницы (заглушка)
    function loadPage(page) {
      console.log(`Загрузка страницы: ${page}`)
      // Здесь будет логика загрузки специалистов для выбранной страницы
    }
  
    // Анимация для карточек команды
    const teamCards = document.querySelectorAll(".team-card")
  
    teamCards.forEach((card) => {
      // Добавляем интерактивность при наведении
      card.addEventListener("mouseenter", function () {
        // Создаем эффект частиц при наведении
        createParticles(this)
      })
    })
  })
  