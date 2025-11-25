// Funcionalidad del carrusel para proyectos
function initCarousel(containerSelector) {
    const carouselContainers = document.querySelectorAll(containerSelector);
    carouselContainers.forEach(carouselContainer => {
        if (!carouselContainer) return;

        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const prevBtn = carouselContainer.querySelector('.prev-btn');
        const nextBtn = carouselContainer.querySelector('.next-btn');
        let dotsContainer = carouselContainer.querySelector('.carousel-dots');

        if (!slides.length) return;

        // Crear contenedor de puntos si no existe
        if (!dotsContainer) {
            dotsContainer = document.createElement('div');
            dotsContainer.classList.add('carousel-dots');
            carouselContainer.appendChild(dotsContainer);
        } else {
            dotsContainer.innerHTML = '';
        }

        let currentSlide = 0;
        let autoPlayInterval;
        const autoPlayDelay = 8000;
        let isAnimating = false;

        slides.forEach((slide, index) => {
            slide.dataset.index = index;
        });

        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.dot');

        function showSlide(index) {
            if (isAnimating || index === currentSlide) return;

            isAnimating = true;
            slides[currentSlide].classList.remove('active');
            dots[currentSlide].classList.remove('active');

            slides[index].classList.add('active');
            dots[index].classList.add('active');

            currentSlide = index;

            setTimeout(() => {
                isAnimating = false;
            }, 200);
        }

        function nextSlide() {
            const next = (currentSlide + 1) % slides.length;
            showSlide(next);
        }

        function prevSlide() {
            const prev = (currentSlide - 1 + slides.length) % slides.length;
            showSlide(prev);
        }

        function goToSlide(index) {
            if (index < 0 || index >= slides.length) return;
            showSlide(index);
            resetAutoPlay();
        }

        function startAutoPlay() {
            if (slides.length <= 1) return;
            if (!autoPlayInterval) {
                autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
            }
        }

        function stopAutoPlay() {
            if (autoPlayInterval) {
                clearInterval(autoPlayInterval);
                autoPlayInterval = null;
            }
        }

        function resetAutoPlay() {
            stopAutoPlay();
            startAutoPlay();
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoPlay();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoPlay();
            });
        }

        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);

        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        slides[0].classList.add('active');
        dots[0].classList.add('active');
        startAutoPlay();
    });
}

// Carrusel automático para la card de Palleiro
function initPalleiroCarrusel() {
    const carrusel = document.getElementById('palleiro-carrusel');
    if (!carrusel) return;
    const imgs = carrusel.querySelectorAll('.carrusel-img');
    let idx = 0;
    setInterval(() => {
        imgs[idx].classList.remove('active');
        idx = (idx + 1) % imgs.length;
        imgs[idx].classList.add('active');
    }, 3000); // 3 segundos
}

// CURSOR PERSONALIZADO PARA PÁGINAS DE PROYECTOS INDIVIDUALES
function setupCustomCursorProjects() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;
    const body = document.body;
    body.classList.add('hide-cursor');

    window.addEventListener('mousemove', (e) => {
        if (!cursor) return;
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Elementos que activan el modo difference
    const differenceTargets = [
        ...document.querySelectorAll('.gallery-item'),
        ...document.querySelectorAll('.proyecto-card'),
        ...document.querySelectorAll('.proyecto-info-section'),
        ...document.querySelectorAll('.header-container .nav')
    ];
    differenceTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('difference');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('difference');
        });
    });

    // Efecto saturate solo en .proyecto-card
    const proyectoCards = document.querySelectorAll('.proyecto-card');
    proyectoCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.classList.add('saturate');
        });
        card.addEventListener('mouseleave', () => {
            cursor.classList.remove('saturate');
        });
    });
}

// Animación de los cards de proyectos
function animateProjectCards() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateProjectCards, 100);
        return;
    }
    gsap.utils.toArray('.proyecto-card').forEach((card, i) => {
        gsap.fromTo(card,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 90%',
                    toggleActions: 'play none none none',
                },
                delay: i * 0.10 // stagger tipo acordeón
            }
        );
    });
}

//Animación de las líneas horizontales
function animateLineSeparatorsProjects() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateLineSeparatorsProjects, 100);
        return;
    }
    gsap.utils.toArray('.line-separator, .line-separator-footer').forEach(line => {
        gsap.set(line, { scaleX: 0, transformOrigin: 'center' });
        gsap.to(line, {
            scaleX: 1,
            duration: 1,
            ease: 'expo.out',
            scrollTrigger: {
                trigger: line,
                start: 'bottom 100%',
                toggleActions: 'play none none none',
            }
        });
    });
}

//Animación de opacidad para el botón de curriculum
function animateCurriculumButton() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateCurriculumButton, 100);
        return;
    }
    const btn = document.querySelector('.curriculum-button');
    if (btn) {
        gsap.fromTo(btn,
            { opacity: 0 },
            {
                opacity: 1,
                duration: 1.1,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: btn,
                    start: 'bottom 100%',
                    toggleActions: 'play none none none',
                }
            }
        );
    }
}

