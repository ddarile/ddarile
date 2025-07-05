document.addEventListener("DOMContentLoaded", () => {
  // Модальное окно редактирования профиля
  const editProfileModal = document.getElementById("editProfileModal")
  const editProfileBtn = document.getElementById("editProfileBtn")
  const closeButtons = document.querySelectorAll(".close, [data-modal]")

  // Функция открытия модального окна
  function openModal(modal) {
    modal.classList.add("show")
    document.body.style.overflow = "hidden"

    // Сброс прокрутки и фокус на первом поле
    const modalBody = modal.querySelector(".modal-body")
    if (modalBody) {
      modalBody.scrollTo({ top: 0, behavior: "smooth" })

      setTimeout(() => {
        const firstInput = modalBody.querySelector('input:not([type="hidden"]):not([type="file"])')
        if (firstInput) {
          firstInput.focus()
        }
      }, 300)
    }
  }

  // Функция закрытия модального окна
  function closeModal(modal) {
    modal.classList.remove("show")
    document.body.style.overflow = "auto"
  }

  // Открытие модального окна редактирования профиля
  editProfileBtn.addEventListener("click", () => {
    openModal(editProfileModal)
  })

  // Закрытие модальных окон
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        closeModal(editProfileModal)
      } else if (e.target.getAttribute("data-modal") === "editProfileModal") {
        closeModal(editProfileModal)
      }
    })
  })

  // Закрытие по клику на фон
  editProfileModal.addEventListener("click", (e) => {
    if (e.target === editProfileModal) {
      closeModal(editProfileModal)
    }
  })

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && editProfileModal.classList.contains("show")) {
      closeModal(editProfileModal)
    }
  })

  // Загрузка аватара
  const avatarUpload = document.getElementById("avatarUpload")
  const currentAvatarPreview = document.getElementById("currentAvatarPreview")
  const currentAvatar = document.querySelector(".current-avatar")

  currentAvatar.addEventListener("click", () => {
    avatarUpload.click()
  })

  avatarUpload.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      // Проверка типа файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение")
        return
      }

      // Проверка размера файла (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Размер файла не должен превышать 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        currentAvatarPreview.src = e.target.result
      }
      reader.readAsDataURL(file)
    }
  })

  // Переключение видимости пароля
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target")
      const passwordInput = document.getElementById(targetId)
      const isPassword = passwordInput.type === "password"

      passwordInput.type = isPassword ? "text" : "password"

      // Изменение иконки
      const svg = toggle.querySelector("svg")
      if (isPassword) {
        // Иконка "скрыть"
        svg.innerHTML = `
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                `
      } else {
        // Иконка "показать"
        svg.innerHTML = `
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                `
      }
    })
  })

  // Проверка силы пароля
  const newPasswordInput = document.getElementById("newPassword")
  const passwordStrength = document.getElementById("passwordStrength")

  newPasswordInput.addEventListener("input", () => {
    const password = newPasswordInput.value
    const strength = calculatePasswordStrength(password)

    passwordStrength.className = `password-strength ${strength}`
  })

  function calculatePasswordStrength(password) {
    if (password.length === 0) return ""
    if (password.length < 6) return "weak"

    let score = 0

    // Длина
    if (password.length >= 8) score++
    if (password.length >= 12) score++

    // Содержит цифры
    if (/\d/.test(password)) score++

    // Содержит строчные буквы
    if (/[a-z]/.test(password)) score++

    // Содержит заглавные буквы
    if (/[A-Z]/.test(password)) score++

    // Содержит специальные символы
    if (/[^A-Za-z0-9]/.test(password)) score++

    if (score < 3) return "weak"
    if (score < 4) return "medium"
    if (score < 5) return "strong"
    return "very-strong"
  }

  // Обработка отправки формы
  const profileForm = document.getElementById("profileForm")
  profileForm.addEventListener("submit", (e) => {
  // e.preventDefault()

  // const formData = new FormData(profileForm)
  // const data = Object.fromEntries(formData.entries())

  // console.log("Данные профиля:", data)

  // // Имитация сохранения
  // const submitButton = profileForm.querySelector('button[type="submit"]')
  // const originalText = submitButton.innerHTML

  // submitButton.innerHTML = `
  //         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  //             <circle cx="12" cy="12" r="3"></circle>
  //         </svg>
  //         Сохранение...
  //     `
  // submitButton.disabled = true

  // setTimeout(() => {
  //   submitButton.innerHTML = originalText
  //   submitButton.disabled = false

  //   alert("Профиль успешно обновлен!")
  //   closeModal(editProfileModal)

  //   // Обновляем имя в профиле
  //   const profileName = document.querySelector(".name-text")
  //   if (profileName && data.clientName) {
  //     profileName.textContent = data.clientName
  //   }
  // }, 2000)
  })

  // Плавная прокрутка к полям с ошибками
  function scrollToFirstError() {
    const firstError = document.querySelector(".form-group.error, .form-group input:invalid")
    if (firstError) {
      const formGroup = firstError.closest(".form-group")
      if (formGroup) {
        formGroup.scrollIntoView({
          behavior: "smooth",
          block: "center",
        })

        formGroup.style.animation = "none"
        setTimeout(() => {
          formGroup.style.animation = "shakeAndScroll 0.5s ease"
        }, 10)
      }
    }
  }

  // Обработка ошибок валидации
  document.addEventListener(
    "invalid",
    (e) => {
      if (e.target.closest(".profile-form")) {
        e.preventDefault()

        const formGroup = e.target.closest(".form-group")
        if (formGroup) {
          formGroup.classList.add("error")

          setTimeout(() => {
            formGroup.classList.remove("error")
          }, 3000)

          setTimeout(scrollToFirstError, 100)
        }
      }
    },
    true,
  )

  // JS: Подключение события выхода
const logoutBtn = document.getElementById("logoutBtn");
logoutBtn.addEventListener("click", async () => {
  if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
    try {
      const response = await fetch("/profile/logout", {
        method: "GET",
      });

      if (response.ok) {
        window.location.href = "/profile/auth"; // Перенаправление на главную или страницу входа
      } else {
        alert("Ошибка при выходе из аккаунта");
      }
    } catch (error) {
      console.error("Ошибка при запросе выхода:", error);
      alert("Произошла ошибка");
    }
  }
});


   // Кнопка истории заказов
   const orderHistoryBtn = document.getElementById("orderHistoryBtn");
   if (orderHistoryBtn) {
     orderHistoryBtn.addEventListener("click", () => {
       window.location.href = "/client/projects";
     });
   }
 // Кнопка чатов
    const chatsBtn = document.getElementById("chatsBtn");
    if (chatsBtn) {
      chatsBtn.addEventListener("click", () => {
        window.location.href = "/chats";
      });
    }
   
})
