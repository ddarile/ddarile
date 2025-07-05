document.addEventListener("DOMContentLoaded", () => {
    // Элементы DOM
    const track = document.getElementById("testimonialsTrack")
    const prevButton = document.getElementById("testimonialsPrev")
    const nextButton = document.getElementById("testimonialsNext")
  
    // Проверяем, существуют ли элементы
    if (!track || !prevButton || !nextButton) {
      console.error("Не удалось найти элементы карусели отзывов")
      return
    }
  
    // Получаем все отзывы
    const testimonials = track.querySelectorAll(".testimonial-item")
  
    // Если отзывов нет, выходим
    if (testimonials.length === 0) {
      console.error("Отзывы не найдены")
      return
    }
  
    // Количество отзывов, отображаемых одновременно (в зависимости от ширины экрана)
    const getVisibleCount = () => {
      if (window.innerWidth < 768) return 1
      if (window.innerWidth < 992) return 2
      return 3
    }
  
    let visibleCount = getVisibleCount()
    let currentIndex = 0
  
    // Функция для обновления положения карусели
    function updateCarouselPosition() {
      // Вычисляем ширину одного отзыва с учетом отступов
      const itemWidth =
        testimonials[0].offsetWidth +
        Number.parseInt(getComputedStyle(testimonials[0]).marginLeft) +
        Number.parseInt(getComputedStyle(testimonials[0]).marginRight)
  
      // Перемещаем карусель
      track.style.transform = `translateX(-${currentIndex * itemWidth}px)`
  
      // Обновляем состояние кнопок
      prevButton.style.opacity = currentIndex <= 0 ? "0.5" : "1"
      nextButton.style.opacity = currentIndex >= testimonials.length - visibleCount ? "0.5" : "1"
    }
  
    // Обработчик для кнопки "Предыдущий"
    prevButton.addEventListener("click", () => {
      if (currentIndex > 0) {
        currentIndex--
      } else {
        // Перемотка в конец при достижении начала
        currentIndex = testimonials.length - visibleCount
      }
      updateCarouselPosition()
    })
  
    // Обработчик для кнопки "Следующий"
    nextButton.addEventListener("click", () => {
      if (currentIndex < testimonials.length - visibleCount) {
        currentIndex++
      } else {
        // Перемотка в начало при достижении конца
        currentIndex = 0
      }
      updateCarouselPosition()
    })
  
    // Обработчик изменения размера окна
    window.addEventListener("resize", () => {
      const newVisibleCount = getVisibleCount()
  
      // Если количество видимых отзывов изменилось, обновляем карусель
      if (newVisibleCount !== visibleCount) {
        visibleCount = newVisibleCount
  
        // Корректируем текущий индекс, если он стал недопустимым
        if (currentIndex > testimonials.length - visibleCount) {
          currentIndex = Math.max(0, testimonials.length - visibleCount)
        }
  
        updateCarouselPosition()
      }
    })
  
    // Интерактивные эффекты для отзывов
    testimonials.forEach((testimonial) => {
      // Эффект при наведении
      testimonial.addEventListener("mouseenter", function () {
        // Анимируем звезды рейтинга
        const stars = this.querySelectorAll(".star")
        stars.forEach((star, index) => {
          setTimeout(() => {
            star.style.transform = "scale(1.2)"
            star.style.color = "#ffffff"
          }, index * 100)
  
          setTimeout(
            () => {
              star.style.transform = ""
              star.style.color = ""
            },
            500 + index * 100,
          )
        })
      })
    })
  
    // Интерактивный эффект для декоративных элементов
    const testimonialsSection = document.querySelector(".testimonials-section")
    const circles = document.querySelectorAll(".testimonials-circle")
    const shapes = document.querySelectorAll(".testimonials-shape")
  
    if (testimonialsSection) {
      testimonialsSection.addEventListener("mousemove", function (e) {
        const sectionRect = this.getBoundingClientRect()
        const x = (e.clientX - sectionRect.left) / sectionRect.width - 0.5
        const y = (e.clientY - sectionRect.top) / sectionRect.height - 0.5
  
        // Эффект параллакса для кругов
        circles.forEach((circle) => {
          const speed = 30
          circle.style.transform = `translate(${x * speed}px, ${y * speed}px)`
        })
  
        // Эффект для фигур
        shapes.forEach((shape) => {
          const speed = 20
          shape.style.transform = `translate(${-x * speed}px, ${-y * speed}px) rotate(${x * y * 30}deg)`
        })
      })
  
      // Возвращаем элементы в исходное положение при уходе курсора
      testimonialsSection.addEventListener("mouseleave", () => {
        circles.forEach((circle) => {
          circle.style.transform = ""
        })
  
        shapes.forEach((shape) => {
          shape.style.transform = ""
        })
      })
    }
  
    // Автоматическая прокрутка карусели
    let autoScrollInterval
  
    function startAutoScroll() {
      autoScrollInterval = setInterval(() => {
        if (currentIndex < testimonials.length - visibleCount) {
          currentIndex++
        } else {
          currentIndex = 0
        }
        updateCarouselPosition()
      }, 5000) // Интервал 5 секунд
    }
  
    function stopAutoScroll() {
      clearInterval(autoScrollInterval)
    }
  
    // Запускаем автоматическую прокрутку
    startAutoScroll()
  
    // Останавливаем автопрокрутку при взаимодействии пользователя
    testimonialsSection.addEventListener("mouseenter", stopAutoScroll)
    testimonialsSection.addEventListener("mouseleave", startAutoScroll)
  
    // Инициализация карусели
    updateCarouselPosition()
  })
  