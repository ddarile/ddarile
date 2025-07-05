document.addEventListener("DOMContentLoaded", () => {
  // Элементы DOM
  const filterTabs = document.querySelectorAll(".filter-tab")
  const searchInput = document.getElementById("searchOrders")
  const ordersList = document.getElementById("ordersList")
  const orderCards = document.querySelectorAll(".order-card")

  // Модальные окна
  const reviewModal = document.getElementById("reviewModal")

  // Кнопки действий
  const acceptButtons = document.querySelectorAll(".accept-order")
  const declineButtons = document.querySelectorAll(".decline-order")
  const chatButtons = document.querySelectorAll(".chat-btn")

  // Статистика
  const newOrdersCount = document.getElementById("newOrdersCount")
  const inProgressCount = document.getElementById("inProgressCount")
  const completedCount = document.getElementById("completedCount")

  // Переменные состояния
  let currentFilter = "all"
  let currentPage = 1
  const totalPages = 3

  // Инициализация
  init()

  function init() {
    setupEventListeners()
    updateOrdersDisplay()
    updateStatistics()
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
    acceptButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        acceptOrder(btn.dataset.orderId)
      })
    })

    // Убрать declineButtons обработчики и заменить на прямое удаление
    declineButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        declineOrder(btn.dataset.orderId)
      })
    })

    const chatButtons = document.querySelectorAll('[id^="chatBtn-"]');

    chatButtons.forEach(button => {
      button.addEventListener("click", function () {
        const orderId = button.dataset.orderId;
        if (orderId) {
          window.location.href = `/chats?order_id=${encodeURIComponent(orderId)}`;
        } else {
          console.error("Order ID not found");
        }
      });
    });


    // Добавить обработчики для кнопок завершения заказа
    const completeButtons = document.querySelectorAll(".complete-order")
    completeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        completeOrder(btn.dataset.orderId)
      })
    })

    // Добавить обработчики для просмотра отзывов
    const reviewButtons = document.querySelectorAll(".view-review")
    reviewButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        viewReview(btn.dataset.orderId)
      })
    })

    // Модальные окна
    setupModalEventListeners()
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

  function updateStatistics() {
    const newCount = document.querySelectorAll('.order-card[data-status="new"]').length
    const inProgressCount = document.querySelectorAll('.order-card[data-status="in-progress"]').length
    const completedCount = document.querySelectorAll('.order-card[data-status="completed"]').length
    const cancelledCount = document.querySelectorAll('.order-card[data-status="cancelled"]').length

    document.getElementById("newOrdersCount").textContent = newCount
    document.getElementById("inProgressCount").textContent = inProgressCount
    document.getElementById("completedCount").textContent = completedCount

    // Добавляем счетчик отмененных заказов если есть элемент для него
    const cancelledCountElement = document.getElementById("cancelledCount")
    if (cancelledCountElement) {
      cancelledCountElement.textContent = cancelledCount
    }
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
