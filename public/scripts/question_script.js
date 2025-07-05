document.addEventListener("DOMContentLoaded", () => {
    // Создаем интерактивные частицы для секции вопросов
    function createQuestionsParticles() {
      const particlesContainer = document.getElementById("questions-particles")
      if (!particlesContainer) return
  
      const particleCount = 20
  
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div")
        particle.className = "questions-particle"
  
        // Случайные размеры и позиции
        const size = Math.random() * 4 + 2
        const posX = Math.random() * 100
        const posY = Math.random() * 100
        const delay = Math.random() * 5
        const duration = Math.random() * 15 + 10
  
        // Случайная прозрачность
        const opacity = Math.random() * 0.3 + 0.1
  
        particle.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          top: ${posY}%;
          left: ${posX}%;
          opacity: ${opacity};
          animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
        `
  
        particlesContainer.appendChild(particle)
      }
  
      // Добавляем стиль анимации
      const style = document.createElement("style")
      style.textContent = `
        @keyframes floatParticle {
          0%, 100% {
            transform: translate(0, 0);
          }
          25% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
          }
          50% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
          }
          75% {
            transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
          }
        }
      `
      document.head.appendChild(style)
    }
  
    createQuestionsParticles()
  
    // Анимация для звезд
    const stars = document.querySelectorAll(".questions-star")
    stars.forEach((star) => {
      star.style.animation = `starTwinkle ${3 + Math.random() * 4}s ease-in-out infinite`
    })
  
    // Функционал аккордеона
    const accordionItems = document.querySelectorAll(".accordion-item")
    accordionItems.forEach((item) => {
      const header = item.querySelector(".accordion-header")
      const content = item.querySelector(".accordion-content")
  
      header.addEventListener("click", () => {
        // Закрываем все остальные элементы
        accordionItems.forEach((otherItem) => {
          if (otherItem !== item && otherItem.classList.contains("active")) {
            otherItem.classList.remove("active")
            otherItem.querySelector(".accordion-content").style.maxHeight = "0px"
          }
        })
  
        // Открываем/закрываем текущий элемент
        item.classList.toggle("active")
        if (item.classList.contains("active")) {
          content.style.maxHeight = content.scrollHeight + "px"
        } else {
          content.style.maxHeight = "0px"
        }
      })
    })
  
    // Интерактивный эффект для декоративных элементов
    const questionsSection = document.querySelector(".questions-section")
    const shapes = document.querySelectorAll(".questions-shape")
  
    if (questionsSection) {
      questionsSection.addEventListener("mousemove", function (e) {
        const sectionRect = this.getBoundingClientRect()
        const x = (e.clientX - sectionRect.left) / sectionRect.width - 0.5
        const y = (e.clientY - sectionRect.top) / sectionRect.height - 0.5
  
        // Эффект для фигур
        shapes.forEach((shape, index) => {
          const speed = 20 + index * 10
          shape.style.transform = `translate(${x * speed}px, ${y * speed}px) rotate(${x * y * 30}deg)`
        })
  
        // Эффект для звезд
        stars.forEach((star, index) => {
          const speed = 15 + index * 5
          star.style.transform = `translate(${-x * speed}px, ${-y * speed}px)`
        })
      })
  
      // Возвращаем элементы в исходное положение при уходе курсора
      questionsSection.addEventListener("mouseleave", () => {
        shapes.forEach((shape) => {
          shape.style.transform = ""
        })
  
        stars.forEach((star) => {
          star.style.transform = ""
        })
      })
    }
  
    // Эффект для кнопки контакта
    const contactButton = document.querySelector(".contact-button")
    if (contactButton) {
      contactButton.addEventListener("mouseenter", function () {
        // Создаем эффект пульсации
        const pulse = document.createElement("div")
        pulse.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 30px;
          border: 2px solid rgba(240, 164, 226, 0.5);
          opacity: 1;
          z-index: -1;
          animation: buttonPulse 1.5s ease-out infinite;
        `
  
        this.appendChild(pulse)
  
        // Добавляем стиль анимации
        const style = document.createElement("style")
        style.textContent = `
          @keyframes buttonPulse {
            0% {
              transform: scale(1);
              opacity: 0.8;
            }
            100% {
              transform: scale(1.5);
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
  
        // Удаляем эффект при уходе курсора
        this.addEventListener(
          "mouseleave",
          () => {
            pulse.remove()
          },
          { once: true },
        )
      })
  
      // Добавляем эффект при клике
      contactButton.addEventListener("click", function (e) {
        // Создаем эффект волны
        const ripple = document.createElement("div")
        const rect = this.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
  
        ripple.style.cssText = `
          position: absolute;
          top: ${y}px;
          left: ${x}px;
          width: 0;
          height: 0;
          background-color: rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 0;
          animation: rippleEffect 0.6s linear;
        `
  
        this.appendChild(ripple)
  
        // Добавляем стиль анимации
        const style = document.createElement("style")
        style.textContent = `
          @keyframes rippleEffect {
            to {
              width: 300px;
              height: 300px;
              opacity: 0;
            }
          }
        `
        document.head.appendChild(style)
  
        // Удаляем эффект после завершения анимации
        setTimeout(() => {
          ripple.remove()
        }, 600)
      })
    }

      // Элементы DOM
      const projectsTrack = document.getElementById("projectsTrack")
      const prevButton = document.getElementById("prevProjectButton")
      const nextButton = document.getElementById("nextProjectButton")
    
      // Проверяем, существуют ли элементы
      if (!projectsTrack || !prevButton || !nextButton) {
        console.error("Не удалось найти элементы карусели проектов")
        return
      }
    
      // Получаем все карточки проектов
      const projectCards = projectsTrack.querySelectorAll(".project-card")
    
      // Если карточек нет, выходим
      if (projectCards.length === 0) {
        console.error("Карточки проектов не найдены")
        return
      }
    
      // Вычисляем ширину карточки с учетом отступов
      const getCardWidth = () => {
        return (
          projectCards[0].offsetWidth +
          Number.parseInt(getComputedStyle(projectCards[0]).marginLeft) +
          Number.parseInt(getComputedStyle(projectCards[0]).marginRight)
        )
      }
    
      let cardWidth = getCardWidth()
    
      // Количество видимых карточек зависит от ширины экрана
      const getVisibleCards = () => {
        const containerWidth = document.querySelector(".projects-carousel").offsetWidth
        const visible = Math.floor(containerWidth / cardWidth)
        return visible < 1 ? 1 : visible
      }
    
      let visibleCards = getVisibleCards()
    
      // Общее количество карточек
      const totalCards = projectCards.length
    
      // Текущая позиция (индекс первой видимой карточки)
      let currentPosition = 0
    
      // Функция для обновления положения карточек
      function updateCarouselPosition() {
        projectsTrack.style.transform = `translateX(-${currentPosition * cardWidth}px)`
    
        // Обновляем состояние кнопок визуально
        prevButton.style.opacity = currentPosition <= 0 ? "0.5" : "1"
        nextButton.style.opacity = currentPosition >= totalCards - visibleCards ? "0.5" : "1"
    
        console.log(`Позиция карусели проектов обновлена: ${currentPosition}/${totalCards - visibleCards}`)
      }
    
      // Обработчик для кнопки "Предыдущий"
      prevButton.addEventListener("click", () => {
        console.log("Нажата кнопка 'Предыдущий'")
        if (currentPosition > 0) {
          currentPosition--
        } else {
          // Перемотка в конец при достижении начала
          currentPosition = totalCards - visibleCards
        }
        updateCarouselPosition()
      })
    
      // Обработчик для кнопки "Следующий"
      nextButton.addEventListener("click", () => {
        console.log("Нажата кнопка 'Следующий'")
        if (currentPosition < totalCards - visibleCards) {
          currentPosition++
        } else {
          // Перемотка в начало при достижении конца
          currentPosition = 0
        }
        updateCarouselPosition()
      })
    
      // Обработчик изменения размера окна
      window.addEventListener("resize", () => {
        // Пересчитываем ширину карточки
        cardWidth = getCardWidth()
    
        // Пересчитываем количество видимых карточек
        visibleCards = getVisibleCards()
    
        // Корректируем текущую позицию, если она стала недопустимой
        if (currentPosition > totalCards - visibleCards) {
          currentPosition = Math.max(0, totalCards - visibleCards)
        }
    
        updateCarouselPosition()
      })
    
      // Эффекты для карточек проектов
      projectCards.forEach((card) => {
        // Эффект при наведении
        card.addEventListener("mouseenter", function () {
          const icon = this.querySelector(".project-icon")
          if (icon) {
            icon.style.transform = "rotate(90deg)"
          }
    
          // Создаем эффект частиц при наведении
          createParticles(this)
        })
    
        card.addEventListener("mouseleave", function () {
          const icon = this.querySelector(".project-icon")
          if (icon) {
            icon.style.transform = ""
          }
        })
    
        // Эффект при клике
        card.addEventListener("mousedown", function () {
          this.style.transform = "scale(0.98)"
        })
    
        card.addEventListener("mouseup", function () {
          this.style.transform = ""
        })
    
        // Обработчик клика для открытия модального окна (заглушка)
        card.addEventListener("click", function () {
          const projectTitle = this.querySelector(".project-title").textContent
          console.log(`Открытие портфолио проекта: ${projectTitle}`)
          // Здесь будет код для открытия модального окна
        })
      })
    
      // Функция для создания эффекта частиц
      function createParticles(element, count = 5) {
        const rect = element.getBoundingClientRect()
    
        for (let i = 0; i < count; i++) {
          const particle = document.createElement("div")
    
          particle.style.cssText = `
            position: absolute;
            width: 8px;
            height: 8px;
            background-color: #F0A4E2;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10;
            opacity: 0.7;
          `
    
          document.body.appendChild(particle)
    
          const startX = rect.left + Math.random() * rect.width
          const startY = rect.top + Math.random() * rect.height
    
          particle.style.left = `${startX}px`
          particle.style.top = `${startY}px`
    
          const angle = Math.random() * Math.PI * 2
          const distance = 50 + Math.random() * 100
          const duration = 1 + Math.random()
    
          const endX = startX + Math.cos(angle) * distance
          const endY = startY + Math.sin(angle) * distance
    
          particle.animate(
            [
              { left: `${startX}px`, top: `${startY}px`, opacity: 0.7, transform: "scale(1)" },
              { left: `${endX}px`, top: `${endY}px`, opacity: 0, transform: "scale(0)" },
            ],
            {
              duration: duration * 1000,
              easing: "ease-out",
              fill: "forwards",
            },
          )
    
          setTimeout(() => {
            particle.remove()
          }, duration * 1000)
        }
      }
    
      // Интерактивный эффект для декоративных элементов
      const projectsSection = document.querySelector(".projects-section")
      const circles = document.querySelectorAll(".projects-circle")
    
      if (projectsSection) {
        projectsSection.addEventListener("mousemove", function (e) {
          const sectionRect = this.getBoundingClientRect()
          const x = (e.clientX - sectionRect.left) / sectionRect.width - 0.5
          const y = (e.clientY - sectionRect.top) / sectionRect.height - 0.5
    
          // Эффект параллакса для кругов
          circles.forEach((circle) => {
            const speed = 30
            circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`
          })
        })
    
        // Возвращаем элементы в исходное положение при уходе курсора
        projectsSection.addEventListener("mouseleave", () => {
          circles.forEach((circle) => {
            circle.style.transform = ""
          })
        })
      }
    
      // Инициализация карусели
      updateCarouselPosition()
      console.log("Карусель проектов инициализирована")
    
  })
  