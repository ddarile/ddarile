// JavaScript для интерактивных анимаций в секции Hero
document.addEventListener('DOMContentLoaded', function () {
    // Создаем анимированные частицы
    function createParticles() {
        const particlesContainer = document.getElementById('particles');
        const particleCount = 50;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';

            // Случайные размеры и позиции
            const size = Math.random() * 3 + 1;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const delay = Math.random() * 5;
            const duration = Math.random() * 20 + 10;

            // Добавляем розовый цвет для некоторых частиц
            const useColor = Math.random() > 0.7;
            const color = useColor ?
                `rgba(240, 164, 226, ${Math.random() * 0.3 + 0.1})` :
                `rgba(224, 224, 224, ${Math.random() * 0.3 + 0.1})`;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background-color: ${color};
                border-radius: 50%;
                top: ${posY}%;
                left: ${posX}%;
                animation: floatParticle ${duration}s ease-in-out ${delay}s infinite;
                opacity: ${Math.random() * 0.5 + 0.3};
            `;

            particlesContainer.appendChild(particle);
        }

        // Добавляем стиль анимации
        const style = document.createElement('style');
        style.textContent = `
            @keyframes floatParticle {
                0%, 100% {
                    transform: translate(0, 0);
                }
                25% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
                50% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
                75% {
                    transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
                }
            }
        `;
        document.head.appendChild(style);
    }

    createParticles();

    // Интерактивный эффект для заголовка
    const animatedTitle = document.getElementById('animated-title');

    function animateTitle() {
        const text = animatedTitle.textContent;
        animatedTitle.textContent = '';

        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.cssText = `
                display: inline-block;
                position: relative;
                animation: textGlow 3s ease-in-out ${i * 0.1}s infinite;
                transition: transform 0.3s ease, color 0.3s ease;
            `;

            // Добавляем интерактивность при наведении
            span.addEventListener('mouseover', function () {
                this.style.transform = 'translateY(-10px) scale(1.2)';
                this.style.color = '#F0A4E2';
            });

            span.addEventListener('mouseout', function () {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.color = '#e0e0e0';
            });

            animatedTitle.appendChild(span);
        }
    }

    animateTitle();

    // Интерактивный эффект для изображений при движении мыши
    const heroSection = document.querySelector('.hero');
    const mainImage = document.getElementById('main-image');
    const floatingImage1 = document.getElementById('floating-image-1');
    const floatingImage2 = document.getElementById('floating-image-2');

    heroSection.addEventListener('mousemove', function (e) {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;

        // Разная интенсивность движения для каждого изображения
        mainImage.style.transform = `translate(${x * -20}px, ${y * -20}px)`;
        floatingImage1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
        if (floatingImage2) {
            floatingImage2.style.transform = `translate(${x * -40}px, ${y * -40}px)`;
        }
    });

    // Интерактивный круг с эффектом при клике
    const interactiveCircle = document.getElementById('interactive-circle');

    interactiveCircle.addEventListener('click', function () {
        // Создаем эффект расходящихся кругов
        for (let i = 0; i < 3; i++) {
            const ripple = document.createElement('div');
            ripple.className = 'ripple-effect';
            ripple.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                background-color: rgba(240, 164, 226, 0.7);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(0);
                animation: rippleEffect 1s ease-out ${i * 0.2}s forwards;
                opacity: 1;
                z-index: 0;
            `;

            interactiveCircle.appendChild(ripple);

            // Удаляем элемент после завершения анимации
            setTimeout(() => {
                ripple.remove();
            }, 1000 + i * 200);
        }

        // Анимируем изображения
        mainImage.style.transform = 'scale(1.05)';
        floatingImage1.style.transform = 'scale(1.1) translateY(-20px)';
        if (floatingImage2) {
            floatingImage2.style.transform = 'scale(1.1) translateY(20px)';
        }

        // Возвращаем в исходное положение
        setTimeout(() => {
            mainImage.style.transform = '';
            floatingImage1.style.transform = '';
            if (floatingImage2) {
                floatingImage2.style.transform = '';
            }
        }, 800);
    });

    // Добавляем стиль для эффекта расходящихся кругов
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes rippleEffect {
            to {
                transform: translate(-50%, -50%) scale(10);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Эффект параллакса при прокрутке
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;
        const scrollPercentage = scrollTop / heroHeight;

        if (scrollPercentage <= 1) {
            // Плавное затухание при прокрутке
            heroSection.style.opacity = 1 - scrollPercentage * 0.8;

            // Параллакс-эффект для изображений
            mainImage.style.transform = `translateY(${scrollTop * 0.1}px)`;
            floatingImage1.style.transform = `translateY(${scrollTop * 0.2}px)`;
            if (floatingImage2) {
                floatingImage2.style.transform = `translateY(${scrollTop * 0.15}px)`;
            }
        }
    });

    // Интерактивные цветные точки
    const colorDots = document.querySelectorAll('.color-dot');

    colorDots.forEach((dot, index) => {
        dot.addEventListener('click', function () {
            // Создаем эффект пульсации при клике
            this.style.transform = 'scale(2)';
            this.style.opacity = '1';

            // Добавляем цветной всплеск
            const splash = document.createElement('div');
            splash.className = 'color-splash';
            splash.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(240, 164, 226, 0.05);
                z-index: 0;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.5s ease;
            `;
            document.body.appendChild(splash);

            // Показываем всплеск
            setTimeout(() => {
                splash.style.opacity = '1';
            }, 10);

            // Удаляем всплеск
            setTimeout(() => {
                splash.style.opacity = '0';
                setTimeout(() => {
                    splash.remove();
                }, 500);
            }, 500);

            // Возвращаем точку в исходное состояние
            setTimeout(() => {
                this.style.transform = '';
                this.style.opacity = '';
            }, 500);
        });
    });

    // Интерактивные круги, отодвигающиеся от курсора
    const shapes = document.querySelectorAll('.hero-shape');

    heroSection.addEventListener('mousemove', function (e) {
        shapes.forEach(shape => {
            // Получаем позицию круга
            const rect = shape.getBoundingClientRect();
            const shapeX = rect.left + rect.width / 2;
            const shapeY = rect.top + rect.height / 2;

            // Вычисляем расстояние от курсора до центра круга
            const distX = e.clientX - shapeX;
            const distY = e.clientY - shapeY;

            // Вычисляем расстояние
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Если курсор достаточно близко к кругу
            if (distance < 300) {
                // Вычисляем силу отталкивания (обратно пропорционально расстоянию)
                const power = 100 / (distance / 3);

                // Вычисляем направление отталкивания
                const moveX = (distX / distance) * -power;
                const moveY = (distY / distance) * -power;

                // Применяем трансформацию
                shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
            } else {
                // Возвращаем к анимации по умолчанию
                shape.style.transform = '';
            }
        });
    });

    // Возвращаем круги в исходное положение при уходе курсора
    heroSection.addEventListener('mouseleave', function () {
        shapes.forEach(shape => {
            shape.style.transform = '';
        });
    });

    // Получаем элемент
    const accentElement = document.querySelector(".about-image-accent")

    if (accentElement) {
        // Добавляем обработчик события при наведении
        accentElement.addEventListener("mouseover", () => {
            // Создаем эффект частиц при наведении
            createAccentParticles(accentElement)
        })

        // Добавляем обработчик события при клике
        accentElement.addEventListener("click", function () {
            // Меняем форму на случайную при клике
            const shapes = [
                "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)", // Ромб
                "circle(50% at 50% 50%)", // Круг
            ]

            // Выбираем случайную форму
            const randomShape = shapes[Math.floor(Math.random() * shapes.length)]

            // Применяем форму
            this.style.clipPath = randomShape

            // Добавляем анимацию вращения
            this.style.transform = `rotate(${Math.floor(Math.random() * 360)}deg) scale(1.1)`

            // Возвращаем исходную форму через некоторое время
            setTimeout(() => {
                this.style.clipPath = ""
                this.style.transform = ""
                this.style.backgroundColor = ""
            }, 2000)
        })
    }

    // Функция для создания эффекта частиц
    function createAccentParticles(element) {
        // Получаем размеры и позицию элемента
        const rect = element.getBoundingClientRect()

        // Создаем 5 частиц
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement("div")

            // Стилизуем частицу
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background-color: #f0a4e2;
                border-radius: 50%;
                pointer-events: none;
                z-index: 10;
                opacity: 0.7;
            `

            // Добавляем частицу в body
            document.body.appendChild(particle)

            // Случайная начальная позиция внутри элемента
            const startX = rect.left + Math.random() * rect.width
            const startY = rect.top + Math.random() * rect.height

            // Устанавливаем начальную позицию
            particle.style.left = `${startX}px`
            particle.style.top = `${startY}px`

            // Анимируем частицу
            const angle = Math.random() * Math.PI * 2 // Случайное направление
            const distance = 50 + Math.random() * 100 // Случайное расстояние
            const duration = 1 + Math.random() // Случайная продолжительность

            // Конечная позиция
            const endX = startX + Math.cos(angle) * distance
            const endY = startY + Math.sin(angle) * distance

            // Анимация с помощью Web Animations API
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

            // Удаляем частицу после завершения анимации
            setTimeout(() => {
                particle.remove()
            }, duration * 1000)
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        // Создаем интерактивные частицы для секции скидки
        function createDiscountParticles() {
          const particlesContainer = document.getElementById("discount-particles")
          if (!particlesContainer) return
      
          const particleCount = 30
      
          for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement("div")
            particle.className = "discount-particle"
      
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
      
        createDiscountParticles()
      
        // Интерактивный эффект для заголовка скидки
        const discountTitle = document.querySelector(".discount-title")
        if (discountTitle) {
          const highlightElement = discountTitle.querySelector(".highlight")
      
          if (highlightElement) {
            highlightElement.addEventListener("mouseover", function () {
              this.style.transform = "scale(1.1)"
              this.style.color = "#ffffff"
            })
      
            highlightElement.addEventListener("mouseout", function () {
              this.style.transform = "scale(1)"
              this.style.color = "#f0a4e2"
            })
          }
        }
      
        // Интерактивный эффект для декоративных элементов
        const discountSection = document.querySelector(".discount-section")
        const circles = document.querySelectorAll(".discount-circle")
        const shapes = document.querySelectorAll(".discount-shape")
      
        if (discountSection) {
          discountSection.addEventListener("mousemove", function (e) {
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
          discountSection.addEventListener("mouseleave", () => {
            circles.forEach((circle) => {
              circle.style.transform = ""
            })
      
            shapes.forEach((shape) => {
              shape.style.transform = ""
            })
          })
        }
      
        // Эффект пульсации для кнопки
        const discountButton = document.querySelector(".discount-button")
        if (discountButton) {
          discountButton.addEventListener("mouseenter", function () {
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
        }
      })
      

});