document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const filterTabs = document.querySelectorAll(".filter-tab")
  const searchInput = document.getElementById("searchOrders")
  const orderCards = document.querySelectorAll(".order-card")

  // Модальные окна
  const reviewModal = document.getElementById("reviewModal")
  const leaveReviewModal = document.getElementById("leaveReviewModal")

  // Кнопки действий
  const chatButtons = document.querySelectorAll(".chat-btn")
  const leaveReviewButtons = document.querySelectorAll(".leave-review")
  const viewReviewButtons = document.querySelectorAll(".view-review")

  // Переменные состояния
  let currentFilter = "all"
  let currentPage = 1
  const totalPages = 3
  let selectedRating = 0

  // Инициализация
  init()

  function init() {
    setupEventListeners()
    updateOrdersDisplay()
  }

  function setupEventListeners() {
    // Фильтры
    filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        setActiveFilter(tab.dataset.status)
      })
    })

    // Поиск
    searchInput.addEventListener("input", debounce(handleSearch, 300))

    // Кнопки действий
    chatButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        openChat(btn.dataset.orderId)
      })
    })

    leaveReviewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        openLeaveReviewModal(btn.dataset.orderId)
      })
    })

    viewReviewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewReview(btn.dataset.orderId)
      })
    })

    // Модальные окна
    setupModalEventListeners()
    setupReviewFormEventListeners()
  }

  function setupModalEventListeners() {
    // Закрытие модальных окон
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        closeAllModals()
      }
      if (e.target.classList.contains("modal")) {
        closeAllModals()
      }
    })

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeAllModals()
      }
    })
  }

  function setupReviewFormEventListeners() {
    // Рейтинг звездочки
    const starInputs = document.querySelectorAll(".star-input")
    starInputs.forEach((star) => {
      star.addEventListener("click", () => {
        selectedRating = Number.parseInt(star.dataset.rating)
        updateStarRating()
      })

      star.addEventListener("mouseenter", () => {
        const rating = Number.parseInt(star.dataset.rating)
        highlightStars(rating)
      })
    })

    // Восстановление рейтинга при уходе мыши
    document.getElementById("ratingInput").addEventListener("mouseleave", () => {
      updateStarRating()
    })



    // Кнопка отмены
    document.getElementById("cancelReview").addEventListener("click", () => {
      closeAllModals()
    })
  }

  function updateStarRating() {
    const starInputs = document.querySelectorAll(".star-input")
    starInputs.forEach((star, index) => {
      if (index < selectedRating) {
        star.classList.add("active")
      } else {
        star.classList.remove("active")
      }
    })
  }

  document.querySelectorAll(".star-input").forEach((star) => {
    star.addEventListener("click", () => {
      selectedRating = parseInt(star.dataset.rating)
      document.getElementById("ratingValue").value = selectedRating
      updateStarRating()
    })

    star.addEventListener("mouseover", () => {
      highlightStars(parseInt(star.dataset.rating))
    })

    star.addEventListener("mouseout", () => {
      updateStarRating()
    })
  })


  function highlightStars(rating) {
    const starInputs = document.querySelectorAll(".star-input")
    starInputs.forEach((star, index) => {
      if (index < rating) {
        star.classList.add("active")
      } else {
        star.classList.remove("active")
      }
    })
  }

  // Фильтрация заказов
  function setActiveFilter(status) {
    currentFilter = status
    currentPage = 1

    // Обновляем активную вкладку
    filterTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.status === status)
    })

    updateOrdersDisplay()
    updatePagination()
  }

  function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase()

    orderCards.forEach((card) => {
      const orderNumber = card.querySelector(".order-number").textContent.toLowerCase()
      const clientName = card.querySelector(".order-client").textContent.toLowerCase()
      const serviceName = card.querySelector(".order-service").textContent.toLowerCase()

      const matches =
        orderNumber.includes(searchTerm) || clientName.includes(searchTerm) || serviceName.includes(searchTerm)

      card.style.display = matches ? "block" : "none"
    })
  }

  function updateOrdersDisplay() {
    orderCards.forEach((card) => {
      const cardStatus = card.dataset.status
      let shouldShow = false

      if (currentFilter === "all") {
        // В разделе "Все заказы" показываем все кроме отмененных
        shouldShow = cardStatus !== "cancelled"
      } else {
        // В остальных разделах показываем только соответствующие статусы
        shouldShow = cardStatus === currentFilter
      }

      card.style.display = shouldShow ? "block" : "none"
    })
  }

  function updatePagination() {
    // Обновить обработчики пагинации
    const paginationButtons = document.querySelectorAll(".pagination-button")

    paginationButtons.forEach((button) => {
      button.addEventListener("click", function () {
        paginationButtons.forEach((btn) => btn.classList.remove("active"))

        if (!this.querySelector("svg")) {
          this.classList.add("active")
          const page = this.textContent.trim()
          if (page && !isNaN(page)) {
            loadPage(Number.parseInt(page))
          }
        } else {
          // Кнопка "Следующая"
          const activePage = document.querySelector(".pagination-button.active")
          if (activePage) {
            const nextPage = Number.parseInt(activePage.textContent) + 1
            loadPage(nextPage)

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
  }

  // Действия с заказами
  function openChat(orderId) {
    console.log(`Opening chat for order ${orderId}`)
    // Здесь будет переход к чату
    alert(`Переход в чат для заказа ${orderId}`)
  }

  function openLeaveReviewModal(orderId) {
    selectedRating = 0
    updateStarRating()
    document.getElementById("reviewTextInput").value = ""
    document.getElementById("reviewProjectId").value = orderId // передаём id_project
    leaveReviewModal.classList.add("show")
  }




  function viewReview(orderId) {
    const reviewModal = document.getElementById("reviewModal")
    const reviewRating = document.getElementById("reviewRating")
    const reviewText = document.getElementById("reviewText")

    const button = document.querySelector(`.view-review[data-order-id="${orderId}"]`)
    if (!button) return

    const rating = parseInt(button.dataset.feedbackRating)
    const text = button.dataset.feedbackText || ""

    // Обновляем звезды
    const stars = reviewRating.querySelectorAll(".star")
    stars.forEach((star, index) => {
      star.classList.toggle("active", index < rating)
    })

    // Обновляем текст отзыва
    reviewText.textContent = text
    reviewText.className = "review-text"
    reviewRating.style.display = "block"

    // Показываем модалку
    reviewModal.classList.add("show")
  }


  function closeAllModals() {
    reviewModal.classList.remove("show")
    leaveReviewModal.classList.remove("show")
  }

  // Утилиты
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  function loadPage(page) {
    // Placeholder for loadPage function
    console.log(`Loading page ${page}`)
  }


  console.log("Designer Orders page loaded successfully")
})


