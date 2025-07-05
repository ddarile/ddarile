document.addEventListener("DOMContentLoaded", () => {
  // ===== ЭЛЕМЕНТЫ МОДАЛЬНЫХ ОКОН =====
  const portfolioModal = document.getElementById("portfolioModal")
  const portfolioModalClose = document.getElementById("portfolioModalClose")
  const addPortfolioModal = document.getElementById("addPortfolioModal")
  const editPortfolioModal = document.getElementById("editPortfolioModal")
  const editProfileModal = document.getElementById("editProfileModal")
  const addPortfolioBtn = document.getElementById("addPortfolioBtn")
  const editProfileBtn = document.getElementById("editProfileBtn")
  const portfolioCards = document.querySelectorAll(".portfolio-card")
  const editButtons = document.querySelectorAll(".edit-btn")
  const deleteButtons = document.querySelectorAll(".delete-btn")
  const filterButtons = document.querySelectorAll(".filter-button")
  const closeButtons = document.querySelectorAll(".close, [data-modal]")



  // ===== ОБЩИЕ ФУНКЦИИ ДЛЯ МОДАЛЬНЫХ ОКОН =====

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

  // ===== ФУНКЦИИ ДЛЯ МОДАЛЬНОГО ОКНА ПРОСМОТРА ПОРТФОЛИО =====

  
  // Функция открытия модального окна просмотра портфолио
  function openPortfolioModal(projectId) {
    const projectData = projectsData[projectId]
    if (!projectData) return

    // Заполняем данные в модальном окне
    document.getElementById("portfolioModalTitle").textContent = projectData.title
    document.getElementById("designerName").textContent = projectData.designer

    // Формируем звездный рейтинг
    const stars = "★".repeat(projectData.rating) + "☆".repeat(5 - projectData.rating)
    document.getElementById("designerRating").textContent = stars

    // Заполняем описание
    document.getElementById("portfolioDescription").innerHTML = projectData.description

    console.log(projectData.cover)
    // Добавляем обложку первым элементом
    const galleryHTML = `
      <div class="gallery-item full-width">
        <img src="${projectData.cover}" alt="Обложка проекта">
      </div>
    ` + projectData.gallery
      .map(item => `
        <div class="gallery-item ${item.fullWidth ? "full-width" : ""}">
          <img src="${item.src}" alt="${item.alt}">
        </div>
      `)
      .join("");
      
    // Вставляем HTML в галерею

    document.getElementById("portfolioGallery").innerHTML = galleryHTML

    // Показываем модальное окно
    portfolioModal.classList.add("show")
    document.body.style.overflow = "hidden"
  }

  function openPortfolioModal(cardElement) {
  const title = cardElement.dataset.title || 'Без названия'
  const description = cardElement.dataset.description || 'Нет описания'
  const galleryData = JSON.parse(cardElement.dataset.gallery || '[]')
  const coverImage = cardElement.dataset.cover

  // Предположим, данные о дизайнере ты получаешь и рендеришь в data-атрибутах (это самый безопасный способ)
  const designerName = cardElement.dataset.designerName || 'Неизвестный дизайнер'
  const designerRating = parseInt(cardElement.dataset.designerRating || '0')
  const designerDescription = cardElement.dataset.designerDescription || 'Описание отсутствует'
  const designerAvatar = cardElement.dataset.designerAvatar || '/images/default-avatar.png'

  // Название проекта
  document.getElementById("portfolioModalTitle").textContent = title

  // Имя дизайнера
  document.getElementById("designerName").textContent = designerName

  // Описание дизайнера
  document.getElementById("designerDescription").textContent = designerDescription

  // Фото дизайнера
  const designerImg = document.getElementById("designerAvatar")
  if (designerImg) {
    designerImg.src = designerAvatar
    designerImg.alt = `Аватар ${designerName}`
  }

  // Звёздный рейтинг
  const stars = "★".repeat(designerRating) + "☆".repeat(5 - designerRating)
  document.getElementById("designerRating").textContent = stars

  // Описание проекта
  document.getElementById("portfolioDescription").innerHTML = description

  const galleryHTML = `
    <div class="gallery-item full-width" id="fullWidth">
      <img src="${coverImage}" alt="Обложка проекта">
    </div>
  ` + galleryData.map(image => `
    <div class="gallery-item">
      <img src="${image.work_path}" alt="Работа">
    </div>
  `).join("")
  

  document.getElementById("portfolioGallery").innerHTML = galleryHTML

  // Показываем модалку
  const portfolioModal = document.getElementById("portfolioModal")
  portfolioModal.classList.add("show")
  document.body.style.overflow = "hidden"
}

  document.querySelectorAll('.portfolio-card').forEach(card => {
  card.addEventListener('click', (e) => {
    // Игнорируем клик по кнопкам
    if (e.target.closest(".portfolio-btn") || e.target.closest(".edit-btn") || e.target.closest(".delete-btn")) {
      return
    }

    e.preventDefault()
    openPortfolioModal(card)
  })
})

  // Функция закрытия модального окна просмотра портфолио
  function closePortfolioModal() {
    portfolioModal.classList.remove("show")
    document.body.style.overflow = "auto"
  }

  // ===== ФУНКЦИИ ДЛЯ РЕДАКТИРОВАНИЯ ПОРТФОЛИО =====

  

  // ===== ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ ПОРТФОЛИО =====

  // Обработка кликов по фильтрам
  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Убираем активный класс у всех кнопок
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      // Добавляем активный класс к нажатой кнопке
      button.classList.add("active")

      const filter = button.getAttribute("data-filter")

      // Фильтруем карточки портфолио
      portfolioCards.forEach((card) => {
        const category = card.getAttribute("data-category")

        if (filter === "all" || category === filter) {
          card.style.display = "block"
          card.style.visibility = "visible"
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        } else {
          card.style.opacity = "0"
          card.style.transform = "translateY(20px)"
          setTimeout(() => {
            card.style.display = "none"
            card.style.visibility = "hidden"
          }, 300)
        }
      })
    })
  })

 



  // Редактирование проекта
  editButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();

      const card = button.closest('.portfolio-card');

      const projectId = card.dataset.id;
      const projectTitle = card.dataset.title;
      const projectDescription = card.dataset.description;
      const projectCategory = card.dataset.category;
      const projectCover = card.dataset.cover;
      const gallery = JSON.parse(card.dataset.gallery || '[]');

      console.log(card.dataset)
      // Заполнение формы
      document.getElementById('editProjectId').value = projectId;
      document.getElementById('editProjectTitle').value = projectTitle;
      document.getElementById('editProjectDescription').value = projectDescription;
      document.getElementById('editProjectCategory').value = projectCategory;

      // Обновление обложки
      const coverPreview = document.querySelector('#editCoverPreview img');
      if (coverPreview && projectCover) {
        coverPreview.src = projectCover;
      }

      // Очистка текущей галереи перед добавлением новых элементов
      const galleryContainer = document.getElementById('editGalleryPreviews');
      const uploadBtn = document.getElementById('editGalleryUploadBtn');
      galleryContainer.innerHTML = '';

      // Добавление изображений
      gallery.forEach(work => {
        // Создаем элемент превью
        const previewItem = document.createElement("div")
        previewItem.className = "gallery-preview-item"
        previewItem.innerHTML = `
          <img src="${work.work_path}" alt="Изображение работы">
          <div class="image-actions">
            <button type="button" class="image-action-btn delete-image-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `
        // Добавляем обработчик для кнопки удаления
        const deleteBtn = previewItem.querySelector(".delete-image-btn")
        deleteBtn.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          previewItem.remove()
        })
        // Вставляем перед кнопкой добавления

        galleryContainer.appendChild(previewItem);
      });
      // Повторно добавить кнопку загрузки
      galleryContainer.appendChild(uploadBtn);
      // Открываем модальное окно
      openModal(editPortfolioModal);
    });
  });

  // Удаление проекта
  // Добавляем обработчики для кнопок удаления
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const projectId = btn.dataset.id;

          if (!confirm("Вы уверены, что хотите удалить этот проект?")) return;

          try {
            const response = await fetch(`/designer/portfolio/delete/${projectId}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json"
              }
            });

            const result = await response.json();

            if (result.success) {
              alert("Проект удалён");
              // Удаляем элемент из DOM без перезагрузки
              btn.closest(".portfolio-card").remove();
            } else {
              alert("Ошибка при удалении: " + result.error);
            }
          } catch (error) {
            console.error("Ошибка при удалении:", error);
            alert("Ошибка при удалении проекта: " + error.message);
          }
        });
      });

  // Кнопка добавления нового проекта
  if (addPortfolioBtn) {
    addPortfolioBtn.addEventListener("click", () => {
      if (addPortfolioModal) {
        openModal(addPortfolioModal)
      } else {
        console.log("Добавление нового проекта")
        alert("Открытие формы добавления нового проекта")
      }
    })
  }

  // ===== ОБРАБОТЧИКИ МОДАЛЬНЫХ ОКОН =====

  // Закрытие модального окна просмотра портфолио
  if (portfolioModalClose) {
    portfolioModalClose.addEventListener("click", closePortfolioModal)
  }

  if (portfolioModal) {
    // Закрытие по клику на фон
    portfolioModal.addEventListener("click", (e) => {
      if (e.target === portfolioModal) {
        closePortfolioModal()
      }
    })
  }

  // Открытие модального окна редактирования профиля
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      openModal(editProfileModal)
    })
  }

  // Закрытие модальных окон
  closeButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      if (e.target.classList.contains("close")) {
        const modalId = e.target.getAttribute("data-modal")
        if (modalId) {
          const modal = document.getElementById(modalId)
          if (modal) closeModal(modal)
        } else {
          // Закрываем все открытые модальные окна
          if (editProfileModal && editProfileModal.classList.contains("show")) {
            closeModal(editProfileModal)
          }
          if (portfolioModal && portfolioModal.classList.contains("show")) {
            closePortfolioModal()
          }
          if (addPortfolioModal && addPortfolioModal.classList.contains("show")) {
            closeModal(addPortfolioModal)
          }
          if (editPortfolioModal && editPortfolioModal.classList.contains("show")) {
            closeModal(editPortfolioModal)
          }
        }
      } else if (e.target.getAttribute("data-modal")) {
        const modalId = e.target.getAttribute("data-modal")
        const modal = document.getElementById(modalId)
        if (modal) closeModal(modal)
      }
    })
  })

  // Закрытие по клику на фон для всех модальных окон
  const modals = [editProfileModal, addPortfolioModal, editPortfolioModal].filter(Boolean)
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal(modal)
      }
    })
  })

  // Закрытие по Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (portfolioModal && portfolioModal.classList.contains("show")) {
        closePortfolioModal()
      }
      if (editProfileModal && editProfileModal.classList.contains("show")) {
        closeModal(editProfileModal)
      }
      if (addPortfolioModal && addPortfolioModal.classList.contains("show")) {
        closeModal(addPortfolioModal)
      }
      if (editPortfolioModal && editPortfolioModal.classList.contains("show")) {
        closeModal(editPortfolioModal)
      }
    }
  })

  // ===== ОБРАБОТКА ЗАГРУЗКИ ИЗОБРАЖЕНИЙ =====

  // Загрузка аватара
  const avatarUpload = document.getElementById("avatarUpload")
  const currentAvatarPreview = document.getElementById("currentAvatarPreview")
  const currentAvatar = document.querySelector(".current-avatar")

  if (currentAvatar && avatarUpload) {
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
          if (currentAvatarPreview) {
            currentAvatarPreview.src = e.target.result
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Обработка загрузки обложки проекта
  const coverPreview = document.getElementById("coverPreview")
  const coverUpload = document.getElementById("coverUpload")

  if (coverPreview && coverUpload) {
    coverPreview.addEventListener("click", () => {
      coverUpload.click()
    })

    coverUpload.addEventListener("change", (e) => {
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
          const placeholder = coverPreview.querySelector(".upload-placeholder")
          const img = coverPreview.querySelector("img")

          if (placeholder) placeholder.style.display = "none"
          if (img) {
            img.src = e.target.result
            img.style.display = "block"
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  // Обработка загрузки изображений для галереи
  const galleryUploadBtn = document.getElementById("galleryUploadBtn")
  const galleryUpload = document.getElementById("galleryUpload")
  const galleryPreviews = document.getElementById("galleryPreviews")

  if (galleryUploadBtn && galleryUpload && galleryPreviews) {
    galleryUploadBtn.addEventListener("click", () => {
      galleryUpload.click()
    })

    const addPortfolioForm = document.getElementById("addPortfolioForm")
    const galleryUpload = document.getElementById("galleryUpload")

    // Храним выбранные изображения галереи
    const selectedGalleryFiles = []

    galleryUpload.addEventListener("change", (e) => {
      const files = Array.from(e.target.files)

      const existingImages = document.querySelectorAll(".gallery-preview-item").length
      const remainingSlots = 10 - existingImages

      if (files.length > remainingSlots) {
        alert(`Можно загрузить только ${remainingSlots} изображений`)
        return
      }

      files.forEach(file => {
        if (!file.type.startsWith("image/")) {
          alert(`Файл ${file.name} не является изображением`)
          return
        }

        if (file.size > 5 * 1024 * 1024) {
          alert(`Размер файла ${file.name} превышает 5MB`)
          return
        }

        selectedGalleryFiles.push(file)

        const reader = new FileReader()
        reader.onload = (e) => {
          const previewItem = document.createElement("div")
          previewItem.className = "gallery-preview-item"
          previewItem.innerHTML = `
        <img src="${e.target.result}" alt="${file.name}">
        <div class="image-actions">
          <button type="button" class="image-action-btn delete-image-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `
          previewItem.querySelector(".delete-image-btn").addEventListener("click", () => {
            const index = selectedGalleryFiles.indexOf(file)
            if (index > -1) selectedGalleryFiles.splice(index, 1)
            previewItem.remove()
          })

          document.getElementById("galleryPreviews").insertBefore(previewItem, document.getElementById("galleryUploadBtn"))
        }

        reader.readAsDataURL(file)
      })

      // очищаем input
      galleryUpload.value = ''
    })

    addPortfolioForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = new FormData()

      // Добавляем текстовые поля
      formData.append("projectTitle", document.getElementById("projectTitle").value)
      formData.append("projectCategory", document.getElementById("projectCategory").value)
      formData.append("projectDescription", document.getElementById("projectDescription").value)

      // Обложка
      const coverFile = document.getElementById("coverUpload").files[0]
      if (coverFile) {
        formData.append("coverImage", coverFile)
      }

      // Галерея
      selectedGalleryFiles.forEach((file) => {
        formData.append("galleryImages", file)
      })

      try {
        const response = await fetch("/designer/portfolio/add", {
          method: "POST",
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          alert("Проект успешно добавлен!")
          window.location.reload();

          // Очистка формы или обновление интерфейса по желанию
        } else {
          alert("Ошибка при добавлении проекта: " + result.error)
        }
      } catch (error) {
        console.error("Ошибка при отправке:", error)
        alert("Ошибка при отправке формы")
      }
    })
  }



  // Аналогичные обработчики для формы редактирования
  const editCoverPreview = document.getElementById("editCoverPreview")
  const editCoverUpload = document.getElementById("editCoverUpload")
  const editCoverBtn = document.getElementById("editCoverBtn")

  if (editCoverPreview && editCoverUpload && editCoverBtn) {
    editCoverBtn.addEventListener("click", () => {
      editCoverUpload.click()
    })

    editCoverUpload.addEventListener("change", (e) => {
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
          const img = editCoverPreview.querySelector("img")
          if (img) {
            img.src = e.target.result
          }
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const editGalleryUploadBtn = document.getElementById("editGalleryUploadBtn")
  const editGalleryUpload = document.getElementById("editGalleryUpload")
  const editGalleryPreviews = document.getElementById("editGalleryPreviews")

  if (editGalleryUploadBtn && editGalleryUpload && editGalleryPreviews) {
    let selectedImages = []

    editGalleryUploadBtn.addEventListener("click", () => {
      editGalleryUpload.click()
    })

    editGalleryUpload.addEventListener("change", (e) => {
      const newFiles = Array.from(e.target.files)
      const existingCount = selectedImages.length
      const remainingSlots = 10 - existingCount

      if (newFiles.length > remainingSlots) {
        alert(`Вы можете загрузить только ${remainingSlots} изображений`)
        return
      }

      newFiles.forEach((file) => {
        if (!file.type.startsWith("image/")) {
          alert(`Файл ${file.name} не является изображением`)
          return
        }

        if (file.size > 5 * 1024 * 1024) {
          alert(`Размер файла ${file.name} превышает 5MB`)
          return
        }

        selectedImages.push(file)

        const reader = new FileReader()
        reader.onload = (e) => {
          const previewItem = document.createElement("div")
          previewItem.className = "gallery-preview-item"

          previewItem.innerHTML = `
          <img src="${e.target.result}" alt="${file.name}">
          <div class="image-actions">
            <button type="button" class="image-action-btn delete-image-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        `

          // Удаление по кнопке
          previewItem.querySelector(".delete-image-btn").addEventListener("click", (ev) => {
            ev.preventDefault()
            ev.stopPropagation()

            // Удаляем из массива
            selectedImages = selectedImages.filter(f => f !== file)

            // Удаляем превью
            previewItem.remove()

            // Обновляем input.files
            updateInputFiles()
          })

          editGalleryPreviews.insertBefore(previewItem, editGalleryUploadBtn)
        }

        reader.readAsDataURL(file)
      })

      // После добавления новых файлов обновляем input
      updateInputFiles()
    })

    // Обновляет editGalleryUpload.files на основе selectedImages
    function updateInputFiles() {
      const dataTransfer = new DataTransfer()
      selectedImages.forEach(file => dataTransfer.items.add(file))
      editGalleryUpload.files = dataTransfer.files
    }
  }



  document.addEventListener("DOMContentLoaded", () => {
    const editPortfolioForm = document.getElementById("editPortfolioForm");

    editPortfolioForm.addEventListener("submit", async function (event) {
      event.preventDefault(); // Останавливаем обычную отправку формы

      const formData = new FormData(this);

      try {
        const response = await fetch("/designer/portfolio/update", {
          method: "POST",
          body: formData
        });

        const result = await response.json();
        alert("Ошибка при обновлении проекта: ");

        if (result.success) {
          window.location.href = "/designer/";

        } else {
          console.error("Ошибка сервера:", result.error);
          alert("Ошибка при обновлении проекта: " + result.error);
        }

      } catch (error) {
        console.error("Ошибка при отправке:", error);
        alert("Ошибка при отправке формы: " + error.message);
      }
    });
  });

  // ===== ОБРАБОТКА ПАРОЛЕЙ =====

  // Переключение видимости пароля
  const passwordToggles = document.querySelectorAll(".password-toggle")
  passwordToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const targetId = toggle.getAttribute("data-target")
      const passwordInput = document.getElementById(targetId)
      if (!passwordInput) return

      const isPassword = passwordInput.type === "password"
      passwordInput.type = isPassword ? "text" : "password"

      // Изменение иконки
      const svg = toggle.querySelector("svg")
      if (svg) {
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
      }
    })
  })

  // Проверка силы пароля
  const newPasswordInput = document.getElementById("newPassword")
  const passwordStrength = document.getElementById("passwordStrength")

  if (newPasswordInput && passwordStrength) {
    newPasswordInput.addEventListener("input", () => {
      const password = newPasswordInput.value
      const strength = calculatePasswordStrength(password)
      passwordStrength.className = `password-strength ${strength}`
    })
  }

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

  // ===== СЧЕТЧИКИ СИМВОЛОВ =====

  // Счетчик символов для описания профиля
  const descriptionTextarea = document.getElementById("designerDescription")
  const charCount = document.getElementById("charCount")
  const maxChars = 1024

  if (descriptionTextarea && charCount) {
    function updateCharCount() {
      const currentLength = descriptionTextarea.value.length
      charCount.textContent = currentLength

      const charCountElement = charCount.parentElement

      if (currentLength > maxChars * 0.9) {
        charCountElement.classList.add("warning")
        charCountElement.classList.remove("error")
      } else if (currentLength > maxChars) {
        charCountElement.classList.add("error")
        charCountElement.classList.remove("warning")
      } else {
        charCountElement.classList.remove("warning", "error")
      }
    }

    descriptionTextarea.addEventListener("input", updateCharCount)
    descriptionTextarea.addEventListener("input", (e) => {
      if (e.target.value.length > maxChars) {
        e.target.value = e.target.value.substring(0, maxChars)
      }
      updateCharCount()
    })

    // Инициализация счетчика
    updateCharCount()
  }

  // Счетчики символов для описания проектов
  const projectDescription = document.getElementById("projectDescription")
  const descriptionCharCount = document.getElementById("descriptionCharCount")
  const projectMaxChars = 2048

  if (projectDescription && descriptionCharCount) {
    function updateProjectCharCount() {
      const currentLength = projectDescription.value.length
      descriptionCharCount.textContent = currentLength

      const charCountElement = descriptionCharCount.parentElement

      if (currentLength > projectMaxChars * 0.9) {
        charCountElement.classList.add("warning")
        charCountElement.classList.remove("error")
      } else if (currentLength > projectMaxChars) {
        charCountElement.classList.add("error")
        charCountElement.classList.remove("warning")
      } else {
        charCountElement.classList.remove("warning", "error")
      }
    }

    projectDescription.addEventListener("input", updateProjectCharCount)
    projectDescription.addEventListener("input", (e) => {
      if (e.target.value.length > projectMaxChars) {
        e.target.value = e.target.value.substring(0, projectMaxChars)
      }
      updateProjectCharCount()
    })

    // Инициализация счетчика
    updateProjectCharCount()
  }

  // Аналогичный счетчик для формы редактирования
  const editProjectDescription = document.getElementById("editProjectDescription")
  const editDescriptionCharCount = document.getElementById("editDescriptionCharCount")

  if (editProjectDescription && editDescriptionCharCount) {
    function updateEditCharCount() {
      const currentLength = editProjectDescription.value.length
      editDescriptionCharCount.textContent = currentLength

      const charCountElement = editDescriptionCharCount.parentElement

      if (currentLength > projectMaxChars * 0.9) {
        charCountElement.classList.add("warning")
        charCountElement.classList.remove("error")
      } else if (currentLength > projectMaxChars) {
        charCountElement.classList.add("error")
        charCountElement.classList.remove("warning")
      } else {
        charCountElement.classList.remove("warning", "error")
      }
    }

    editProjectDescription.addEventListener("input", updateEditCharCount)
    editProjectDescription.addEventListener("input", (e) => {
      if (e.target.value.length > projectMaxChars) {
        e.target.value = e.target.value.substring(0, projectMaxChars)
      }
      updateEditCharCount()
    })
  }

  // ===== ОБРАБОТКА ФОРМ =====


  // Обработка отправки формы добавления проекта
  // const addPortfolioForm = document.getElementById("addPortfolioForm")
  // if (addPortfolioForm) {
  //   addPortfolioForm.addEventListener("submit", (e) => {
  //     e.preventDefault()
  //
  //     // Проверка наличия обложки
  //     const coverImg = document.querySelector("#coverPreview img")
  //     if (!coverImg || coverImg.style.display === "none") {
  //       alert("Пожалуйста, загрузите обложку проекта")
  //       return
  //     }
  //
  //     // Проверка наличия изображений в галерее
  //    const galleryImages = document.querySelectorAll("#galleryPreviews .gallery-preview-item")
  //    if (galleryImages.length === 0) {
  //      alert("Пожалуйста, добавьте хотя бы одно изображение в галерею")
  //      return
  //    }
  //
  //    const formData = new FormData(addPortfolioForm)
  //    const data = Object.fromEntries(formData.entries())
  //
  //    // Имитация сохранения
  //    const submitButton = addPortfolioForm.querySelector('button[type="submit"]')
  //    const originalText = submitButton.innerHTML
  //
  //    submitButton.innerHTML = `
  //      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  //        <circle cx="12" cy="12" r="3"></circle>
  //      </svg>
  //      Сохранение...
  //    `
  //    submitButton.disabled = true
  //
  //    setTimeout(() => {
  //      submitButton.innerHTML = originalText
  //      submitButton.disabled = false
  //
  //      alert("Проект успешно добавлен!")
  //      closeModal(addPortfolioModal)
  //
  //      // Сброс формы
  //      addPortfolioForm.reset()
  //      const placeholder = document.querySelector("#coverPreview .upload-placeholder")
  //      const img = document.querySelector("#coverPreview img")
  //      if (placeholder) placeholder.style.display = "flex"
  //      if (img) img.style.display = "none"
  //
  //      // Очистка галереи
  //      const galleryPreviews = document.getElementById("galleryPreviews")
  //      const uploadBtn = document.getElementById("galleryUploadBtn")
  //      if (galleryPreviews && uploadBtn) {
  //        const previewItems = galleryPreviews.querySelectorAll(".gallery-preview-item")
  //        previewItems.forEach((item) => item.remove())
  //      }
  //    }, 2000)
  //  })
  //}

  //// Обработка отправки формы редактирования проекта
  //const editPortfolioForm = document.getElementById("editPortfolioForm")
  //if (editPortfolioForm) {
  //  editPortfolioForm.addEventListener("submit", (e) => {
  //    e.preventDefault()
  //
  //    // Проверка наличия обложки
  //    const coverImg = document.querySelector("#editCoverPreview img")
  //    if (!coverImg || coverImg.style.display === "none") {
  //      alert("Пожалуйста, загрузите обложку проекта")
  //      return
  //    }
  //
  //    // Проверка наличия изображений в галерее
  //    const galleryImages = document.querySelectorAll("#editGalleryPreviews .gallery-preview-item")
  //    if (galleryImages.length === 0) {
  //      alert("Пожалуйста, добавьте хотя бы одно изображение в галерею")
  //      return
  //    }
  //
  //    const formData = new FormData(editPortfolioForm)
  //    const data = Object.fromEntries(formData.entries())
  //
  //    // Имитация сохранения
  //    const submitButton = editPortfolioForm.querySelector('button[type="submit"]')
  //    const originalText = submitButton.innerHTML
  //
  //    submitButton.innerHTML = `
  //      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  //        <circle cx="12" cy="12" r="3"></circle>
  //      </svg>
  //      Сохранение...
  //    `
  //    submitButton.disabled = true
  //
  //    setTimeout(() => {
  //      submitButton.innerHTML = originalText
  //      submitButton.disabled = false
  //
  //      alert("Проект успешно обновлен!")
  //      closeModal(editPortfolioModal)
  //    }, 2000)
  //  })
  //}

  // ===== ДОПОЛНИТЕЛЬНЫЕ ОБРАБОТЧИКИ =====

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
      if (e.target.closest(".designer-profile-form")) {
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
  
  // Кнопка чатов
  const chatsBtn = document.getElementById("chatsBtn");
  if (chatsBtn) {
    chatsBtn.addEventListener("click", () => {
      window.location.href = "/chats";
    });
  }


  // Плавная прокрутка к секциям
  const smoothScrollToSection = (selector) => {
    const element = document.querySelector(selector)
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  }

  // Добавляем обработчики для плавной прокрутки
  document.addEventListener("click", (e) => {
    if (e.target.matches('a[href^="#"]')) {
      e.preventDefault()
      const targetId = e.target.getAttribute("href")
      smoothScrollToSection(targetId)
    }
  })

  // Обработка изменения размера окна для адаптивности
  window.addEventListener("resize", () => {
    // Пересчитываем размеры элементов при необходимости
    const portfolioGrid = document.querySelector(".portfolio-grid")
    if (portfolioGrid && window.innerWidth <= 768) {
      portfolioCards.forEach((card) => {
        if (card.style.display !== "none") {
          card.style.display = "block"
          card.style.opacity = "1"
          card.style.transform = "translateY(0)"
        }
      })
    }
  })

  // Lazy loading для изображений портфолио
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "50px",
  }

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        if (img.dataset.src) {
          img.src = img.dataset.src
          img.removeAttribute("data-src")
          imageObserver.unobserve(img)
        }
      }
    })
  }, observerOptions)

  // Наблюдаем за изображениями с data-src атрибутом
  document.querySelectorAll("img[data-src]").forEach((img) => {
    imageObserver.observe(img)
  })

})


   // Кнопка истории заказов
   const orderHistoryBtn = document.getElementById("orderHistoryBtn");
   if (orderHistoryBtn) {
     orderHistoryBtn.addEventListener("click", () => {
       window.location.href = "/designer/projects";
     });
   }