//Animación de los gallery-item en proyectos individuales
function animateGalleryItems() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        setTimeout(animateGalleryItems, 100);
        return;
    }
    const items = gsap.utils.toArray('.proyecto-gallery .gallery-item');
    console.log('Gallery items encontrados:', items);
    items.forEach((item, i) => {
        gsap.fromTo(item,
            { opacity: 0, y: 40 },
            {
                opacity: 1,
                y: 0,
                duration: 1.1,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 85%',
                    toggleActions: 'play none none none',
                },
                delay: i * 0.10 // stagger tipo acordeón
            }
        );
    });
}

// Inicializar todas las animaciones de proyectos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar todos los carruseles
    initCarousel('.carousel-container');
    
    // Funcionalidad del popup de contacto
    initContactPopup();
    
    // Funcionalidad del popup del video
    initVideoPopup();
    initPalleiroCarrusel();
    setupCustomCursorProjects();
    animateProjectCards(); // Animación de los cards de proyectos
    animateLineSeparatorsProjects(); // Animación de las líneas horizontales
    animateCurriculumButton(); // Animación de opacidad para el botón de curriculum
    animateGalleryItems(); // Animación de los gallery-item en proyectos individuales

    // Selecciona todos los triggers de video
    document.querySelectorAll('.video-preview').forEach(preview => {
        const popupId = preview.getAttribute('data-popup');
        const popup = document.getElementById(popupId);
        if (!popup) return;

        const closeBtn = popup.querySelector('.video-popup-close');
        const overlay = popup.querySelector('.video-popup-overlay');

        preview.addEventListener('click', function() {
            popup.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            // Solo reproducir cuando el usuario hace clic explícitamente
            const iframe = popup.querySelector('iframe');
            if (iframe) {
                // Añadir autoplay solo cuando se hace clic
                let src = iframe.src;
                if (!src.includes('autoplay=1')) {
                    src += (src.includes('?') ? '&' : '?') + 'autoplay=1';
                }
                iframe.src = src;
            }
        });

        function closePopup() {
            popup.classList.add('hidden');
            document.body.style.overflow = '';
            // Pausar el video de Vimeo al cerrar
            const iframe = popup.querySelector('iframe');
            if (iframe) {
                const src = iframe.src.replace(/autoplay=1&?/, '');
                iframe.src = src;
            }
        }

        if (closeBtn) closeBtn.addEventListener('click', closePopup);
        if (overlay) overlay.addEventListener('click', closePopup);
    });

    const downloadBtn = document.getElementById('downloadCV');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const link = document.createElement('a');
            link.href = 'assets/Alex_Cifuentes_Curriculum.pdf';
            link.download = 'Alex_Cifuentes_Curriculum.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    }
    initBackToTop(); // Scroll suave al inicio con GSAP
});

// Funcionalidad del popup de contacto
function initContactPopup() {
    const contactFloat = document.getElementById('contact-float');
    const contactFloatClose = document.querySelector('.contact-float-close');
    const footerContact = document.querySelector('.footer-contact');
    const navContact = document.querySelector('.nav-item a[href="#contacto"]');

    if (contactFloat && contactFloatClose) {
        // Abrir popup al hacer clic en "Contact" del footer
        if (footerContact) {
            footerContact.addEventListener('click', function(e) {
                e.preventDefault();
                contactFloat.classList.remove('hidden');
                setTimeout(() => {
                    contactFloat.classList.add('show');
                }, 10);
            });
        }

        // Abrir popup al hacer clic en "¿Hablamos?" del menú
        if (navContact) {
            navContact.addEventListener('click', function(e) {
                e.preventDefault();
                contactFloat.classList.remove('hidden');
                setTimeout(() => {
                    contactFloat.classList.add('show');
                }, 10);
            });
        }

        // Cerrar popup
        contactFloatClose.addEventListener('click', function() {
            contactFloat.classList.remove('show');
            setTimeout(() => {
                contactFloat.classList.add('hidden');
            }, 400);
        });
    }
}

// Funcionalidad del popup del video
function initVideoPopup() {
    const videoContainer = document.querySelector('.video-quercus');
    const videoPopup = document.getElementById('videoPopup');
    const popupClose = document.querySelector('.video-popup-close');
    const popupOverlay = document.querySelector('.video-popup-overlay');
    const iframe = document.querySelector('.video-popup-iframe-container iframe');

    // Función para abrir el popup
    function openVideoPopup() {
        videoPopup.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevenir scroll
    }

    // Función para cerrar el popup
    function closeVideoPopup() {
        videoPopup.classList.add('hidden');
        document.body.style.overflow = ''; // Restaurar scroll
        
        // Pausar el video de Vimeo al cerrar
        if (iframe) {
            const iframeSrc = iframe.src;
            iframe.src = iframeSrc;
        }
    }

    // Event listeners
    if (videoContainer) {
        videoContainer.addEventListener('click', openVideoPopup);
    }

    if (popupClose) {
        popupClose.addEventListener('click', closeVideoPopup);
    }

    if (popupOverlay) {
        popupOverlay.addEventListener('click', closeVideoPopup);
    }

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && !videoPopup.classList.contains('hidden')) {
            closeVideoPopup();
        }
    });
}

// Funcionalidad del back to top
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        backToTop.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
                gsap.to(window, { duration: 1.2, scrollTo: { y: 0 }, ease: 'expo.inOut' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
};