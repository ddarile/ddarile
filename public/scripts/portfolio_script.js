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
    // Получаем выбранные типы проектов
    const selectedTypes = Array.from(document.querySelectorAll(".filter-checkbox input:checked")).map(
      (checkbox) => checkbox.value,
    )

    // Закрываем выпадающий список
    filtersDropdown.classList.remove("show")
    filtersButton.classList.remove("active")

    // Применяем фильтрацию
    if (selectedTypes.length > 0) {
      console.log("Применяем фильтры:", selectedTypes)
      // Здесь будет логика фильтрации карточек проектов по выбранным типам
      filterProjectsByTypes(selectedTypes)
    } else {
      console.log("Фильтры сброшены, показываем все проекты")
      // Показываем все проекты, если фильтры не выбраны
      showAllProjects()
    }
  })

  // Функция для фильтрации проектов по типам (заглушка)
  function filterProjectsByTypes(types) {
    // Здесь будет реальная логика фильтрации
    // Например, скрытие/показ карточек проектов в зависимости от выбранных типов

    // Имитация фильтрации - скрываем случайные карточки
    const portfolioCards = document.querySelectorAll(".portfolio-card")
    portfolioCards.forEach((card) => {
      // Для демонстрации: показываем карточку с вероятностью 50%, если выбраны фильтры
      card.style.display = Math.random() > 0.5 ? "block" : "none"
    })
  }

  // Функция для отображения всех проектов
  function showAllProjects() {
    // Показываем все карточки проектов
    const portfolioCards = document.querySelectorAll(".portfolio-card")
    portfolioCards.forEach((card) => {
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

      // Здесь можно добавить логику фильтрации проектов
      // Например, получить категорию из data-атрибута и отфильтровать карточки
      const category = this.textContent.trim().toLowerCase()
      filterPortfolioByCategory(category)
    })
  })

  // Функция для фильтрации проектов по категории (заглушка)
  function filterPortfolioByCategory(category) {
    console.log(`Фильтрация по категории: ${category}`)
    // Здесь будет логика фильтрации карточек проектов
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
      // Например, получить номер страницы и загрузить соответствующие проекты
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
    // Здесь будет логика загрузки проектов для выбранной страницы
  }

  // Модальное окно для просмотра портфолио
  const portfolioModal = document.getElementById("portfolioModal")
  const portfolioModalClose = document.getElementById("portfolioModalClose")
  const portfolioCards = document.querySelectorAll(".portfolio-card")

  // Данные проектов
  const projectsData = {
    project1: {
      title: "BRANDUP",
      designer: "Дарья",
      rating: 5,
      description: `<p>В рамках проекта "BrandUP" я занималась редизайном веб-сайта для компани, занимающейся производством мебели и других предметов интерьера для дома и офиса.</p>
      <p>Работа включала создание логотипа, подбор фирменных цветов, типографики и оформление брендбука. Дополнительно я разработала макеты визиток и шаблон для презентаций. Особенное внимание уделялось цифровому применению дизайна, поэтому решения были адаптированы под разные форматы — от сайта до мобильных приложений.</p>
      <p>Проект позволил мне глубже проработать тему минималистичного дизайна и укрепить навыки системной работы с визуальным стилем бренда.</p>`,
      gallery: [
        { src: "pictures/main.png", alt: "Логотип BrandUP", fullWidth: true },
        { src: "pictures/main.png", alt: "Цветовая палитра" },
        { src: "pictures/main.png", alt: "Типографика" },
        { src: "pictures/main.png", alt: "Применение бренда", fullWidth: true },
      ],
    },
    project2: {
      title: "ECOLIFE",
      designer: "Михаил Петров",
      rating: 5,
      description: `<p>Проект "ECOLIFE" представляет собой разработку визуальной идентичности для экологического стартапа, занимающегося производством биоразлагаемой упаковки. Основной задачей было создать современный, экологичный и привлекательный образ бренда.</p>
      <p>В рамках проекта я разработал логотип, фирменный стиль, упаковку продукции и маркетинговые материалы. Особое внимание было уделено экологичности и натуральности в визуальных решениях, использованию природных текстур и органических форм.</p>
      <p>Проект позволил мне углубить знания в области экологического дизайна и разработать комплексное брендинговое решение, которое отражает ценности и миссию компании.</p>`,
      gallery: [
        { src: "pictures/main.png", alt: "Логотип ECOLIFE", fullWidth: true },
        { src: "pictures/main.png", alt: "Упаковка продукции" },
        { src: "pictures/main.png", alt: "Маркетинговые материалы" },
        { src: "pictures/main.png", alt: "Применение бренда", fullWidth: true },
      ],
    },
    project3: {
      title: "TECHWAVE",
      designer: "Елена Соколова",
      rating: 4,
      description: `<p>Проект "TECHWAVE" был направлен на создание современного и технологичного визуального стиля для IT-компании, специализирующейся на разработке программного обеспечения. Главной задачей было разработать узнаваемый бренд, который бы отражал инновационность и профессионализм компании.</p>
      <p>В ходе работы я создала логотип, фирменный стиль, веб-дизайн корпоративного сайта и шаблоны для презентаций. Дизайн основан на использовании градиентов, геометрических форм и современной типографики, что создает ощущение технологичности и динамичности.</p>
      <p>Этот проект позволил мне расширить опыт в создании цифровых продуктов и разработке комплексных брендинговых решений для технологических компаний.</p>`,
      gallery: [
        { src: "pictures/main.png", alt: "Логотип TECHWAVE", fullWidth: true },
        { src: "pictures/main.png", alt: "Веб-дизайн" },
        { src: "pictures/main.png", alt: "Презентация" },
        { src: "pictures/main.png", alt: "Применение бренда", fullWidth: true },
      ],
    },
  }

  // Функция открытия модального окна
  function openPortfolioModal(projectId) {
    const projectData = projectsData[projectId] || projectsData["project1"] // По умолчанию первый проект

    // Заполняем данные в модальном окне
    document.getElementById("portfolioModalTitle").textContent = projectData.title
    document.getElementById("designerName").textContent = projectData.designer

    // Формируем звездный рейтинг
    const stars = "★".repeat(projectData.rating) + "☆".repeat(5 - projectData.rating)
    document.getElementById("designerRating").textContent = stars

    // Заполняем описание
    document.getElementById("portfolioDescription").innerHTML = projectData.description

    // Заполняем галерею
    const galleryHTML = projectData.gallery
      .map(
        (item) => `
      <div class="gallery-item ${item.fullWidth ? "full-width" : ""}">
        <img src="${item.src}" alt="${item.alt}">
      </div>
    `,
      )
      .join("")

    document.getElementById("portfolioGallery").innerHTML = galleryHTML

    // Показываем модальное окно
    portfolioModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  // Функция закрытия модального окна
  function closePortfolioModal() {
    portfolioModal.classList.remove("show")
    document.body.style.overflow = "auto"
  }

  // Обработчики событий для карточек портфолио
  portfolioCards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      e.preventDefault()
      // Используем индекс как идентификатор проекта для демонстрации
      const projectId = `project${(index % 3) + 1}`
      openPortfolioModal(projectId)
    })
  })

  // Обработчик закрытия модального окна
  portfolioModalClose.addEventListener("click", closePortfolioModal)

  // Закрытие по клику на фон
  portfolioModal.addEventListener("click", (e) => {
    if (e.target === portfolioModal) {
      closePortfolioModal()
    }
  })

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && portfolioModal.classList.contains("show")) {
      closePortfolioModal()
    }
  })
})
