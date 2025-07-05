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
    // Получаем выбранные типы продукции
    const selectedTypes = Array.from(document.querySelectorAll(".filter-checkbox input:checked")).map(
      (checkbox) => checkbox.value,
    )

    // Закрываем выпадающий список
    filtersDropdown.classList.remove("show")
    filtersButton.classList.remove("active")

    // Применяем фильтрацию
    if (selectedTypes.length > 0) {
      // Здесь будет логика фильтрации карточек услуг по выбранным типам
      filterServicesByTypes(selectedTypes)
    } else {
      // Показываем все услуги, если фильтры не выбраны
      showAllServices()
    }
  })

  function filterServicesByTypes(selectedTypes) {
  const serviceCards = document.querySelectorAll(".service-card")

  serviceCards.forEach((card) => {
    // Получаем JSON с типами продукции из data-pricing
    const pricingJson = card.getAttribute("data-pricing")
    let pricing = []

    try {
      pricing = JSON.parse(pricingJson)
    } catch (err) {
      console.error("Ошибка разбора pricing:", err)
    }

    // Проверяем, есть ли пересечение между выбранными фильтрами и типами у услуги
    const hasMatchingType = pricing.some(p =>
      selectedTypes.includes(p.label.toLowerCase())
    )

    if (hasMatchingType) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}


  // Функция для отображения всех услуг
  function showAllServices() {
    // Показываем все карточки услуг
    const serviceCards = document.querySelectorAll(".service-card")
    serviceCards.forEach((card) => {
      card.style.display = "block"
    })
  }



  // Функционал для фильтров
  const filterButtons = document.querySelectorAll(".filter-button")

filterButtons.forEach((button) => {
  button.addEventListener("click", function () {
    filterButtons.forEach((btn) => btn.classList.remove("active"))
    this.classList.add("active")

    const category = this.getAttribute("data-id").toLowerCase()
    filterServices(category)
  })
})


function filterServices(category) {
  const allCards = document.querySelectorAll(".service-card")

  if (category === "все услуги" || category === "all") {
    allCards.forEach(card => card.style.display = "block")
    return
  }

  allCards.forEach(card => {
    const typeIds = card.getAttribute("data-type-ids")?.split(",") || []
    if (typeIds.includes(category)) {
      card.style.display = "block"
    } else {
      card.style.display = "none"
    }
  })
}




  /////////////////////////////////////////////////////////////////////////////////////////
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
      // Например, получить номер страницы и загрузить соответствующие услуги



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
    // Здесь будет логика загрузки услуг для выбранной страницы
  }

  // Модальное окно для детального просмотра услуги
  const serviceModal = document.getElementById("serviceModal")
  const serviceModalClose = document.getElementById("serviceModalClose")
  const serviceCards = document.querySelectorAll(".service-card")

  // Функция обновления описания типа продукции
  function updateProductTypeDescription(serviceData, selectedOptionId) {
    const productTypeText = document.getElementById("productTypeText")
    const productTypeDescription = document.getElementById("productTypeDescription")
    console.log(serviceData)
    console.log(selectedOptionId)


    const selectedOption = serviceData.pricing.find(
          (option) => option.id.toString() === selectedOptionId.toString()
        )
    if (selectedOption && selectedOption.description) {
      productTypeText.textContent = selectedOption.description
      productTypeDescription.classList.add("show")
    } else {
      productTypeText.textContent = "Выберите тип продукции для просмотра подробного описания."
      productTypeDescription.classList.remove("show")
    }
  }

  // Функция открытия модального окна
  function openServiceModal(serviceData) {
    if (!serviceData) return

    // Заполняем данные в модальном окне
document.querySelector("#servicePreview img").src = serviceData.service;
    console.log(serviceData.service)
    document.getElementById("serviceModalTitle").textContent = serviceData.title
    document.getElementById("serviceModalDescription").innerHTML = `<p>${serviceData.description}</p>`

    // Заполняем варианты ценообразования
    const pricingOptions = document.getElementById("pricingOptions")
    pricingOptions.innerHTML = serviceData.pricing
      .map(
        (option) => `
      <div class="pricing-option ${option.selected ? "selected" : ""}">
        <div class="pricing-radio">
          <input type="radio" id="${option.id}" name="pricing" value="${option.id}" ${option.selected ? "checked" : ""}>
          <label for="${option.id}">${option.label} + ${option.price}₽</label>
        </div>
      </div>
    `,
      )
      .join("")

    // Устанавливаем начальную цену
    const selectedOption = serviceData.pricing.find((option) => option.selected)
    document.getElementById("totalPrice").textContent =
      `${parseInt(selectedOption.price) + parseInt(serviceData.price)} ₽`;

    // Устанавливаем ID выбранного типа услуги в data-атрибут кнопки
    document.getElementById("orderButton").setAttribute("data-product-id", selectedOption.id)

    // Обновляем описание типа продукции для выбранной опции
    updateProductTypeDescription(serviceData, selectedOption.id)

    // Показываем модальное окно
    serviceModal.classList.add("show")
    document.body.style.overflow = "hidden"

    // Добавляем обработчики для радиокнопок
    setupPricingHandlers(serviceData)
  }

  // Функция настройки обработчиков ценообразования
  function setupPricingHandlers(serviceData) {
    const pricingRadios = document.querySelectorAll('input[name="pricing"]')
    const pricingOptions = document.querySelectorAll(".pricing-option")
    const orderButton = document.getElementById("orderButton")

    pricingRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        // Обновляем выбранную опцию
        pricingOptions.forEach((option) => option.classList.remove("selected"))
        radio.closest(".pricing-option").classList.add("selected")

        // Обновляем цену
        const selectedOption = serviceData.pricing.find(
          (option) => option.id.toString() === radio.value
        )
        document.getElementById("totalPrice").textContent =
          `${parseInt(selectedOption.price) + parseInt(serviceData.price)} ₽`;
        // Обновляем описание типа продукции
        orderButton.setAttribute("data-product-id", selectedOption.id)

        updateProductTypeDescription(serviceData, radio.value)
      })
    })

    // Обработчики клика по опциям
    pricingOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const radio = option.querySelector('input[type="radio"]')
        radio.checked = true
        radio.dispatchEvent(new Event("change"))
      })
    })
  }



  document.getElementById("orderButton").addEventListener("click", async () => {
  const productId = document.getElementById("orderButton").getAttribute("data-product-id")

  if (!productId) return alert("Вы не выбрали тип продукции")

  try {
    const response = await fetch("/profile/select-product", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ productId })
    })

    const data = await response.json()

    if (response.status === 401 && data.redirect) {
      // Пользователь не авторизован — перенаправляем вручную
      window.location.href = data.redirect
    } else if (response.ok) {
      alert("Добавлено в корзину!")
    } else {
      alert(data.error || "Ошибка при сохранении выбранного типа услуги")
    }

  } catch (error) {
    console.error("Ошибка при отправке запроса:", error)
    alert("Сервер недоступен")
  }
})



  // Функция закрытия модального окна
  function closeServiceModal() {
    serviceModal.classList.remove("show")
    document.body.style.overflow = "auto"
  }

  // Обработчики событий для карточек услуг
  serviceCards.forEach((card) => {

    card.addEventListener("click", (e) => {
      card.addEventListener("click", (e) => {
        e.preventDefault()


        const title = card.dataset.title
        const description = card.dataset.description
        const pricingRaw = card.dataset.pricing
        const price = card.dataset.price
        const service = card.dataset.service

        if (!title || !pricingRaw) return

        let pricing
        try {
          pricing = JSON.parse(pricingRaw)
        } catch (err) {
          console.error("Ошибка парсинга pricing:", err)
          return
        }
        console.log(pricing)

        // Выделим первую опцию как выбранную
        if (pricing.length > 0) pricing[0].selected = true

        openServiceModal({
          title,
          description,
          price,
          pricing,
          service
        })
      })
    })
  })

  // Обработчик закрытия модального окна
  serviceModalClose.addEventListener("click", closeServiceModal)

  // Закрытие по клику на фон
  serviceModal.addEventListener("click", (e) => {
    if (e.target === serviceModal) {
      closeServiceModal()
    }
  })

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && serviceModal.classList.contains("show")) {
      closeServiceModal()
    }
  })

  
 

})
