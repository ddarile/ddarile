document.addEventListener("DOMContentLoaded", () => {
  // Элементы
  const loginBtn = document.getElementById("loginBtn")
  const registerBtn = document.getElementById("registerBtn")
  const loginModal = document.getElementById("loginModal")
  const registerModal = document.getElementById("registerModal")
  const loginClose = document.getElementById("loginClose")
  const registerClose = document.getElementById("registerClose")
  const switchToRegister = document.getElementById("switchToRegister")
  const switchToLogin = document.getElementById("switchToLogin")

  // Формы
  const loginForm = document.getElementById("loginForm")
  const registerForm = document.getElementById("registerForm")

  // Инициализация
  init()

  function init() {
    setupEventListeners()
    setupFormValidation()
    setupPasswordToggles()
    // Удаляем вызов функции проверки сложности пароля
    // setupPasswordStrength()
  }

  // Настройка обработчиков событий
  function setupEventListeners() {
    // Открытие модальных окон
    loginBtn.addEventListener("click", () => openModal(loginModal))
    registerBtn.addEventListener("click", () => openModal(registerModal))

    // Закрытие модальных окон
    loginClose.addEventListener("click", () => closeModal(loginModal))
    registerClose.addEventListener("click", () => closeModal(registerModal))

    // Переключение между формами
    switchToRegister.addEventListener("click", (e) => {
      e.preventDefault()
      closeModal(loginModal)
      setTimeout(() => openModal(registerModal), 300)
    })

    switchToLogin.addEventListener("click", (e) => {
      e.preventDefault()
      closeModal(registerModal)
      setTimeout(() => openModal(loginModal), 300)
    })

    // Закрытие по клику на фон
    loginModal.addEventListener("click", (e) => {
      if (e.target === loginModal) closeModal(loginModal)
    })

    registerModal.addEventListener("click", (e) => {
      if (e.target === registerModal) closeModal(registerModal)
    })

    // Закрытие по Escape
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeModal(loginModal)
        closeModal(registerModal)
      }
    })

    // Отправка форм
    loginForm.addEventListener("submit", handleLoginSubmit)
    registerForm.addEventListener("submit", handleRegisterSubmit)
  }

  // Открытие модального окна
  function openModal(modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }

  // Закрытие модального окна
  function closeModal(modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }

  // Настройка валидации форм
  function setupFormValidation() {
    // Email валидация
    const emailInputs = document.querySelectorAll('input[type="email"]')
    emailInputs.forEach((input) => {
      input.addEventListener("input", validateEmail)
      input.addEventListener("blur", validateEmail)
    })

    // Валидация имени
    const nameInputs = document.querySelectorAll("#registerFirstName, #registerLastName")
    nameInputs.forEach((input) => {
      input.addEventListener("input", validateName)
      input.addEventListener("blur", validateName)
    })

    // Валидация пароля - упрощаем, убираем проверку сложности
    const passwordInputs = document.querySelectorAll('input[type="password"]')
    passwordInputs.forEach((input) => {
      if (input.id !== "registerPasswordConfirm") {
        // Удаляем обработчики проверки сложности пароля
        // input.addEventListener("input", validatePassword)
        // input.addEventListener("blur", validatePassword)
      }
    })

    // Подтверждение пароля
    const confirmPassword = document.getElementById("registerPasswordConfirm")
    if (confirmPassword) {
      confirmPassword.addEventListener("input", validatePasswordConfirm)
      confirmPassword.addEventListener("blur", validatePasswordConfirm)
    }
  }

  // Валидация email
  function validateEmail(e) {
    const input = e.target
    const validation = input.parentNode.querySelector(".input-validation")
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (input.value === "") {
      setValidationState(input, validation, "", "neutral")
    } else if (emailRegex.test(input.value)) {
      setValidationState(input, validation, "Email корректен", "valid")
    } else {
      setValidationState(input, validation, "Введите корректный email", "invalid")
    }
  }

  // Валидация имени
  function validateName(e) {
    const input = e.target
    const validation = input.parentNode.querySelector(".input-validation")

    if (input.value === "") {
      setValidationState(input, validation, "", "neutral")
    } else if (input.value.length < 2) {
      setValidationState(input, validation, "Минимум 2 символа", "invalid")
    } else if (!/^[а-яёa-z\s-]+$/i.test(input.value)) {
      setValidationState(input, validation, "Только буквы, пробелы и дефисы", "invalid")
    } else {
      setValidationState(input, validation, "Корректно", "valid")
    }
  }


  // Валидация подтверждения пароля
  function validatePasswordConfirm(e) {
    const input = e.target
    const validation = input.parentNode.querySelector(".input-validation")
    const password = document.getElementById("registerPassword").value

    if (input.value === "") {
      setValidationState(input, validation, "", "neutral")
    } else if (input.value !== password) {
      setValidationState(input, validation, "Пароли не совпадают", "invalid")
    } else {
      setValidationState(input, validation, "Пароли совпадают", "valid")
    }
  }

  // Установка состояния валидации
  function setValidationState(input, validation, message, state) {
    validation.textContent = message
    validation.className = `input-validation ${state}`
    input.className = `form-input ${state}`
  }

  // Настройка переключателей пароля
  function setupPasswordToggles() {
    const toggles = document.querySelectorAll(".password-toggle")

    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const input = toggle.parentNode.querySelector(".form-input")
        const eyeOpen = toggle.querySelector(".eye-open")
        const eyeClosed = toggle.querySelector(".eye-closed")

        if (input.type === "password") {
          input.type = "text"
          eyeOpen.style.display = "none"
          eyeClosed.style.display = "block"
        } else {
          input.type = "password"
          eyeOpen.style.display = "block"
          eyeClosed.style.display = "none"
        }
      })
    })
  }

  // Удаляем функцию setupPasswordStrength полностью
  // function setupPasswordStrength() { ... }

  // Обработка отправки формы входа
  async function handleLoginSubmit(e) {

    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    // Валидация
    if (!email || !password) {
      showNotification("Заполните все поля", "error")
      return
    }

  }

  // Обработка отправки формы регистрации
  async function handleRegisterSubmit(e) {

    const firstName = document.getElementById("registerFirstName").value
    const email = document.getElementById("registerEmail").value
    const password = document.getElementById("registerPassword").value
    const passwordConfirm = document.getElementById("registerPasswordConfirm").value

    // Валидация
    if (!firstName || !email || !password || !passwordConfirm) {
      showNotification("Заполните все обязательные поля", "error")
      return
    }

    if (password !== passwordConfirm) {
      showNotification("Пароли не совпадают", "error")
      return
    }


  }

  // Показ уведомлений
  function showNotification(message, type = "info") {
    // Удаляем предыдущие уведомления
    const existingNotifications = document.querySelectorAll(".notification")
    existingNotifications.forEach((notification) => notification.remove())

    const notification = document.createElement("div")
    notification.className = `notification notification-${type}`
    notification.textContent = message

    const colors = {
      success: "#4CAF50",
      error: "#f44336",
      info: "#f0a4e2",
      warning: "#ff9800",
    }

    notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        `

    document.body.appendChild(notification)

    // Показываем уведомление
    setTimeout(() => {
      notification.style.transform = "translateX(0)"
    }, 100)

    // Скрываем уведомление
    setTimeout(() => {
      notification.style.transform = "translateX(100%)"
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove()
        }
      }, 300)
    }, 4000)
  }

  // Имитация API-запроса
  function simulateApiCall() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000)
    })
  }

  // Запускаем анимацию загрузки
  animateOnLoad()
})
