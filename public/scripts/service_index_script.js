document.addEventListener("DOMContentLoaded", () => {
    // Элементы DOM
    const servicesTrack = document.getElementById("servicesTrack")
    const prevButton = document.getElementById("prevButton")
    const nextButton = document.getElementById("nextButton")
  
    // Проверяем, существуют ли элементы
    if (!servicesTrack || !prevButton || !nextButton) {
      console.error("Не удалось найти элементы карусели услуг")
      return
    }
  
    // Получаем все карточки услуг
    const serviceCards = servicesTrack.querySelectorAll(".service-card")
  
    // Если карточек нет, выходим
    if (serviceCards.length === 0) {
      console.error("Карточки услуг не найдены")
      return
    }
  
    // Вычисляем ширину карточки с учетом отступов
    const getCardWidth = () => {
      return (
        serviceCards[0].offsetWidth +
        Number.parseInt(getComputedStyle(serviceCards[0]).marginLeft) +
        Number.parseInt(getComputedStyle(serviceCards[0]).marginRight)
      )
    }
  
    let cardWidth = getCardWidth()
  
    // Количество видимых карточек зависит от ширины экрана
    const getVisibleCards = () => {
      const containerWidth = document.querySelector(".services-carousel").offsetWidth
      const visible = Math.floor(containerWidth / cardWidth)
      return visible < 1 ? 1 : visible
    }
  
    let visibleCards = getVisibleCards()
  
    // Общее количество карточек
    const totalCards = serviceCards.length
  
    // Текущая позиция (индекс первой видимой карточки)
    let currentPosition = 0
  
    // Функция для обновления положения карточек
    function updateCarouselPosition() {
      servicesTrack.style.transform = `translateX(-${currentPosition * cardWidth}px)`
  
      // Обновляем состояние кнопок визуально
      prevButton.style.opacity = currentPosition <= 0 ? "0.5" : "1"
      nextButton.style.opacity = currentPosition >= totalCards - visibleCards ? "0.5" : "1"
  
      console.log(`Позиция карусели обновлена: ${currentPosition}/${totalCards - visibleCards}`)
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
  
    // Эффекты для карточек услуг
    serviceCards.forEach((card) => {
      // Эффект при наведении
      card.addEventListener("mouseenter", function () {
        const icon = this.querySelector(".service-icon")
        if (icon) {
          icon.style.transform = "rotate(90deg)"
        }
  
        // Создаем эффект частиц при наведении
        createParticles(this)
      })
  
      card.addEventListener("mouseleave", function () {
        const icon = this.querySelector(".service-icon")
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
  
    // Инициализация карусели
    updateCarouselPosition()
    console.log("Карусель услуг инициализирована")
  })
  