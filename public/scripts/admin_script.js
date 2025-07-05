document.addEventListener("DOMContentLoaded", () => {
  // Элементы модальных окон
  const modals = {
    categories: document.getElementById("categoriesModal"),
    services: document.getElementById("servicesModal"),
    productTypes: document.getElementById("productTypesModal"),
    users: document.getElementById("usersModal"),
    designers: document.getElementById("designersModal"),
    editProfile: document.getElementById("editProfileModal"),
  }

  // Кнопки для открытия модальных окон
  const buttons = {
    categories: document.getElementById("categoriesBtn"),
    services: document.getElementById("servicesBtn"),
    productTypes: document.getElementById("productTypesBtn"),
    users: document.getElementById("usersBtn"),
    designers: document.getElementById("designersBtn"),
    editProfile: document.getElementById("editProfileBtn"),
    logout: document.getElementById("logoutBtn"),
  }

  // Функция открытия модального окна
  function openModal(modalName) {
    const modal = modals[modalName]
    if (modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden"
    }
  }

  // Функция закрытия модального окна
  function closeModal(modalName) {
    const modal = modals[modalName]
    if (modal) {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  }

  // Функция закрытия всех модальных окон
  function closeAllModals() {
    Object.keys(modals).forEach((modalName) => {
      closeModal(modalName)
    })
  }

  // Обработчики кнопок открытия модальных окон
  buttons.categories?.addEventListener("click", () => openModal("categories"))
  buttons.services?.addEventListener("click", () => openModal("services"))
  buttons.productTypes?.addEventListener("click", () => openModal("productTypes"))
  buttons.users?.addEventListener("click", () => openModal("users"))
  buttons.designers?.addEventListener("click", () => openModal("designers"))
  buttons.editProfile?.addEventListener("click", () => openModal("editProfile"))

  // Кнопка выхода из аккаунта
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

  // Обработчики закрытия модальных окон
  document.addEventListener("click", (e) => {
    // Закрытие по клику на крестик
    if (e.target.classList.contains("close")) {
      const modalName = e.target.getAttribute("data-modal")
      if (modalName) {
        closeModal(modalName.replace("Modal", ""))
      }
    }

    // Закрытие по клику на фон
    if (e.target.classList.contains("modal")) {
      closeAllModals()
    }

    // Закрытие по кнопке отмены
    if (e.target.getAttribute("data-modal")) {
      const modalName = e.target.getAttribute("data-modal")
      closeModal(modalName.replace("Modal", ""))
    }
  })

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals()
    }
  })

  // Обработка табов
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("tab-btn")) {
      const tabName = e.target.getAttribute("data-tab")
      const modal = e.target.closest(".modal")

      // Убираем активный класс со всех табов и контента
      modal.querySelectorAll(".tab-btn").forEach((btn) => btn.classList.remove("active"))
      modal.querySelectorAll(".tab-content").forEach((content) => content.classList.remove("active"))

      // Добавляем активный класс к выбранному табу и контенту
      e.target.classList.add("active")
      modal.querySelector(`#${tabName}`).classList.add("active")
    }
  })


  document.addEventListener("change", async (e) => {
    if (e.target.classList.contains("role-select")) {
      const userId = e.target.getAttribute("data-user-id");
      const newRole = e.target.value;
      const previousIndex = e.target.getAttribute("data-previous-index") || 0;

      if (confirm(`Изменить роль пользователя на "${newRole}"?`)) {
        try {
          const res = await fetch("/admin/update-role", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ userId, newRole })
          });

          if (res.ok) {
            alert("Роль успешно обновлена");
          } else {
            alert("Ошибка при обновлении роли");
            e.target.selectedIndex = previousIndex;
          }
        } catch (err) {
          console.error("Ошибка:", err);
          alert("Ошибка соединения с сервером");
          e.target.selectedIndex = previousIndex;
        }
      } else {
        e.target.selectedIndex = previousIndex;
      }
    }
  });

  document.addEventListener("focus", (e) => {
    if (e.target.classList.contains("role-select")) {
      e.target.setAttribute("data-previous-index", e.target.selectedIndex);
    }
  });


  // Назначаем обработчик клика на все звезды
  document.querySelectorAll(".star-rating").forEach(ratingEl => {
    ratingEl.addEventListener("click", function (e) {
      if (e.target.classList.contains("star")) {
        const star = e.target;
        const newLevel = parseInt(star.dataset.value);
        const designerId = ratingEl.dataset.designerId;

        if (!designerId || !newLevel) return;

        // Подтверждение
        if (!confirm(`Изменить уровень квалификации на ${newLevel}?`)) return;

        // Отправка запроса
        fetch(`/admin/update-level`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_designer: designerId,
            id_level: newLevel
          })
        })
          .then(res => {
            if (!res.ok) throw new Error("Ошибка при обновлении");
            return res.json();
          })
          .then(data => {
            if (data.success) {
              // Обновляем визуально звезды
              const stars = ratingEl.querySelectorAll(".star");
              stars.forEach(s => {
                const value = parseInt(s.dataset.value);
                s.classList.toggle("active", value <= newLevel);
              });

              alert("Уровень успешно обновлён!");
            } else {
              alert("Не удалось обновить уровень");
            }
          })
          .catch(err => {
            console.error("Ошибка:", err);
            alert("Ошибка при отправке запроса.");
          });
      }
    });
  });




  // Поиск в таблицах
  document.addEventListener("input", (e) => {
    if (e.target.classList.contains("search-input")) {
      const searchTerm = e.target.value.toLowerCase()
      const table = e.target.closest(".modal").querySelector(".admin-table tbody")
      const rows = table.querySelectorAll("tr")

      rows.forEach((row) => {
        const text = row.textContent.toLowerCase()
        if (text.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    }
  })

  // Обновление статистики (имитация)
  function updateStats() {
    const statNumbers = document.querySelectorAll(".stat-number")
    statNumbers.forEach((stat) => {
      const currentValue = Number.parseInt(stat.textContent)
      const change = Math.floor(Math.random() * 5) - 2 // Случайное изменение от -2 до +2
      const newValue = Math.max(0, currentValue + change)
      stat.textContent = newValue
    })
  }

  // Обновление статистики каждые 30 секунд
  setInterval(updateStats, 30000)

  // Валидация форм
  document.addEventListener("input", (e) => {
    if (e.target.name === "confirmPassword") {
      const newPassword = document.getElementById("newPassword")
      const confirmPassword = e.target

      if (newPassword.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity("Пароли не совпадают")
      } else {
        confirmPassword.setCustomValidity("")
      }
    }
  })

  

  // Модальные окна редактирования
  const editModals = {
    editCategory: document.getElementById("editCategoryModal"),
    editService: document.getElementById("editServiceModal"),
    editProductType: document.getElementById("editProductTypeModal"),
  }

  // Функции для открытия форм редактирования
  function openEditCategoryModal(category) {
    if (category) {
      document.getElementById("editCategoryId").value = category.id
      document.getElementById("editCategoryName").value = category.name
      openModal("editCategory")
    }
  }

  function openEditServiceModal(service) {
    if (service) {
      document.getElementById("editServiceId").value = service.id
      document.getElementById("editServiceName").value = service.name
      document.getElementById("editServiceCategory").value = service.categoryId
      document.getElementById("editServiceDescription").value = service.description
      document.getElementById("editServicePriceFrom").value = service.price

      // Показываем текущую обложку
      const coverPreview = document.getElementById("editServiceCoverPreview")
      coverPreview.src = service.cover
      coverPreview.style.display = "block"

      openModal("editService")
    }
  }

  function openEditProductTypeModal(productType) {
    if (productType) {
      document.getElementById("editProductTypeId").value = productType.id
      document.getElementById("editProductTypeName").value = productType.name
      document.getElementById("editProductTypeService").value = productType.serviceId
      document.getElementById("editProductTypePrice").value = productType.price
      document.getElementById("editProductTypeDuration").value = productType.period
      document.getElementById("editProductTypeDescription").value = productType.description
      openModal("editProductType")
    }
  }

  // Функция для открытия модальных окон редактирования
  function openModal(modalName) {
    const modal = editModals[modalName] || modals[modalName]
    if (modal) {
      modal.classList.add("show")
      document.body.style.overflow = "hidden"
    }
  }

  // Функция для закрытия модальных окон редактирования
  function closeModal(modalName) {
    const modal = editModals[modalName] || modals[modalName]
    if (modal) {
      modal.classList.remove("show")
      document.body.style.overflow = "auto"
    }
  }

  // Обработчики закрытия для новых модальных окон
  document.addEventListener("click", (e) => {
    // Закрытие по клику на крестик для форм редактирования
    if (e.target.classList.contains("close")) {
      const modalName = e.target.getAttribute("data-modal")
      if (modalName) {
        if (modalName.includes("edit")) {
          closeModal(modalName.replace("Modal", ""))
        }
      }
    }

    // Закрытие по кнопке отмены для форм редактирования
    if (e.target.getAttribute("data-modal")) {
      const modalName = e.target.getAttribute("data-modal")
      if (modalName.includes("edit")) {
        closeModal(modalName.replace("Modal", ""))
      }
    }

    // Закрытие по клику на фон для форм редактирования
    if (e.target.classList.contains("modal")) {
      Object.keys(editModals).forEach((modalName) => {
        if (editModals[modalName] === e.target) {
          closeModal(modalName)
        }
      })
    }
  })
  /////////////////////////////////////////
  document.addEventListener("click", (e) => {
    const editBtn = e.target.closest(".btn-icon.edit");
    if (!editBtn) return;

    const row = editBtn.closest("tr");
    const modal = editBtn.closest(".modal");
    const modalId = modal ? modal.id : null;

    // Получаем все data-атрибуты из строки
    const rowData = { ...row.dataset };

    // Лог для отладки
    console.log("rowData:", rowData);

    // Универсально заполняем поля модального окна
    if (modal) {
      Object.keys(rowData).forEach((key) => {
        const input = modal.querySelector(`[name="${key}"]`);
        if (input) {
          input.value = rowData[key];
        }
      });
    }

    // Вызываем соответствующую функцию редактирования
    switch (modalId) {
      case "categoriesModal":
        openEditCategoryModal(rowData);
        break;
      case "servicesModal":
        openEditServiceModal(rowData);
        break;
      case "productTypesModal":
        openEditProductTypeModal(rowData);
        break;
      default:
        alert("Открытие формы редактирования");
    }
  });





  // Обработка загрузки новой обложки для услуги
  document.getElementById("editServiceCover")?.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const preview = document.getElementById("editServiceCoverPreview")
        preview.src = e.target.result
        preview.style.display = "block"
      }
      reader.readAsDataURL(file)
    }
  })

  // Закрытие по Escape для форм редактирования
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      Object.keys(editModals).forEach((modalName) => {
        closeModal(modalName)
      })
    }
  })
})
